import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status !== 'paid') break

        // Check if order already exists
        const existingOrder = await prisma.order.findFirst({
          where: { paymentId: session.id },
        })
        if (existingOrder) break

        const metadata = session.metadata
        if (!metadata?.userId || !metadata?.items) break

        let items: Array<{
          productId: string
          quantity: number
          size: string
          color: string
        }>

        try {
          items = JSON.parse(metadata.items)
        } catch {
          console.error('Failed to parse items metadata for session:', session.id)
          break
        }

        // Fetch product prices
        const productIds = items.map((item) => item.productId)
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, price: true, stock: true },
        })
        const productMap = new Map(products.map((p) => [p.id, p]))

        let subtotal = 0
        const orderItems = items.map((item) => {
          const product = productMap.get(item.productId)
          const price = product?.price ?? 0
          subtotal += price * item.quantity
          return {
            productId: item.productId,
            quantity: item.quantity,
            price,
            size: item.size,
            color: item.color,
          }
        })

        const total = (session.amount_total || 0) / 100
        const shipping = subtotal >= 999 ? 0 : 99
        const tax = Math.round((total - subtotal - shipping) * 100) / 100

        // Create order and decrement stock atomically
        await prisma.$transaction(async (tx) => {
          await tx.order.create({
            data: {
              userId: metadata.userId,
              subtotal,
              shipping,
              tax: tax > 0 ? tax : 0,
              total,
              paymentId: session.id,
              paymentStatus: 'paid',
              paymentMethod: 'stripe',
              shippingAddress: metadata.shippingAddress || '',
              status: 'confirmed',
              items: { create: orderItems },
            },
          })

          for (const item of items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          }
        })

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error(
          'Payment failed for intent:',
          paymentIntent.id,
          paymentIntent.last_payment_error?.message
        )
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

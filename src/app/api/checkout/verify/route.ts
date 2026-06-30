import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe, formatAmountFromStripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      )
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      )
    }

    // Check if order already created for this session
    const existingOrder = await prisma.order.findFirst({
      where: { paymentId: checkoutSession.id },
    })

    if (existingOrder) {
      return NextResponse.json(existingOrder)
    }

    // Parse metadata
    const metadata = checkoutSession.metadata
    if (!metadata) {
      return NextResponse.json(
        { error: 'Invalid session metadata' },
        { status: 400 }
      )
    }

    // Verify the checkout session belongs to the authenticated user
    if (metadata.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: session does not belong to this user' },
        { status: 403 }
      )
    }

    let items: Array<{
      productId: string
      quantity: number
      size: string
      color: string
    }>
    try {
      items = JSON.parse(metadata.items)
    } catch {
      return NextResponse.json(
        { error: 'Invalid session metadata format' },
        { status: 400 }
      )
    }
    const shippingAddress = metadata.shippingAddress

    // Fetch product prices
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    })
    const productMap = new Map(products.map((p) => [p.id, p]))

    // Calculate totals
    let subtotal = 0
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!
      subtotal += product.price * item.quantity
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        color: item.color,
      }
    })

    const total = formatAmountFromStripe(checkoutSession.amount_total || 0)
    const shipping = subtotal >= 999 ? 0 : 99
    const tax = Math.round((total - subtotal - shipping) * 100) / 100

    // Create order and decrement stock atomically
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: metadata.userId,
          subtotal,
          shipping,
          tax: tax > 0 ? tax : 0,
          total,
          paymentId: checkoutSession.id,
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          shippingAddress,
          status: 'confirmed',
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
        },
      })

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return created
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Checkout verify error:', error)
    return NextResponse.json(
      { error: 'Failed to verify checkout session' },
      { status: 500 }
    )
  }
}

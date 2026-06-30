import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limit checkout: 10 requests per 60 seconds per IP
  const ip = getClientIp(request)
  const { success } = checkRateLimit(`checkout:${ip}`, {
    maxRequests: 10,
    windowSeconds: 60,
  })
  if (!success) {
    return NextResponse.json(
      { error: 'Too many checkout attempts. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to checkout' },
        { status: 401 }
      )
    }

    const { items, shippingAddress } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart must contain at least one item' },
        { status: 400 }
      )
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    // Validate item quantities
    for (const item of items) {
      if (!item.quantity || item.quantity < 1 || item.quantity > 10 || !Number.isInteger(item.quantity)) {
        return NextResponse.json(
          { error: 'Each item quantity must be a whole number between 1 and 10' },
          { status: 400 }
        )
      }
    }

    // Fetch product details for line items
    const productIds = items.map((item: { productId: string }) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    // Validate products and build line items
    const lineItems = items.map(
      (item: { productId: string; quantity: number; size: string; color: string }) => {
        const product = productMap.get(item.productId)
        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        const images = JSON.parse(product.images) as string[]

        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: product.name,
              description: `Size: ${item.size} | Color: ${item.color}`,
              images: images.length > 0 ? [images[0]] : [],
            },
            unit_amount: formatAmountForStripe(product.price),
          },
          quantity: item.quantity,
        }
      }
    )

    // Calculate subtotal for shipping
    const subtotal = items.reduce(
      (sum: number, item: { productId: string; quantity: number }) => {
        const product = productMap.get(item.productId)
        return sum + (product ? product.price * item.quantity : 0)
      },
      0
    )

    // Add shipping if subtotal < 999
    if (subtotal < 999) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping',
            description: 'Standard delivery',
            images: [],
          },
          unit_amount: formatAmountForStripe(99),
        },
        quantity: 1,
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(
          items.map((item: { productId: string; quantity: number; size: string; color: string }) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }))
        ),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view orders' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to create an order' },
        { status: 401 }
      )
    }

    const { items, shippingAddress, billingAddress, notes } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
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

    // Fetch product prices to calculate totals
    const productIds = items.map((item: { productId: string }) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
      select: { id: true, price: true, stock: true },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    // Validate all products exist and have stock
    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found or is unavailable` },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${item.productId}` },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = items.map((item: { productId: string; quantity: number; size: string; color: string }) => {
      const product = productMap.get(item.productId)!
      const itemTotal = product.price * item.quantity
      subtotal += itemTotal
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        size: item.size,
        color: item.color,
      }
    })

    const shipping = subtotal >= 999 ? 0 : 99
    const tax = Math.round(subtotal * 0.18 * 100) / 100 // 18% GST
    const total = subtotal + shipping + tax

    // Create order and decrement stock atomically
    const order = await prisma.$transaction(async (tx) => {
      // Re-validate stock inside transaction to prevent race conditions
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        })
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`)
        }
      }

      const created = await tx.order.create({
        data: {
          userId: session.user.id,
          subtotal,
          shipping,
          tax,
          total,
          shippingAddress: JSON.stringify(shippingAddress),
          billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
          notes: notes || null,
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

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

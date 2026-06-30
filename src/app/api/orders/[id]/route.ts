import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view order details' },
        { status: 401 }
      )
    }

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
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
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Allow order owner or admin
    const isAdmin = session.user.role === 'admin'
    if (order.userId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: 'You are not authorized to view this order' },
        { status: 403 }
      )
    }

    // Parse statusHistory JSON string
    let statusHistory = []
    try {
      statusHistory =
        typeof order.statusHistory === 'string'
          ? JSON.parse(order.statusHistory)
          : order.statusHistory || []
    } catch {
      statusHistory = []
    }

    return NextResponse.json({
      ...order,
      statusHistory,
      estimatedDelivery: order.estimatedDelivery
        ? order.estimatedDelivery.toISOString()
        : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

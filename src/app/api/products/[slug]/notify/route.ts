import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { email, size } = await request.json()

    if (!email || !size) {
      return NextResponse.json(
        { error: 'Email and size are required' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.stockNotification.upsert({
      where: {
        email_productId_size: {
          email,
          productId: product.id,
          size,
        },
      },
      update: { notified: false },
      create: {
        email,
        productId: product.id,
        size,
      },
    })

    return NextResponse.json({ message: 'You will be notified when this item is back in stock' })
  } catch {
    return NextResponse.json({ error: 'Failed to register notification' }, { status: 500 })
  }
}

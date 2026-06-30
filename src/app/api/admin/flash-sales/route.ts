import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const flashSales = await prisma.flashSale.findMany({
      orderBy: { startsAt: 'desc' },
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    const serialized = flashSales.map((sale) => ({
      id: sale.id,
      title: sale.title,
      discount: sale.discount,
      startsAt: sale.startsAt.toISOString(),
      endsAt: sale.endsAt.toISOString(),
      category: sale.category,
      productId: sale.productId,
      active: sale.active,
      product: sale.product
        ? { id: sale.product.id, name: sale.product.name, slug: sale.product.slug }
        : null,
    }))

    return NextResponse.json({ flashSales: serialized })
  } catch (error) {
    console.error('Admin flash sales fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch flash sales' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, discount, startsAt, endsAt, productId, category, active } = body

    if (!title || discount == null || !startsAt || !endsAt) {
      return NextResponse.json(
        { error: 'Title, discount, start date, and end date are required' },
        { status: 400 }
      )
    }

    if (discount <= 0 || discount > 100) {
      return NextResponse.json(
        { error: 'Discount must be between 1 and 100' },
        { status: 400 }
      )
    }

    const start = new Date(startsAt)
    const end = new Date(endsAt)
    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const flashSale = await prisma.flashSale.create({
      data: {
        title,
        discount: parseFloat(discount),
        startsAt: start,
        endsAt: end,
        productId: productId || null,
        category: category || null,
        active: active ?? true,
      },
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    return NextResponse.json(flashSale, { status: 201 })
  } catch (error) {
    console.error('Admin flash sale create error:', error)
    return NextResponse.json({ error: 'Failed to create flash sale' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, active } = body

    if (!id || active == null) {
      return NextResponse.json(
        { error: 'Sale ID and active status are required' },
        { status: 400 }
      )
    }

    const flashSale = await prisma.flashSale.update({
      where: { id },
      data: { active },
    })

    return NextResponse.json(flashSale)
  } catch (error) {
    console.error('Admin flash sale update error:', error)
    return NextResponse.json({ error: 'Failed to update flash sale' }, { status: 500 })
  }
}

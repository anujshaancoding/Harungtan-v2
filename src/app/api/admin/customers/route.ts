import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const search = request.nextUrl.searchParams.get('search') || ''
    const tag = request.nextUrl.searchParams.get('tag') || ''
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = 20

    const where: Record<string, unknown> = { role: 'customer' }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }
    if (tag) {
      where.tags = { some: { tag: { name: tag } } }
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          tags: { include: { tag: true } },
          orders: { select: { total: true, createdAt: true } },
          _count: { select: { orders: true, reviews: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    const serialized = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt.toISOString(),
      tags: c.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, color: t.tag.color })),
      orderCount: c._count.orders,
      reviewCount: c._count.reviews,
      totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
      lastOrderDate: c.orders.length > 0
        ? c.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt.toISOString()
        : null,
    }))

    return NextResponse.json({ customers: serialized, total, page, pages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

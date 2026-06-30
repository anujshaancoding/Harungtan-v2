import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tags = await prisma.customerTag.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      tags: tags.map((t) => ({ ...t, userCount: t._count.users })),
    })
  } catch {
    return NextResponse.json({ tags: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, color } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 })
    }

    const tag = await prisma.customerTag.create({
      data: { name: name.trim(), color: color || '#6B7280' },
    })

    return NextResponse.json({ tag })
  } catch {
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}

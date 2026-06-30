import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sections = await prisma.homeSection.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ sections })
  } catch {
    return NextResponse.json({ sections: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, title, config, active } = await request.json()

    const maxOrder = await prisma.homeSection.aggregate({ _max: { sortOrder: true } })
    const section = await prisma.homeSection.create({
      data: {
        type,
        title,
        config: JSON.stringify(config || {}),
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
        active: active ?? true,
      },
    })

    return NextResponse.json({ section })
  } catch {
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sections } = await request.json()

    // Batch update sort orders
    const updates = sections.map((s: { id: string; sortOrder: number; active?: boolean }) =>
      prisma.homeSection.update({
        where: { id: s.id },
        data: { sortOrder: s.sortOrder, ...(s.active !== undefined && { active: s.active }) },
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update sections' }, { status: 500 })
  }
}

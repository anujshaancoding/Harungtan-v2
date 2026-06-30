import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tests = await prisma.aBTest.findMany({
      include: {
        events: {
          select: { variant: true, event: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const serialized = tests.map((test) => {
      const aViews = test.events.filter((e) => e.variant === 'A' && e.event === 'view').length
      const bViews = test.events.filter((e) => e.variant === 'B' && e.event === 'view').length
      const aClicks = test.events.filter((e) => e.variant === 'A' && e.event === 'click').length
      const bClicks = test.events.filter((e) => e.variant === 'B' && e.event === 'click').length
      const aConversions = test.events.filter((e) => e.variant === 'A' && e.event === 'convert').length
      const bConversions = test.events.filter((e) => e.variant === 'B' && e.event === 'convert').length

      return {
        id: test.id,
        name: test.name,
        description: test.description,
        active: test.active,
        traffic: test.traffic,
        createdAt: test.createdAt.toISOString(),
        results: {
          A: { views: aViews, clicks: aClicks, conversions: aConversions, ctr: aViews ? (aClicks / aViews * 100).toFixed(1) : '0' },
          B: { views: bViews, clicks: bClicks, conversions: bConversions, ctr: bViews ? (bClicks / bViews * 100).toFixed(1) : '0' },
        },
      }
    })

    return NextResponse.json({ tests: serialized })
  } catch {
    return NextResponse.json({ tests: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, variantA, variantB, traffic } = await request.json()

    const test = await prisma.aBTest.create({
      data: {
        name,
        description,
        variantA: JSON.stringify(variantA || {}),
        variantB: JSON.stringify(variantB || {}),
        traffic: traffic || 50,
      },
    })

    return NextResponse.json({ test })
  } catch {
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 })
  }
}

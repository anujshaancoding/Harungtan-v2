import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const events = await prisma.socialProofEvent.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { name: true, slug: true, images: true },
        },
      },
    })

    const serialized = events.map((e) => ({
      id: e.id,
      name: e.name,
      city: e.city,
      productName: e.product.name,
      productSlug: e.product.slug,
      productImage: (() => {
        try {
          return JSON.parse(e.product.images)[0] || ''
        } catch {
          return ''
        }
      })(),
      createdAt: e.createdAt.toISOString(),
    }))

    return NextResponse.json({ events: serialized })
  } catch {
    return NextResponse.json({ events: [] })
  }
}

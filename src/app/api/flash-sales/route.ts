import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()

    const flashSales = await prisma.flashSale.findMany({
      where: {
        active: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      include: {
        product: {
          select: { name: true, slug: true, images: true, price: true },
        },
      },
      orderBy: { endsAt: 'asc' },
    })

    const serialized = flashSales.map((sale) => ({
      id: sale.id,
      title: sale.title,
      discount: sale.discount,
      endsAt: sale.endsAt.toISOString(),
      startsAt: sale.startsAt.toISOString(),
      category: sale.category,
      product: sale.product
        ? {
            name: sale.product.name,
            slug: sale.product.slug,
            price: sale.product.price,
            image: (() => {
              try { return JSON.parse(sale.product!.images)[0] || '' } catch { return '' }
            })(),
          }
        : null,
    }))

    return NextResponse.json({ flashSales: serialized })
  } catch {
    return NextResponse.json({ flashSales: [] })
  }
}

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getRecommendations } from '@/lib/recommendations'

export async function GET() {
  try {
    const session = await auth()
    const userId = session?.user?.id

    const productIds = await getRecommendations(userId)

    if (productIds.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    })

    const serialized = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      sizes: JSON.parse(p.sizes),
      colors: JSON.parse(p.colors),
      sizeStock: p.sizeStock ? JSON.parse(p.sizeStock) : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))

    return NextResponse.json({ products: serialized })
  } catch {
    return NextResponse.json({ products: [] })
  }
}

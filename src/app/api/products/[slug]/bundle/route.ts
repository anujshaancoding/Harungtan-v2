import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, gender: true, category: true, price: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Find complementary products: same gender, different category
    const bundleProducts = await prisma.product.findMany({
      where: {
        active: true,
        gender: product.gender,
        category: { not: product.category },
        id: { not: product.id },
        stock: { gt: 0 },
      },
      take: 3,
      orderBy: [
        { bestseller: 'desc' },
        { rating: 'desc' },
      ],
    })

    const serialized = bundleProducts.map((p) => ({
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

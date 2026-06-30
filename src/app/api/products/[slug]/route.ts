import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { serializeProduct } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug, active: true },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const response = NextResponse.json(serializeProduct(product))
    // Cache individual product for 2 minutes, stale for 10min while revalidating
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=120, stale-while-revalidate=600'
    )
    return response
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

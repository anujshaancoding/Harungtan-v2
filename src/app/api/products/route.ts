import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { serializeProduct } from '@/types'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per 60 seconds per IP
  const ip = getClientIp(request)
  const { success } = checkRateLimit(`products:${ip}`, {
    maxRequests: 60,
    windowSeconds: 60,
  })
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)

    // Support fetching products by IDs (for wishlist, etc.)
    const ids = searchParams.get('ids')
    if (ids) {
      const idList = ids.split(',').filter(Boolean)
      const products = await prisma.product.findMany({
        where: { id: { in: idList }, active: true },
      })
      return NextResponse.json({
        products: products.map(serializeProduct),
      })
    }

    const category = searchParams.get('category')
    const gender = searchParams.get('gender')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sizes = searchParams.get('sizes')
    const colors = searchParams.get('colors')
    const sort = searchParams.get('sort') || 'newest'
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const bestseller = searchParams.get('bestseller')
    const newArrival = searchParams.get('newArrival')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))

    // Build where clause
    const where: Record<string, unknown> = {
      active: true,
    }

    if (category) {
      where.category = category
    }

    if (gender) {
      where.gender = gender
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        const min = parseFloat(minPrice)
        if (Number.isFinite(min) && min >= 0) {
          (where.price as Record<string, number>).gte = min
        }
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice)
        if (Number.isFinite(max) && max >= 0) {
          (where.price as Record<string, number>).lte = max
        }
      }
    }

    if (sizes) {
      // sizes stored as JSON string in DB, use contains for filtering
      const sizeList = sizes.split(',')
      where.OR = sizeList.map((size: string) => ({
        sizes: { contains: size.trim() },
      }))
    }

    if (colors) {
      const colorList = colors.split(',')
      const colorConditions = colorList.map((color: string) => ({
        colors: { contains: color.trim() },
      }))
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: colorConditions }]
        delete where.OR
      } else {
        where.OR = colorConditions
      }
    }

    if (search) {
      const searchCondition = {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
          { category: { contains: search } },
        ],
      }
      if (where.AND) {
        (where.AND as Record<string, unknown>[]).push(searchCondition)
      } else if (where.OR) {
        where.AND = [{ OR: where.OR }, searchCondition]
        delete where.OR
      } else {
        where.AND = [searchCondition]
      }
    }

    if (featured === 'true') where.featured = true
    if (bestseller === 'true') where.bestseller = true
    if (newArrival === 'true') where.newArrival = true

    // Build orderBy
    let orderBy: Record<string, string> = {}
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'bestseller':
        orderBy = { reviewCount: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    const response = NextResponse.json({
      products: products.map(serializeProduct),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })

    // Cache product listings for 60s, serve stale for 5min while revalidating
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )

    return response
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

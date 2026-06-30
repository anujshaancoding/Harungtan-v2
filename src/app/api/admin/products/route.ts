import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { serializeProduct } from '@/types'
import { generateSlug } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))

    // Build where clause - admin sees all products including inactive
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ]
    }

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
      case 'oldest':
        orderBy = { createdAt: 'asc' }
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

    return NextResponse.json({
      products: products.map(serializeProduct),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      name,
      description,
      price,
      comparePrice,
      category,
      subcategory,
      gender,
      images,
      sizes,
      colors,
      material,
      careInfo,
      featured,
      bestseller,
      newArrival,
      stock,
      active,
    } = body

    // Validate required fields
    if (!name || !description || !price || !category || !gender || !sizes || !colors) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category, gender, sizes, colors' },
        { status: 400 }
      )
    }

    const slug = generateSlug(name)

    // Check for duplicate slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with a similar name already exists' },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        category,
        subcategory: subcategory || null,
        gender,
        images: JSON.stringify(images || []),
        sizes: JSON.stringify(sizes),
        colors: JSON.stringify(colors),
        material: material || null,
        careInfo: careInfo || null,
        featured: featured ?? false,
        bestseller: bestseller ?? false,
        newArrival: newArrival ?? false,
        stock: stock ? parseInt(stock, 10) : 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(serializeProduct(product), { status: 201 })
  } catch (error) {
    console.error('Admin product create error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

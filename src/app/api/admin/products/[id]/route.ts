import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { serializeProduct } from '@/types'
import { generateSlug } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(serializeProduct(product))
  } catch (error) {
    console.error('Admin product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
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

    // Build update data with only provided fields
    const data: Record<string, unknown> = {}

    if (name !== undefined) {
      data.name = name
      // Regenerate slug when name changes
      const newSlug = generateSlug(name)
      if (newSlug !== existingProduct.slug) {
        const slugConflict = await prisma.product.findFirst({
          where: { slug: newSlug, id: { not: id } },
        })
        if (slugConflict) {
          return NextResponse.json(
            { error: 'A product with a similar name already exists' },
            { status: 409 }
          )
        }
        data.slug = newSlug
      }
    }

    if (description !== undefined) data.description = description
    if (price !== undefined) data.price = parseFloat(price)
    if (comparePrice !== undefined) data.comparePrice = comparePrice ? parseFloat(comparePrice) : null
    if (category !== undefined) data.category = category
    if (subcategory !== undefined) data.subcategory = subcategory || null
    if (gender !== undefined) data.gender = gender
    if (images !== undefined) data.images = JSON.stringify(images)
    if (sizes !== undefined) data.sizes = JSON.stringify(sizes)
    if (colors !== undefined) data.colors = JSON.stringify(colors)
    if (material !== undefined) data.material = material || null
    if (careInfo !== undefined) data.careInfo = careInfo || null
    if (featured !== undefined) data.featured = featured
    if (bestseller !== undefined) data.bestseller = bestseller
    if (newArrival !== undefined) data.newArrival = newArrival
    if (stock !== undefined) data.stock = parseInt(stock, 10)
    if (active !== undefined) data.active = active

    const product = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json(serializeProduct(product))
  } catch (error) {
    console.error('Admin product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Admin product delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

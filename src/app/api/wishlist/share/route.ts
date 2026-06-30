import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Product IDs are required' }, { status: 400 })
    }

    // Generate unique share code
    const shareCode = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)

    const share = await prisma.wishlistShare.create({
      data: {
        userId: session.user.id,
        shareCode,
        products: JSON.stringify(productIds),
      },
    })

    return NextResponse.json({
      shareCode: share.shareCode,
      shareUrl: `/wishlist/shared/${share.shareCode}`,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'Share code is required' }, { status: 400 })
    }

    const share = await prisma.wishlistShare.findUnique({
      where: { shareCode: code },
      include: { user: { select: { name: true } } },
    })

    if (!share) {
      return NextResponse.json({ error: 'Share link not found' }, { status: 404 })
    }

    const productIds = JSON.parse(share.products)
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

    return NextResponse.json({
      sharedBy: share.user.name || 'Someone',
      products: serialized,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch shared wishlist' }, { status: 500 })
  }
}

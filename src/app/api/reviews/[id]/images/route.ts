import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: reviewId } = await params

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    })

    if (!review || review.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not your review' }, { status: 403 })
    }

    const { imageUrls } = await request.json()

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    const images = await Promise.all(
      imageUrls.map((url: string, i: number) =>
        prisma.reviewImage.create({
          data: { reviewId, imageUrl: url, sortOrder: i },
        })
      )
    )

    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ error: 'Failed to add images' }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params

    const images = await prisma.reviewImage.findMany({
      where: { reviewId },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

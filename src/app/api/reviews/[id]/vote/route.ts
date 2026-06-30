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
    const { helpful } = await request.json()

    const existing = await prisma.reviewVote.findUnique({
      where: { reviewId_userId: { reviewId, userId: session.user.id } },
    })

    if (existing) {
      if (existing.helpful === helpful) {
        // Remove vote
        await prisma.reviewVote.delete({ where: { id: existing.id } })
        await prisma.review.update({
          where: { id: reviewId },
          data: { helpfulCount: { decrement: helpful ? 1 : 0 } },
        })
        return NextResponse.json({ voted: false })
      }
      // Change vote
      await prisma.reviewVote.update({
        where: { id: existing.id },
        data: { helpful },
      })
      await prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: helpful ? 1 : -1 } },
      })
      return NextResponse.json({ voted: true, helpful })
    }

    await prisma.reviewVote.create({
      data: { reviewId, userId: session.user.id, helpful },
    })

    if (helpful) {
      await prisma.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ voted: true, helpful })
  } catch {
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}

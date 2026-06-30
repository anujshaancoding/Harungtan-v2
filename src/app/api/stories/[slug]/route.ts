import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { serializePost } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = await prisma.post.findUnique({
      where: { slug, published: true },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(serializePost(post))
  } catch (error) {
    console.error('Story fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}

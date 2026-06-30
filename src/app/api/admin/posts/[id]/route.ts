import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { serializePost } from '@/types'
import { generateSlug } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(serializePost(post))
  } catch (error) {
    console.error('Admin post fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
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
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      coverImage,
      tags,
      published,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = body

    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const data: Record<string, unknown> = {}

    if (title !== undefined) {
      data.title = title
      if (title !== existingPost.title) {
        data.slug = generateSlug(title)
      }
    }
    if (excerpt !== undefined) data.excerpt = excerpt
    if (content !== undefined) {
      data.content = content
      data.readTime = Math.ceil(content.split(/\s+/).length / 200)
    }
    if (coverImage !== undefined) data.coverImage = coverImage || null
    if (tags !== undefined) data.tags = JSON.stringify(tags)
    if (published !== undefined) data.published = published
    if (seoTitle !== undefined) data.seoTitle = seoTitle || null
    if (seoDescription !== undefined) data.seoDescription = seoDescription || null
    if (seoKeywords !== undefined) data.seoKeywords = seoKeywords || null

    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })

    return NextResponse.json(serializePost(post))
  } catch (error) {
    console.error('Post update error:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
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
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    await prisma.post.delete({ where: { id } })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Post deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}

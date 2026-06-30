import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const banners = await prisma.heroBanner.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ banners })
  } catch (error) {
    console.error('Admin banners fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, subtitle, description, mediaUrl, mediaType, ctaText, ctaLink, ctaText2, ctaLink2, sortOrder, active } = body

    if (!title || !mediaUrl) {
      return NextResponse.json({ error: 'Title and media URL are required' }, { status: 400 })
    }

    const banner = await prisma.heroBanner.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        mediaUrl,
        mediaType: mediaType || 'image',
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        ctaText2: ctaText2 || null,
        ctaLink2: ctaLink2 || null,
        sortOrder: sortOrder ?? 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('Admin banner create error:', error)
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 })
  }
}

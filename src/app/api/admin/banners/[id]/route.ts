import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle ?? null,
        description: body.description ?? null,
        mediaUrl: body.mediaUrl,
        mediaType: body.mediaType || 'image',
        ctaText: body.ctaText ?? null,
        ctaLink: body.ctaLink ?? null,
        ctaText2: body.ctaText2 ?? null,
        ctaLink2: body.ctaLink2 ?? null,
        sortOrder: body.sortOrder ?? 0,
        active: body.active ?? true,
      },
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Admin banner update error:', error)
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.heroBanner.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin banner delete error:', error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    const where: Record<string, unknown> = {}
    if (section) where.section = section

    const images = await prisma.siteImage.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Admin site images fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch site images' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { section, key, label, imageUrl, link, sortOrder, active } = body

    if (!section || !key || !label || !imageUrl) {
      return NextResponse.json({ error: 'Section, key, label, and image URL are required' }, { status: 400 })
    }

    const image = await prisma.siteImage.upsert({
      where: { section_key: { section, key } },
      update: { label, imageUrl, link: link || null, sortOrder: sortOrder ?? 0, active: active ?? true },
      create: { section, key, label, imageUrl, link: link || null, sortOrder: sortOrder ?? 0, active: active ?? true },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Admin site image create error:', error)
    return NextResponse.json({ error: 'Failed to create site image' }, { status: 500 })
  }
}

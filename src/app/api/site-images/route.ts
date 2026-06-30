import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    const where: Record<string, unknown> = { active: true }
    if (section) where.section = section

    const images = await prisma.siteImage.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Site images fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch site images' }, { status: 500 })
  }
}

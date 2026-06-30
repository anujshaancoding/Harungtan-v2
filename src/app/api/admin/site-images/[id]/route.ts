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

    const image = await prisma.siteImage.update({
      where: { id },
      data: {
        label: body.label,
        imageUrl: body.imageUrl,
        link: body.link ?? null,
        sortOrder: body.sortOrder ?? 0,
        active: body.active ?? true,
      },
    })

    return NextResponse.json(image)
  } catch (error) {
    console.error('Admin site image update error:', error)
    return NextResponse.json({ error: 'Failed to update site image' }, { status: 500 })
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
    await prisma.siteImage.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin site image delete error:', error)
    return NextResponse.json({ error: 'Failed to delete site image' }, { status: 500 })
  }
}

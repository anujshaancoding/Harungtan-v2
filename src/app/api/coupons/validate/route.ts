import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json()

    if (!code) {
      return NextResponse.json({ message: 'Coupon code is required' }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon || !coupon.active) {
      return NextResponse.json({ message: 'Invalid coupon code' }, { status: 400 })
    }

    const now = new Date()
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return NextResponse.json({ message: 'This coupon has expired' }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ message: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return NextResponse.json(
        { message: `Minimum order value of ₹${coupon.minOrderValue} required` },
        { status: 400 }
      )
    }

    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount
      }
    } else {
      discount = coupon.discountValue
    }

    discount = Math.min(discount, subtotal)

    return NextResponse.json({
      discount: Math.round(discount * 100) / 100,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    })
  } catch {
    return NextResponse.json({ message: 'Failed to validate coupon' }, { status: 500 })
  }
}

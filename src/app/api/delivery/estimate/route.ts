import { NextRequest, NextResponse } from 'next/server'
import { getEstimatedDeliveryDates } from '@/lib/delivery'

export async function POST(request: NextRequest) {
  try {
    const { pincode } = await request.json()

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: 'Valid 6-digit pincode is required' },
        { status: 400 }
      )
    }

    const estimate = getEstimatedDeliveryDates(pincode)

    if (!estimate.available) {
      return NextResponse.json(
        { error: 'Delivery not available for this pincode' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      minDate: estimate.minDate.toISOString(),
      maxDate: estimate.maxDate.toISOString(),
      zone: estimate.zone,
      available: estimate.available,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to estimate delivery' },
      { status: 500 }
    )
  }
}

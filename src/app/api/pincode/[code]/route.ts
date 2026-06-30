import { NextRequest, NextResponse } from 'next/server'
import { lookupPincode } from '@/lib/delivery'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
    }

    const result = lookupPincode(code)

    if (!result) {
      return NextResponse.json({ error: 'Pincode not found in database' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to lookup pincode' }, { status: 500 })
  }
}

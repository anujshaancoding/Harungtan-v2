import type { Metadata } from 'next'
import OrderDetailClient from './OrderDetailClient'

export const metadata: Metadata = {
  title: 'Order Details | Harungtan',
}

export default function OrderDetailPage() {
  return <OrderDetailClient />
}

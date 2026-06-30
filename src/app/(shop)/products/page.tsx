import type { Metadata } from 'next'
import ProductsPageClient from './ProductsPageClient'

export const metadata: Metadata = {
  title: 'Shop All Products | Harungtan',
  description:
    'Browse our complete collection of premium t-shirts. Filter by category, size, color, price and more. Free shipping on orders above Rs. 999.',
  openGraph: {
    title: 'Shop All Products | Harungtan',
    description:
      'Browse our complete collection of premium t-shirts. Filter by category, size, color, price and more.',
  },
}

export default function ProductsPage() {
  return <ProductsPageClient />
}

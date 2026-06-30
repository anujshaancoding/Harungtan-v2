'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import type { Product } from '@/types'

export default function SharedWishlistPage({ params }: { params: Promise<{ code: string }> }) {
  const [products, setProducts] = useState<Product[]>([])
  const [sharedBy, setSharedBy] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { code } = await params
      try {
        const res = await fetch(`/api/wishlist/share?code=${code}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products)
          setSharedBy(data.sharedBy)
        } else {
          setError('This wishlist link is no longer available')
        }
      } catch {
        setError('Failed to load wishlist')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Heart size={48} strokeWidth={1} className="mx-auto mb-4" style={{ color: 'var(--border)' }} />
        <h1 className="heading-editorial text-2xl" style={{ color: 'var(--foreground)' }}>{error}</h1>
        <a href="/products" className="mt-6 inline-flex items-center gap-2 btn-primary px-6 py-3 text-[12px] tracking-[0.15em] uppercase">
          <ShoppingBag size={16} strokeWidth={1.5} />
          Browse Products
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="subheading mb-2" style={{ color: 'var(--accent)' }}>
          Shared Wishlist
        </p>
        <h1 className="heading-editorial text-2xl sm:text-3xl" style={{ color: 'var(--foreground)' }}>
          {sharedBy}&apos;s Favorites
        </h1>
        <div className="divider-accent mt-3" />
        <p className="mt-3 text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
          {products.length} {products.length === 1 ? 'item' : 'items'} in this wishlist
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  )
}

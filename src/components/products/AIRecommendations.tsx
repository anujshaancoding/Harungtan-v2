'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'

interface AIRecommendationsProps {
  className?: string
}

export function AIRecommendations({ className }: AIRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch('/api/recommendations')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }

    // Delay to not block main content
    const timer = setTimeout(fetchRecs, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading || products.length === 0) return null

  return (
    <section className={cn('', className)}>
      <div className="mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Sparkles size={18} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
          <p className="subheading" style={{ color: 'var(--accent)' }}>
            Picked For You
          </p>
        </div>
        <h2 className="heading-editorial text-2xl sm:text-3xl" style={{ color: 'var(--foreground)' }}>
          Recommended For You
        </h2>
        <div className="divider-accent-center mx-auto mt-4" />
      </div>

      <ProductGrid products={products} />
    </section>
  )
}

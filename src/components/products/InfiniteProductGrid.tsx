'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import type { Product } from '@/types'

interface InfiniteProductGridProps {
  initialProducts: Product[]
  initialTotal: number
  filterParams: string // URL search params string
  pageSize?: number
}

export function InfiniteProductGrid({
  initialProducts,
  initialTotal,
  filterParams,
  pageSize = 20,
}: InfiniteProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProducts.length < initialTotal)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Reset when filters change
  useEffect(() => {
    setProducts(initialProducts)
    setPage(1)
    setHasMore(initialProducts.length < initialTotal)
  }, [initialProducts, initialTotal])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const nextPage = page + 1
      const separator = filterParams ? '&' : '?'
      const url = `/api/products?${filterParams}${separator}page=${nextPage}&limit=${pageSize}`
      const res = await fetch(url)

      if (res.ok) {
        const data = await res.json()
        const newProducts = data.products || []

        if (newProducts.length === 0) {
          setHasMore(false)
        } else {
          setProducts((prev) => [...prev, ...newProducts])
          setPage(nextPage)
          setHasMore(products.length + newProducts.length < (data.total || initialTotal))
        }
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, filterParams, pageSize, products.length, initialTotal])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div>
      <ProductGrid products={products} />

      {/* Sentinel for intersection observer */}
      <div ref={sentinelRef} className="h-px" />

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2
            size={24}
            strokeWidth={1.5}
            className="animate-spin"
            style={{ color: 'var(--muted-foreground)' }}
          />
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p
          className="py-8 text-center text-[12px] tracking-[0.1em] uppercase"
          style={{ color: 'var(--muted-foreground)' }}
        >
          You&apos;ve seen all {products.length} products
        </p>
      )}
    </div>
  )
}

'use client'

import { memo, useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  className?: string
}

function ProductSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="overflow-hidden border opacity-0 animate-fadeIn"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--background)',
        animationDelay: `${index * 80}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Image placeholder */}
      <div
        className="animate-shimmer aspect-[3/4]"
        style={{ backgroundColor: 'var(--muted)' }}
      />
      {/* Content area */}
      <div className="space-y-3 p-2.5 sm:p-4">
        {/* Title */}
        <div
          className="animate-shimmer h-3 w-3/4"
          style={{ backgroundColor: 'var(--border)' }}
        />
        {/* Stars */}
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="animate-shimmer h-2.5 w-2.5"
              style={{ backgroundColor: 'var(--border)' }}
            />
          ))}
        </div>
        {/* Price */}
        <div className="flex items-center gap-2">
          <div
            className="animate-shimmer h-3 w-20"
            style={{ backgroundColor: 'var(--border)' }}
          />
          <div
            className="animate-shimmer h-2.5 w-14"
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>
      </div>
    </div>
  )
}

// Wrapper that animates each card on mount with staggered delays
function AnimatedCard({ product, index }: { product: Product; index: number }) {
  return (
    <div
      className="animate-card-enter"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <ProductCard product={product} />
    </div>
  )
}

// Memoized animated card
const MemoizedAnimatedCard = memo(AnimatedCard, (prev, next) => prev.product.id === next.product.id && prev.index === next.index)

export function ProductGrid({ products, loading = false, className }: ProductGridProps) {
  // Track previous products to detect actual changes (new filter results)
  const prevProductIdsRef = useRef<string>('')
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const currentIds = products.map(p => p.id).join(',')
    if (currentIds !== prevProductIdsRef.current && prevProductIdsRef.current !== '') {
      // Products changed — trigger re-animation
      setAnimationKey(k => k + 1)
    }
    prevProductIdsRef.current = currentIds
  }, [products])

  if (loading) {
    return (
      <div
        className={cn(
          'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4',
          className
        )}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <ProductSkeleton key={i} index={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        {/* Icon */}
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center border"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
        >
          <Search size={28} strokeWidth={1.5} style={{ color: 'var(--muted-foreground)' }} />
        </div>

        <h3
          className="heading-editorial mb-2 text-xl font-normal"
          style={{ color: 'var(--foreground)' }}
        >
          No products found
        </h3>
        <p
          className="mb-8 max-w-sm text-[13px] leading-relaxed tracking-wide"
          style={{ color: 'var(--muted-foreground)' }}
        >
          We couldn&apos;t find anything matching your current filters. Try adjusting your search or browse our popular categories below.
        </p>

        {/* Suggestions */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {[
            { label: 'Round Neck', slug: 'round-neck' },
            { label: 'Oversized', slug: 'oversized' },
            { label: 'Graphic Tees', slug: 'graphic-tees' },
            { label: 'Polo', slug: 'polo' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="inline-flex items-center gap-1.5 border px-4 py-2 text-[12px] font-medium tracking-wide uppercase transition-all hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Reset action */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              window.history.pushState(null, '', '/products')
              window.location.reload()
            }}
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase transition-colors hover:text-[var(--foreground)]"
            style={{ color: 'var(--accent)' }}
          >
            <SlidersHorizontal size={14} strokeWidth={1.5} />
            Clear All Filters
          </button>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase transition-colors hover:text-[var(--foreground)]"
            style={{ color: 'var(--muted-foreground)' }}
          >
            View All Products
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      key={animationKey}
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {products.map((product, i) => (
        <MemoizedAnimatedCard key={product.id} product={product} index={i} />
      ))}
    </div>
  )
}

export default ProductGrid

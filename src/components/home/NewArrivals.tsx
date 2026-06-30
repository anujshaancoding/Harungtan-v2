'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/types'

function ProductSkeleton() {
  return (
    <div className="w-[260px] flex-shrink-0 sm:w-[280px]">
      <div className="aspect-[3/4] animate-shimmer" />
      <div className="mt-4 space-y-2.5">
        <div className="h-4 w-3/4 animate-shimmer" />
        <div className="h-3 w-1/2 animate-shimmer" />
        <div className="h-4 w-1/3 animate-shimmer" />
      </div>
    </div>
  )
}

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?newArrival=true&limit=8')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products ?? data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = direction === 'left' ? -300 : 300
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="bg-[var(--muted)] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with navigation arrows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="subheading mb-3">Just Dropped</p>
            <h2 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl lg:text-5xl">
              New Arrivals
            </h2>
            <div className="divider-accent mt-5" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="hidden h-11 w-11 items-center justify-center border border-[var(--border)] text-[var(--foreground)] transition-all duration-200 hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white sm:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden h-11 w-11 items-center justify-center border border-[var(--border)] text-[var(--foreground)] transition-all duration-200 hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white sm:flex"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <Link
              href="/products?sort=newest"
              className="hidden items-center gap-2 ml-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)] lg:inline-flex"
            >
              View All
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroll carousel — full bleed */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {/* Left spacer for max-w-7xl alignment */}
        <div className="hidden flex-shrink-0 lg:block" style={{ width: 'calc((100vw - 80rem) / 2)' }} />

        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-[260px] flex-shrink-0 sm:w-[280px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}

        {/* Right spacer */}
        <div className="hidden flex-shrink-0 lg:block" style={{ width: 'calc((100vw - 80rem) / 2)' }} />
      </div>

      {!loading && products.length === 0 && (
        <p className="py-12 text-center text-[var(--muted-foreground)]">
          New arrivals coming soon.
        </p>
      )}

      <div className="mt-10 text-center sm:hidden">
        <Link
          href="/products?sort=newest"
          className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          View All New Arrivals
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  )
}

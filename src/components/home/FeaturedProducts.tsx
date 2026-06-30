'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/types'

const PAGE_SIZE = 4

function ProductSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] animate-shimmer rounded-none" />
      <div className="mt-4 space-y-2.5">
        <div className="h-4 w-3/4 rounded animate-shimmer" />
        <div className="h-3 w-1/2 rounded animate-shimmer" />
        <div className="h-4 w-1/3 rounded animate-shimmer" />
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?featured=true&limit=12')
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

  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const currentProducts = products.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const goNext = () => {
    if (page < totalPages - 1) {
      setDirection(1)
      setPage((p) => p + 1)
    }
  }

  const goPrev = () => {
    if (page > 0) {
      setDirection(-1)
      setPage((p) => p - 1)
    }
  }

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -60 : 60,
    }),
  }

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-14 flex items-end justify-between"
        >
          <div>
            <p className="subheading mb-3">Curated for You</p>
            <h2 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl">
              Featured Collection
            </h2>
            <div className="divider-accent mt-4" />
          </div>

          <div className="flex items-center gap-3">
            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={page === 0}
                className="flex h-10 w-10 items-center justify-center border border-[var(--border)] text-[var(--foreground)] transition-all duration-200 hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--primary-foreground)] disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={goNext}
                disabled={page >= totalPages - 1}
                className="flex h-10 w-10 items-center justify-center border border-[var(--border)] text-[var(--foreground)] transition-all duration-200 hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--primary-foreground)] disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)] sm:inline-flex"
            >
              View All
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </motion.div>

        {/* Product grid with page animation */}
        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6"
              >
                {currentProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="py-12 text-center text-[var(--muted-foreground)]">
              No featured products available right now.
            </p>
          )}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            View All Products
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { cn, formatPrice, getDiscountPercentage } from '@/lib/utils'
import type { Product } from '@/types'

function BestsellerSkeleton({ large }: { large?: boolean }) {
  return (
    <div className={large ? 'col-span-2 row-span-2' : ''}>
      <div className={cn('animate-shimmer', large ? 'aspect-square' : 'aspect-[3/4]')} />
      <div className="mt-4 space-y-2.5">
        <div className="h-5 w-3/4 animate-shimmer" />
        <div className="h-4 w-1/2 animate-shimmer" />
      </div>
    </div>
  )
}

function BestsellerCard({ product, large }: { product: Product; large?: boolean }) {
  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0
  const imageSrc = product.images?.[0] || '/placeholder.png'

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn('group block', large && 'col-span-2 row-span-2')}
    >
      <div className={cn(
        'relative overflow-hidden bg-[var(--muted)]',
        large ? 'aspect-square' : 'aspect-[3/4]'
      )}>
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes={large ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-[var(--foreground)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            -{discount}%
          </span>
        )}
        <span className="absolute right-3 top-3 bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
          Bestseller
        </span>

        {/* Hover overlay with quick info on large card */}
        {large && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="w-full p-6 lg:p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/70">
                {product.category}
              </p>
              <h3 className="heading-editorial mt-1 text-xl text-white lg:text-2xl">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-white/50 line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product info — shown for small cards */}
      {!large && (
        <div className="mt-4 space-y-1.5">
          <h3 className="text-sm font-semibold text-[var(--foreground)] line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] capitalize text-[var(--muted-foreground)] tracking-wide">
            {product.category}
          </p>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={cn(
                    i < Math.round(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-[var(--border)] text-[var(--border)]'
                  )}
                />
              ))}
              <span className="ml-1 text-[10px] text-[var(--muted-foreground)]">
                ({product.reviewCount})
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[var(--foreground)]">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[11px] text-[var(--muted-foreground)] line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  )
}

export default function BestsellerSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?bestseller=true&limit=5')
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

  const featured = products[0]
  const rest = products.slice(1, 5)

  return (
    <section className="px-4 pt-20 pb-10 sm:px-6 lg:px-8 lg:pt-28 lg:pb-14">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-14 flex items-end justify-between"
        >
          <div>
            <p className="subheading mb-3">Most Loved</p>
            <h2 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl lg:text-5xl">
              Bestsellers
            </h2>
            <div className="divider-accent mt-5" />
          </div>
          <Link
            href="/products?sort=bestselling"
            className="hidden items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)] sm:inline-flex"
          >
            View All
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </motion.div>

        {/* Asymmetric Grid: 1 large + 4 small */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            <BestsellerSkeleton large />
            {Array.from({ length: 4 }).map((_, i) => (
              <BestsellerSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {/* Featured large card */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col-span-2 row-span-2 flex flex-col"
              >
                <BestsellerCard product={featured} large />
                <div className="flex-1 flex items-center justify-center min-h-[40px]">
                  <p className="heading-editorial text-5xl lg:text-6xl italic text-[var(--foreground)] opacity-[0.15] select-none">
                    Obsessed.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Smaller cards */}
            {rest.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                <BestsellerCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-[var(--muted-foreground)]">
            Bestsellers coming soon.
          </p>
        )}

        {/* Mobile View All */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products?sort=bestselling"
            className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            View All Bestsellers
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}

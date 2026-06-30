'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { ProductDetails } from '@/components/products/ProductDetails'
import { ProductReviews } from '@/components/products/ProductReviews'
import { ProductGrid } from '@/components/products/ProductGrid'
import RecentlyViewed from '@/components/products/RecentlyViewed'
import { useRecentlyViewedStore } from '@/lib/recently-viewed'
import type { Product, Review } from '@/types'

interface SingleProductClientProps {
  slug: string
}

export default function SingleProductClient({ slug }: SingleProductClientProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(`/api/products/${slug}`)
        if (!res.ok) {
          setError(true)
          return
        }
        const data = await res.json()
        setProduct(data)

        // Fetch reviews
        try {
          const reviewsRes = await fetch(`/api/products/${slug}/reviews`)
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json()
            setReviews(reviewsData.reviews || [])
          }
        } catch {
          // Reviews not critical
        }

        // Fetch related products (same category)
        try {
          const relatedRes = await fetch(
            `/api/products?category=${data.category}&limit=4`
          )
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json()
            setRelatedProducts(
              (relatedData.products || []).filter(
                (p: Product) => p.id !== data.id
              ).slice(0, 4)
            )
          }
        } catch {
          // Related products not critical
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Track recently viewed products
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product)
    }
  }, [product, addRecentlyViewed])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 flex items-center gap-1.5">
          <div className="h-4 w-12 animate-shimmer bg-[var(--muted)]" />
          <div className="h-4 w-4 animate-shimmer bg-[var(--muted)]" />
          <div className="h-4 w-16 animate-shimmer bg-[var(--muted)]" />
          <div className="h-4 w-4 animate-shimmer bg-[var(--muted)]" />
          <div className="h-4 w-32 animate-shimmer bg-[var(--muted)]" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Image skeleton */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex gap-2 sm:flex-col">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="h-16 w-16 animate-shimmer bg-[var(--muted)] sm:h-20 sm:w-20"
                />
              ))}
            </div>
            <div className="flex-1">
              <div className="aspect-[3/4] animate-shimmer bg-[var(--muted)]" />
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-shimmer bg-[var(--muted)]" />
            <div className="h-4 w-32 animate-shimmer bg-[var(--muted)]" />
            <div className="h-8 w-40 animate-shimmer bg-[var(--muted)]" />
            <div className="h-20 w-full animate-shimmer bg-[var(--muted)]" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="h-10 w-12 animate-shimmer bg-[var(--muted)]"
                />
              ))}
            </div>
            <div className="h-12 w-full animate-shimmer bg-[var(--muted)]" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="heading-editorial mb-3 text-3xl text-[var(--foreground)]">
          Product Not Found
        </h1>
        <p className="mb-8 text-[var(--muted-foreground)]">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/products"
          className="btn-primary inline-flex h-11 items-center justify-center px-8 text-sm font-medium"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 sm:mb-8 flex items-center gap-1.5 sm:gap-2 text-sm text-[var(--muted-foreground)] overflow-x-auto scrollbar-none whitespace-nowrap pb-1">
        <Link
          href="/"
          className="flex items-center gap-1 shrink-0 transition-colors hover:text-[var(--accent)]"
        >
          <Home size={14} strokeWidth={1.5} />
          <span className="subheading hidden sm:inline">Home</span>
        </Link>
        <ChevronRight size={12} strokeWidth={1.5} className="shrink-0 sm:h-3.5 sm:w-3.5" />
        <Link
          href="/products"
          className="subheading shrink-0 transition-colors hover:text-[var(--accent)]"
        >
          Products
        </Link>
        <ChevronRight size={12} strokeWidth={1.5} className="shrink-0 sm:h-3.5 sm:w-3.5" />
        <Link
          href={`/products?category=${product.category}`}
          className="subheading shrink-0 capitalize transition-colors hover:text-[var(--accent)]"
        >
          {product.category.replace(/-/g, ' ')}
        </Link>
        <ChevronRight size={12} strokeWidth={1.5} className="shrink-0 sm:h-3.5 sm:w-3.5" />
        <span className="font-medium text-[var(--foreground)] truncate min-w-0">
          {product.name}
        </span>
      </nav>

      {/* Product details */}
      <ProductDetails product={product} />

      {/* Reviews */}
      <ProductReviews
        reviews={reviews}
        averageRating={product.rating}
        totalReviews={product.reviewCount}
        productId={product.id}
      />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-[var(--border)] pt-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="heading-editorial text-2xl text-[var(--foreground)] sm:text-3xl">
              You May Also Like
            </h2>
            <Link
              href={`/products?category=${product.category}`}
              className="hover-underline subheading text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
            >
              View All
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Recently viewed products */}
      <RecentlyViewed />
    </div>
  )
}

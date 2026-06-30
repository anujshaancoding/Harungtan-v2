'use client'

import { useState, useEffect, useCallback, useRef, Suspense, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { X, ChevronRight, Home, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductFilters } from '@/components/products/ProductFilters'
import type { Product } from '@/types'

const SCROLL_POS_KEY = 'harungtan-products-scroll'
const PRODUCTS_PER_PAGE = 12

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE)
  const [loadingMore, setLoadingMore] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const scrollRestored = useRef(false)
  const isFirstLoad = useRef(true)
  const abortRef = useRef<AbortController | null>(null)

  const fetchProducts = useCallback(async () => {
    // Abort any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    // First load shows skeletons, subsequent loads keep products visible
    if (isFirstLoad.current) {
      setInitialLoading(true)
    } else {
      setFiltering(true)
    }
    setDisplayCount(PRODUCTS_PER_PAGE)

    try {
      const params = new URLSearchParams(searchParams.toString())
      const res = await fetch(`/api/products?${params.toString()}`, {
        signal: controller.signal,
      })
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
        setTotalCount(data.total || 0)
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
    } finally {
      if (!controller.signal.aborted) {
        setInitialLoading(false)
        setFiltering(false)
        isFirstLoad.current = false
      }
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Restore scroll position when navigating back
  useEffect(() => {
    if (!initialLoading && !scrollRestored.current) {
      const saved = sessionStorage.getItem(SCROLL_POS_KEY)
      if (saved) {
        const { y, count } = JSON.parse(saved)
        setDisplayCount(count || PRODUCTS_PER_PAGE)
        requestAnimationFrame(() => {
          window.scrollTo(0, y)
        })
        sessionStorage.removeItem(SCROLL_POS_KEY)
      }
      scrollRestored.current = true
    }
  }, [initialLoading])

  // Save scroll position before navigating away
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem(
        SCROLL_POS_KEY,
        JSON.stringify({ y: window.scrollY, count: displayCount })
      )
    }

    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target?.href?.includes('/products/')) {
        saveScroll()
      }
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [displayCount])

  const handleLoadMore = useCallback(() => {
    setLoadingMore(true)
    setTimeout(() => {
      setDisplayCount((prev) => prev + PRODUCTS_PER_PAGE)
      setLoadingMore(false)
    }, 300)
  }, [])

  // Infinite scroll: load more when sentinel is visible
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && !initialLoading && displayCount < products.length) {
          handleLoadMore()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadingMore, initialLoading, displayCount, products.length, handleLoadMore])

  // Active filter chips
  const activeFilters: { key: string; label: string; param: string }[] = []
  const category = searchParams.get('category')
  if (category) {
    category.split(',').forEach((c) => {
      activeFilters.push({ key: `cat-${c}`, label: c.replace(/-/g, ' '), param: 'category' })
    })
  }
  const gender = searchParams.get('gender')
  if (gender) {
    activeFilters.push({ key: 'gender', label: gender, param: 'gender' })
  }
  const sizes = searchParams.get('sizes')
  if (sizes) {
    sizes.split(',').forEach((s) => {
      activeFilters.push({ key: `size-${s}`, label: `Size: ${s}`, param: 'sizes' })
    })
  }
  const colors = searchParams.get('colors')
  if (colors) {
    colors.split(',').forEach((c) => {
      activeFilters.push({ key: `color-${c}`, label: c, param: 'colors' })
    })
  }
  const minP = searchParams.get('minPrice')
  const maxP = searchParams.get('maxPrice')
  if (minP || maxP) {
    const label = `₹${minP || '0'} – ₹${maxP || '5,000'}`
    activeFilters.push({ key: 'price', label, param: 'price' })
  }
  const searchQ = searchParams.get('search')
  if (searchQ) {
    activeFilters.push({ key: 'search', label: `"${searchQ}"`, param: 'search' })
  }

  const removeFilter = (param: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (param === 'price') {
      params.delete('minPrice')
      params.delete('maxPrice')
    } else if (value && (param === 'category' || param === 'sizes' || param === 'colors')) {
      const current = params.get(param)?.split(',').filter(Boolean) || []
      const next = current.filter((v) => {
        if (param === 'category') return v !== value.replace(/ /g, '-')
        return v !== value.toLowerCase().replace('size: ', '')
      })
      if (next.length > 0) {
        params.set(param, next.join(','))
      } else {
        params.delete(param)
      }
    } else {
      params.delete(param)
    }
    params.delete('page')
    window.history.pushState(null, '', `/products?${params.toString()}`)
    fetchProducts()
  }

  const displayedProducts = products.slice(0, displayCount)
  const hasMore = displayCount < products.length

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]" aria-label="Breadcrumb">
        <Link
          href="/"
          className="hover-underline flex items-center gap-1.5 transition-colors hover:text-[var(--foreground)]"
        >
          <Home size={12} strokeWidth={1.5} />
          Home
        </Link>
        <ChevronRight size={10} strokeWidth={1.5} className="text-[var(--border)]" />
        <span className="text-[var(--foreground)]" aria-current="page">Products</span>
      </nav>

      {/* Page heading */}
      <div className="mb-10">
        <h1 className="heading-editorial text-[var(--foreground)]">
          All Products
        </h1>
        <p className="mt-2 text-[13px] text-[var(--muted-foreground)]" aria-live="polite">
          {initialLoading
            ? 'Loading products...'
            : `${totalCount} product${totalCount !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
            Active ({activeFilters.length}):
          </span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => removeFilter(filter.param, filter.label)}
              className="group inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-[11px] capitalize tracking-[0.04em] text-[var(--muted-foreground)] transition-all duration-200 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
            >
              {filter.label}
              <X size={10} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
            </button>
          ))}
          <button
            onClick={() => {
              window.history.pushState(null, '', '/products')
              fetchProducts()
            }}
            className="hover-underline ml-1 text-[11px] tracking-[0.04em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Filters sidebar */}
        <ProductFilters className="w-64 flex-shrink-0" />

        {/* Product grid + Load More */}
        <div className="flex-1" ref={gridRef}>
          {/* Filtering indicator — subtle top bar */}
          <div className={cn(
            'mb-4 h-[2px] w-full overflow-hidden transition-opacity duration-300',
            filtering ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="h-full w-1/3 animate-filter-slide bg-[var(--accent)]" />
          </div>

          {/* Products with smooth transition during filtering */}
          <div className={cn(
            'transition-opacity duration-300',
            filtering ? 'opacity-40 pointer-events-none' : 'opacity-100'
          )}>
            <ProductGrid
              products={displayedProducts}
              loading={initialLoading}
            />
          </div>

          {/* Infinite scroll sentinel + progress */}
          {!initialLoading && hasMore && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-[11px] tracking-[0.04em] text-[var(--muted-foreground)]">
                Showing {displayedProducts.length} of {products.length} products
              </p>
              {/* Progress bar */}
              <div className="h-[2px] w-32 bg-[var(--border)] overflow-hidden">
                <div
                  className="h-full bg-[var(--foreground)] transition-all duration-500"
                  style={{ width: `${(displayedProducts.length / products.length) * 100}%` }}
                />
              </div>
              {loadingMore && (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 size={14} className="animate-spin text-[var(--muted-foreground)]" strokeWidth={1.5} />
                  <span className="text-[11px] text-[var(--muted-foreground)]">Loading more...</span>
                </div>
              )}
              {/* Sentinel for IntersectionObserver */}
              <div ref={sentinelRef} className="h-px w-full" />
            </div>
          )}

          {/* All loaded indicator */}
          {!initialLoading && !hasMore && products.length > PRODUCTS_PER_PAGE && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <div className="h-[2px] w-32 bg-[var(--foreground)]" />
              <p className="text-[11px] tracking-[0.04em] text-[var(--muted-foreground)]">
                You&apos;ve seen all {products.length} products
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPageClient() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 h-3 w-24 bg-[var(--muted)]" />
          <div className="mb-2 h-10 w-64 bg-[var(--muted)]" />
          <div className="h-4 w-32 bg-[var(--muted)]" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}

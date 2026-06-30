'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, GitCompareArrows, Star, Trash2 } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

const COMPARE_KEY = 'harungtan-compare'
const COMPARE_EVENT = 'compare-updated'
const MAX_COMPARE = 4

interface CompareItem {
  id: string
  slug: string
}

function getCompareItems(): CompareItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]')
    // Migration: handle old format (string[]) gracefully
    if (raw.length > 0 && typeof raw[0] === 'string') {
      localStorage.setItem(COMPARE_KEY, '[]')
      return []
    }
    return raw
  } catch {
    return []
  }
}

export function toggleCompare(productId: string, productSlug?: string) {
  const items = getCompareItems()
  let updated: CompareItem[]
  if (items.some((item) => item.id === productId)) {
    updated = items.filter((item) => item.id !== productId)
  } else {
    if (items.length >= MAX_COMPARE) return false
    if (!productSlug) return false
    updated = [...items, { id: productId, slug: productSlug }]
  }
  localStorage.setItem(COMPARE_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event(COMPARE_EVENT))
  return true
}

export function isInCompare(productId: string): boolean {
  return getCompareItems().some((item) => item.id === productId)
}

export function CompareButton({ productId, productSlug, className }: { productId: string; productSlug: string; className?: string }) {
  const [inCompare, setInCompare] = useState(false)

  useEffect(() => {
    setInCompare(isInCompare(productId))
    const handler = () => setInCompare(isInCompare(productId))
    window.addEventListener(COMPARE_EVENT, handler)
    return () => window.removeEventListener(COMPARE_EVENT, handler)
  }, [productId])

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleCompare(productId, productSlug)
      }}
      className={cn(
        'flex items-center gap-1.5 text-[11px] tracking-[0.06em] transition-colors',
        inCompare
          ? 'text-[var(--accent)] font-medium'
          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
        className
      )}
      title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
    >
      <GitCompareArrows size={13} strokeWidth={1.5} />
      {inCompare ? 'Comparing' : 'Compare'}
    </button>
  )
}

export function CompareDrawer() {
  const [items, setItems] = useState<CompareItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const updateItems = () => {
      const current = getCompareItems()
      setItems(current)
    }
    updateItems()
    window.addEventListener(COMPARE_EVENT, updateItems)
    window.addEventListener('storage', updateItems)
    return () => {
      window.removeEventListener(COMPARE_EVENT, updateItems)
      window.removeEventListener('storage', updateItems)
    }
  }, [])

  const fetchProducts = async () => {
    if (items.length < 2) return
    setLoading(true)
    try {
      const fetched: Product[] = []
      for (const item of items) {
        const res = await fetch(`/api/products/${item.slug}`)
        if (res.ok) {
          const data = await res.json()
          if (data) fetched.push(data)
        }
      }
      setProducts(fetched)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    localStorage.setItem(COMPARE_KEY, '[]')
    setItems([])
    setProducts([])
    setIsOpen(false)
    window.dispatchEvent(new Event(COMPARE_EVENT))
  }

  const removeFromCompare = (productId: string) => {
    toggleCompare(productId)
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  if (items.length === 0) return null

  return (
    <>
      {/* Floating compare bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 lg:bottom-6"
      >
        <button
          onClick={() => {
            fetchProducts()
            setIsOpen(true)
          }}
          className="flex items-center gap-2 bg-[var(--foreground)] px-5 py-3 text-[var(--primary-foreground)] shadow-xl transition-all hover:opacity-90"
        >
          <GitCompareArrows size={16} strokeWidth={1.5} />
          <span className="text-[12px] font-medium uppercase tracking-[0.1em]">
            Compare ({items.length})
          </span>
        </button>
      </motion.div>

      {/* Comparison modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-auto border border-[var(--border)] bg-[var(--background)] shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6 py-4">
                <h2 className="heading-editorial text-lg text-[var(--foreground)]">
                  Compare Products
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAll}
                    className="text-[11px] tracking-[0.04em] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    aria-label="Close comparison"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin border-[1.5px] border-[var(--border)] border-t-[var(--foreground)]" />
                </div>
              ) : products.length < 2 ? (
                <div className="py-16 text-center">
                  <p className="text-[var(--muted-foreground)]">Add at least 2 products to compare</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="w-32 p-4 text-left text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]" />
                        {products.map((p) => (
                          <th key={p.id} className="p-4 text-center align-top">
                            <div className="relative">
                              <button
                                onClick={() => removeFromCompare(p.id)}
                                className="absolute -right-1 -top-1 z-10 p-1 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                                aria-label={`Remove ${p.name}`}
                              >
                                <Trash2 size={14} strokeWidth={1.5} />
                              </button>
                              <Link href={`/products/${p.slug}`} onClick={() => setIsOpen(false)}>
                                <div className="relative mx-auto mb-3 aspect-[3/4] w-32 overflow-hidden bg-[var(--muted)]">
                                  {p.images[0] ? (
                                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="128px" />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-[var(--border)]">
                                      {p.name.slice(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <p className="text-[13px] font-medium text-[var(--foreground)] line-clamp-2 hover:text-[var(--accent)] transition-colors">
                                  {p.name}
                                </p>
                              </Link>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      <tr>
                        <td className="p-4 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Price</td>
                        {products.map((p) => (
                          <td key={p.id} className="p-4 text-center">
                            <span className="text-sm font-bold text-[var(--foreground)]">{formatPrice(p.price)}</span>
                            {p.comparePrice && p.comparePrice > p.price && (
                              <span className="ml-2 text-[11px] text-[var(--muted-foreground)] line-through">{formatPrice(p.comparePrice)}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Rating</td>
                        {products.map((p) => (
                          <td key={p.id} className="p-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              <span className="text-sm text-[var(--foreground)]">{p.rating.toFixed(1)}</span>
                              <span className="text-[11px] text-[var(--muted-foreground)]">({p.reviewCount})</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Material</td>
                        {products.map((p) => (
                          <td key={p.id} className="p-4 text-center text-[13px] text-[var(--muted-foreground)]">
                            {p.material || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Sizes</td>
                        {products.map((p) => (
                          <td key={p.id} className="p-4 text-center">
                            <div className="flex flex-wrap justify-center gap-1">
                              {p.sizes.map((s) => (
                                <span key={s} className="border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--muted-foreground)]">{s}</span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Colors</td>
                        {products.map((p) => (
                          <td key={p.id} className="p-4 text-center text-[13px] text-[var(--muted-foreground)]">
                            {p.colors.join(', ') || '-'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">Stock</td>
                        {products.map((p) => (
                          <td key={p.id} className="p-4 text-center text-[13px]">
                            {p.stock > 0 ? (
                              <span className="text-green-600">In Stock</span>
                            ) : (
                              <span className="text-red-600">Out of Stock</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CompareDrawer

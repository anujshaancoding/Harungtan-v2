'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Heart,
  Minus,
  Plus,
  Star,
  ArrowRight,
} from 'lucide-react'
import { cn, formatPrice, getDiscountPercentage, COLORS } from '@/lib/utils'
import { showCartToast } from '@/components/CartToast'
import { useCartStore, useWishlistStore } from '@/lib/store'
import type { Product } from '@/types'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  const { addItem } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize('')
      setSelectedColor(product.colors.length > 0 ? product.colors[0] : '')
      setQuantity(1)
      setActiveImage(0)
      setAddingToCart(false)
    }
  }, [product])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!product || !mounted) return null

  const isWishlisted = hasItem(product.id)
  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0

  const initials = product.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const getColorHex = (colorName: string) => {
    const found = COLORS.find(
      (c) => c.name.toLowerCase() === colorName.toLowerCase()
    )
    return found?.hex || '#6B7280'
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    setAddingToCart(true)

    addItem({
      id: '',
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity,
      slug: product.slug,
    })

    showCartToast({
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity,
    })

    setTimeout(() => setAddingToCart(false), 800)
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        strokeWidth={1.5}
        className={cn(
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'text-[var(--border)]'
        )}
        style={i >= Math.floor(rating) ? { fill: 'var(--border)' } : undefined}
      />
    ))

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-sm bg-[var(--background)] shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
              aria-label="Close quick view"
            >
              <X size={18} strokeWidth={1.5} style={{ color: 'var(--foreground)' }} />
            </button>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
              {/* Left: Image gallery */}
              <div className="relative flex flex-col-reverse sm:flex-row max-h-[40vh] md:max-h-[90vh] overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 p-3 sm:flex-col sm:p-3">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={cn(
                          'h-14 w-14 flex-shrink-0 overflow-hidden border transition-all',
                          activeImage === idx
                            ? 'border-[var(--foreground)] shadow-sm'
                            : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                        )}
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={`${product.name} view ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{ backgroundColor: 'var(--muted)' }}
                          >
                            <span className="text-[10px] font-light" style={{ color: 'var(--border)' }}>
                              {initials}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Main image */}
                <div className="relative flex-1 aspect-[3/4] overflow-hidden">
                  {product.images[activeImage] ? (
                    <img
                      src={product.images[activeImage]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, var(--muted), var(--border))' }}
                    >
                      <span
                        className="text-5xl font-light tracking-widest"
                        style={{ color: 'var(--border)' }}
                      >
                        {initials}
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  {discount > 0 && (
                    <div className="absolute left-3 top-3">
                      <span
                        className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                      >
                        {discount}% OFF
                      </span>
                    </div>
                  )}
                  {product.newArrival && discount === 0 && (
                    <div className="absolute left-3 top-3">
                      <span
                        className="inline-block px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                      >
                        NEW
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Product info */}
              <div className="flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[90vh] p-6 sm:p-8">
                {/* Brand label */}
                <p
                  className="subheading mb-2 text-[11px] font-medium tracking-[0.2em] uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  Harungtan
                </p>

                {/* Name */}
                <h2
                  className="heading-editorial mb-2 text-xl font-normal sm:text-2xl leading-tight"
                  style={{ color: 'var(--foreground)' }}
                >
                  {product.name}
                </h2>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(product.rating)}
                    </div>
                    <span
                      className="text-[11px] tracking-wide"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {product.rating.toFixed(1)} ({product.reviewCount})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-4 flex items-baseline gap-3">
                  <span
                    className="text-lg font-medium tracking-wide"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <>
                      <span
                        className="text-sm line-through"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {formatPrice(product.comparePrice)}
                      </span>
                      <span
                        className="text-[11px] font-medium tracking-wide"
                        style={{ color: 'var(--accent)' }}
                      >
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="mb-4 h-px w-10" style={{ backgroundColor: 'var(--accent)' }} />

                {/* Description (truncated) */}
                <p
                  className="mb-5 line-clamp-3 text-[13px] leading-[1.7]"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {product.description}
                </p>

                {/* Color selector */}
                {product.colors.length > 0 && (
                  <div className="mb-5">
                    <label
                      className="mb-2.5 block text-[11px] font-medium tracking-[0.15em] uppercase"
                      style={{ color: 'var(--foreground)' }}
                    >
                      Color:{' '}
                      <span
                        className="font-normal capitalize tracking-normal"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {selectedColor}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            'flex h-9 w-9 items-center justify-center border transition-all',
                            selectedColor === color
                              ? 'border-[var(--foreground)] scale-105'
                              : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                          )}
                          title={color}
                        >
                          <span
                            className={cn(
                              'h-6 w-6',
                              getColorHex(color) === '#FFFFFF' && 'border border-[var(--border)]'
                            )}
                            style={{ backgroundColor: getColorHex(color) }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selector */}
                {product.sizes.length > 0 && (
                  <div className="mb-5">
                    <label
                      className="mb-2.5 block text-[11px] font-medium tracking-[0.15em] uppercase"
                      style={{ color: 'var(--foreground)' }}
                    >
                      Size:{' '}
                      {selectedSize && (
                        <span
                          className="font-normal tracking-normal"
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          {selectedSize}
                        </span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            'flex h-10 min-w-[2.75rem] items-center justify-center border px-3 text-[12px] font-medium tracking-wide transition-all',
                            selectedSize === size
                              ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                              : 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)]'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {!selectedSize && (
                      <p
                        className="mt-1.5 text-[11px] tracking-wide"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        Please select a size
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label
                    className="mb-2.5 block text-[11px] font-medium tracking-[0.15em] uppercase"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Quantity
                  </label>
                  <div
                    className="inline-flex items-center border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-[var(--muted)]"
                      style={{ color: 'var(--muted-foreground)' }}
                      disabled={quantity <= 1}
                    >
                      <Minus size={14} strokeWidth={1.5} />
                    </button>
                    <span
                      className="flex h-10 w-12 items-center justify-center border-x text-[13px] font-medium"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-[var(--muted)]"
                      style={{ color: 'var(--muted-foreground)' }}
                      disabled={quantity >= 10}
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mb-5 flex gap-3">
                  <button
                    className="btn-primary flex-1 flex items-center justify-center h-11 text-[12px] font-medium tracking-[0.15em] uppercase transition-all disabled:opacity-40"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || product.stock === 0}
                    style={{
                      backgroundColor: addingToCart ? 'var(--warm-dark)' : 'var(--foreground)',
                      color: 'var(--background)',
                      border: 'none',
                    }}
                  >
                    {product.stock === 0
                      ? 'Out of Stock'
                      : addingToCart
                        ? 'Added!'
                        : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => toggleItem(product.id)}
                    className="flex h-11 w-11 items-center justify-center border transition-all hover:bg-[var(--muted)]"
                    style={{ borderColor: 'var(--border)' }}
                    aria-label={
                      isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.5}
                      className={cn(
                        'transition-colors',
                        isWishlisted
                          ? 'fill-[var(--accent)] text-[var(--accent)]'
                          : 'text-[var(--foreground)]'
                      )}
                    />
                  </button>
                </div>

                {/* View full details link */}
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="hover-underline mt-auto inline-flex items-center gap-2 self-start text-[12px] font-medium tracking-[0.1em] uppercase transition-colors"
                  style={{ color: 'var(--foreground)' }}
                >
                  View Full Details
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default QuickViewModal

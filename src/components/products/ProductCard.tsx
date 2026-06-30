'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Heart, Star, Eye } from 'lucide-react'
import { cn, formatPrice, getDiscountPercentage } from '@/lib/utils'
import { useWishlistStore } from '@/lib/store'
import { Badge } from '@/components/ui/Badge'
import { CompareButton } from '@/components/products/ProductComparison'
import type { Product } from '@/types'

// Lazy load QuickViewModal - only loaded when user clicks "Quick View"
const QuickViewModal = dynamic(
  () => import('@/components/products/QuickViewModal').then(mod => ({ default: mod.QuickViewModal })),
  { ssr: false }
)

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { toggleItem, hasItem } = useWishlistStore()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

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

  const hasSecondImage = product.images.length > 1 && product.images[1] !== ''

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={11}
        className={cn(
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : i < rating
              ? 'fill-amber-400/50 text-amber-400'
              : 'fill-[var(--border)] text-[var(--border)]'
        )}
      />
    ))
  }

  return (
    <>
      <div
        className={cn(
          'group relative flex flex-col overflow-hidden bg-[var(--background)] transition-all duration-500 hover-lift',
          className
        )}
      >
        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleItem(product.id)
          }}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={15}
            strokeWidth={1.5}
            className={cn(
              'transition-all duration-300',
              isWishlisted
                ? 'fill-[var(--accent)] text-[var(--accent)] scale-110'
                : 'text-[var(--muted-foreground)] hover:text-[var(--accent)]'
            )}
          />
        </button>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant="danger">{discount}% OFF</Badge>
          </div>
        )}

        {/* New arrival badge */}
        {product.newArrival && discount === 0 && (
          <div className="absolute left-3 top-3 z-10">
            <Badge>NEW</Badge>
          </div>
        )}

        {/* Product image with crossfade */}
        <div className="relative">
          <Link href={`/products/${product.slug}`} className="block">
            <div className={cn(
              'relative aspect-[3/4] overflow-hidden bg-[var(--muted)]',
              hasSecondImage && 'image-crossfade'
            )}>
              {product.images.length > 0 && product.images[0] !== '' ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)]">
                      <span className="text-3xl font-light tracking-widest text-[var(--border)]">
                        {initials}
                      </span>
                    </div>
                  )}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={cn(
                      'img-primary h-full w-full object-cover transition-transform duration-700 group-hover:scale-105',
                      !imageLoaded && 'opacity-0',
                      hasSecondImage && 'group-hover:scale-100'
                    )}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {/* Second image on hover */}
                  {hasSecondImage && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} - alternate view`}
                      className="img-secondary absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--muted)] transition-colors duration-300 group-hover:bg-[var(--border)]">
                  <span className="text-4xl font-light tracking-widest text-[var(--border)]">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Quick View button - outside Link to prevent navigation conflict */}
          <button
            onClick={() => setQuickViewOpen(true)}
            className="absolute bottom-0 left-0 right-0 z-10 hidden translate-y-full items-center justify-center gap-2 bg-white/95 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 md:flex"
            style={{ color: 'var(--foreground)' }}
          >
            <Eye size={14} strokeWidth={1.5} />
            Quick View
          </button>
        </div>

        {/* Product info */}
        <div className="flex flex-1 flex-col p-2.5 sm:p-4">
          <Link
            href={`/products/${product.slug}`}
            className="mb-1 sm:mb-1.5 line-clamp-1 text-[12px] sm:text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--accent)]"
          >
            {product.name}
          </Link>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-1.5">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-[9px] sm:text-[10px] text-[var(--muted-foreground)]">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price + Compare */}
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
              <span className="text-[12px] sm:text-sm font-bold text-[var(--foreground)]">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[10px] sm:text-[11px] text-[var(--muted-foreground)] line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <CompareButton productId={product.id} productSlug={product.slug} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  )
}

export default ProductCard

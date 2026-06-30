'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react'
import { cn, formatPrice, getDiscountPercentage } from '@/lib/utils'
import { useWishlistStore, useCartStore } from '@/lib/store'
import type { Product } from '@/types'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'
import { ShareWishlistButton } from '@/components/wishlist/ShareWishlistButton'

function WishlistCard({
  product,
  onRemove,
  onMoveToCart,
}: {
  product: Product
  onRemove: () => void
  onMoveToCart: () => void
}) {
  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0
  const imageSrc = product.images?.[0] || '/placeholder.png'

  return (
    <div className="group border border-[var(--border)] bg-white overflow-hidden transition-all hover:shadow-sm hover:border-[var(--foreground)]/20">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)]">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            -{discount}%
          </span>
        )}

        <button
          onClick={onRemove}
          className="absolute right-3 top-3 bg-white/90 backdrop-blur-sm p-2 shadow-sm transition-colors hover:bg-red-50"
          aria-label="Remove from wishlist"
        >
          <X size={14} strokeWidth={1.5} className="text-[var(--muted-foreground)] hover:text-red-600" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-[var(--foreground)] line-clamp-1 hover-underline">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 subheading text-[var(--muted-foreground)]">
          {product.category}
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-[var(--muted-foreground)] line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="border border-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onMoveToCart}
            className="btn-accent flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs"
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            Add to Cart
          </button>
          <button
            onClick={onRemove}
            className="border border-[var(--border)] p-2.5 text-[var(--muted-foreground)] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            aria-label="Remove"
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const wishlistItems = useWishlistStore((s) => s.items)
  const removeFromWishlist = useWishlistStore((s) => s.removeItem)
  const addToCart = useCartStore((s) => s.addItem)
  const setCartOpen = useCartStore((s) => s.setCartOpen)

  useEffect(() => {
    fetchWishlistProducts()
  }, [wishlistItems])

  const fetchWishlistProducts = async () => {
    if (wishlistItems.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/products?ids=${wishlistItems.join(',')}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId)
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const handleMoveToCart = (product: Product) => {
    addToCart({
      id: '',
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.png',
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Black',
      quantity: 1,
      slug: product.slug,
    })
    removeFromWishlist(product.id)
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
    setCartOpen(true)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] animate-pulse bg-[var(--muted)]" />
            <div className="h-4 animate-pulse bg-[var(--muted)]" />
            <div className="h-3 w-2/3 animate-pulse bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageBreadcrumb className="mb-2" />
      <div className="flex items-end justify-between">
        <div>
          <h2 className="heading-editorial text-2xl text-[var(--foreground)]">
            My Wishlist
          </h2>
          <div className="divider-accent mt-3" />
        </div>
        {products.length > 0 && (
          <div className="flex items-center gap-4">
            <ShareWishlistButton productIds={wishlistItems} />
            <p className="subheading text-[var(--muted-foreground)]">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Heart}
          illustration="wishlist"
          title="Your wishlist is empty"
          description="Save items you love to your wishlist. Review them anytime and easily move them to your cart."
          actionLabel="Explore Products"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {products.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              onRemove={() => handleRemove(product.id)}
              onMoveToCart={() => handleMoveToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

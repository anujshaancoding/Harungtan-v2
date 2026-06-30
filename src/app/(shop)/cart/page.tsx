'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Bookmark, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'

const SHIPPING_THRESHOLD = 999
const SHIPPING_COST = 99

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, savedItems, saveForLater, moveToCart, removeSaved } = useCartStore()

  const subtotal = total()
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const orderTotal = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          illustration="cart"
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Explore our collection and find something you love."
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    )
  }

  return (
    <div
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <PageBreadcrumb className="mb-6" />
      <h1
        className="heading-editorial mb-10 text-2xl sm:text-3xl lg:text-4xl"
        style={{ color: 'var(--foreground)' }}
      >
        Shopping Cart
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-14">
        {/* Cart items */}
        <div className="lg:col-span-8">
          {/* Header row - desktop */}
          <div
            className="hidden pb-4 sm:grid sm:grid-cols-12 sm:gap-4"
            style={{ borderBottom: '1.5px solid var(--border)' }}
          >
            <span className="subheading col-span-6 text-[11px]">
              Product
            </span>
            <span className="subheading col-span-2 text-center text-[11px]">
              Quantity
            </span>
            <span className="subheading col-span-2 text-right text-[11px]">
              Price
            </span>
            <span className="subheading col-span-2 text-right text-[11px]">
              Total
            </span>
          </div>

          <div>
            {items.map((item) => (
              <div
                key={item.id}
                className="py-6 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                {/* Product info */}
                <div className="flex gap-4 sm:col-span-6">
                  {/* Image */}
                  <div
                    className="relative h-24 w-20 shrink-0 overflow-hidden sm:h-28 sm:w-24"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag
                          size={24}
                          strokeWidth={1.5}
                          style={{ color: 'var(--border)' }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-[13px] font-medium transition-colors sm:text-sm"
                      style={{ color: 'var(--foreground)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                    >
                      {item.name}
                    </Link>
                    <div
                      className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] uppercase tracking-[0.06em]"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <p
                      className="mt-1 text-[13px] font-medium sm:hidden"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {formatPrice(item.price)}
                    </p>

                    {/* Mobile quantity + actions */}
                    <div className="mt-3 flex items-center gap-3 sm:hidden">
                      <div
                        className="inline-flex items-center"
                        style={{ border: '1.5px solid var(--border)' }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span
                          className="flex h-8 w-10 items-center justify-center text-[11px] font-medium"
                          style={{
                            color: 'var(--foreground)',
                            borderLeft: '1.5px solid var(--border)',
                            borderRight: '1.5px solid var(--border)',
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center transition-colors"
                          style={{ color: 'var(--muted-foreground)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        onClick={() => saveForLater(item.id)}
                        className="transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                        aria-label="Save for later"
                        title="Save for later"
                      >
                        <Bookmark size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop quantity */}
                <div className="hidden sm:col-span-2 sm:flex sm:items-center sm:justify-center">
                  <div
                    className="inline-flex items-center"
                    style={{ border: '1.5px solid var(--border)' }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center transition-colors"
                      style={{ color: 'var(--muted-foreground)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} strokeWidth={1.5} />
                    </button>
                    <span
                      className="flex h-8 w-10 items-center justify-center text-[11px] font-medium"
                      style={{
                        color: 'var(--foreground)',
                        borderLeft: '1.5px solid var(--border)',
                        borderRight: '1.5px solid var(--border)',
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center transition-colors"
                      style={{ color: 'var(--muted-foreground)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="hidden sm:col-span-2 sm:block sm:text-right">
                  <span
                    className="text-[13px]"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {formatPrice(item.price)}
                  </span>
                </div>

                {/* Total + actions */}
                <div className="hidden sm:col-span-2 sm:flex sm:items-center sm:justify-end sm:gap-2">
                  <span
                    className="text-[13px] font-medium"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => saveForLater(item.id)}
                    className="p-1 transition-colors"
                    style={{ color: 'var(--muted-foreground)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                    aria-label="Save for later"
                    title="Save for later"
                  >
                    <Bookmark size={14} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 transition-colors"
                    style={{ color: 'var(--muted-foreground)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue shopping */}
          <div
            className="mt-6 pt-6"
            style={{ borderTop: '1.5px solid var(--border)' }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
            >
              <ArrowRight size={14} strokeWidth={1.5} className="rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Saved for Later */}
          {savedItems.length > 0 && (
            <div className="mt-10">
              <h2
                className="subheading text-[11px] mb-4 pb-4"
                style={{ borderBottom: '1.5px solid var(--border)' }}
              >
                Saved for Later ({savedItems.length})
              </h2>
              <div className="space-y-4">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <div
                      className="relative h-16 w-14 shrink-0 overflow-hidden"
                      style={{ backgroundColor: 'var(--muted)' }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag size={16} strokeWidth={1.5} style={{ color: 'var(--border)' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-[13px] font-medium truncate block transition-colors"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                        {item.size} / {item.color} &middot; {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => moveToCart(item.id)}
                        className="inline-flex items-center gap-1.5 border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.04em] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        <RotateCcw size={12} strokeWidth={1.5} />
                        <span className="hidden sm:inline">Move to Cart</span>
                      </button>
                      <button
                        onClick={() => removeSaved(item.id)}
                        className="p-1.5 transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
                        aria-label="Remove saved item"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cart summary */}
        <div className="mt-8 lg:col-span-4 lg:mt-0">
          <div
            className="lg:sticky lg:top-24 p-5 sm:p-6"
            style={{
              backgroundColor: 'var(--muted)',
              border: '1.5px solid var(--border)',
            }}
          >
            <h2
              className="subheading text-[11px] mb-5"
            >
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-[13px]">
                <span style={{ color: 'var(--muted-foreground)' }}>
                  Subtotal ({items.length}{' '}
                  {items.length === 1 ? 'item' : 'items'})
                </span>
                <span
                  className="font-medium"
                  style={{ color: 'var(--foreground)' }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-[13px]">
                <span style={{ color: 'var(--muted-foreground)' }}>Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span style={{ color: 'var(--accent)' }}>Free</span>
                  ) : (
                    <span style={{ color: 'var(--foreground)' }}>
                      {formatPrice(shipping)}
                    </span>
                  )}
                </span>
              </div>

              {shipping > 0 && (
                <p
                  className="text-[11px] tracking-[0.04em]"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Free shipping on orders above {formatPrice(SHIPPING_THRESHOLD)}
                </p>
              )}

              <div className="divider-accent my-4" />

              <div className="flex justify-between items-baseline">
                <span
                  className="heading-editorial text-base"
                  style={{ color: 'var(--foreground)' }}
                >
                  Total
                </span>
                <span
                  className="heading-editorial text-xl"
                  style={{ color: 'var(--foreground)' }}
                >
                  {formatPrice(orderTotal)}
                </span>
              </div>
              <p
                className="text-[11px] tracking-[0.04em]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Including all taxes
              </p>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button className="btn-accent w-full" size="lg" iconRight={ArrowRight}>
                Proceed to Checkout
              </Button>
            </Link>

            {/* Trust indicators */}
            <div className="mt-5 text-center">
              <p
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

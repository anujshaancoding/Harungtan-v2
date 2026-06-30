'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2, Truck, Check, Undo2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore, type CartItem } from '@/lib/store'
import { cn, formatPrice } from '@/lib/utils'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const FREE_SHIPPING_THRESHOLD = 999

function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const earned = subtotal >= FREE_SHIPPING_THRESHOLD

  return (
    <div className="px-6 py-3" style={{ backgroundColor: 'var(--muted)' }}>
      <div className="flex items-center gap-2 mb-2">
        {earned ? (
          <Check size={14} strokeWidth={1.5} style={{ color: '#059669' }} />
        ) : (
          <Truck size={14} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
        )}
        <p
          className="text-[11px] tracking-[0.04em]"
          style={{ color: earned ? '#059669' : 'var(--muted-foreground)' }}
        >
          {earned
            ? "You've earned free shipping!"
            : `Add ${formatPrice(remaining)} more for free shipping`}
        </p>
      </div>
      <div
        className="h-[3px] w-full overflow-hidden"
        style={{ backgroundColor: 'var(--border)' }}
      >
        <motion.div
          className="h-full"
          style={{ backgroundColor: earned ? '#059669' : 'var(--accent)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function SwipeableCartItem({
  item,
  onRemove,
  onUpdateQuantity,
  onClose,
}: {
  item: CartItem
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, qty: number) => void
  onClose: () => void
}) {
  const x = useMotionValue(0)
  const bg = useTransform(x, [-100, 0], ['rgba(220, 38, 38, 0.15)', 'transparent'])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) {
      onRemove(item.id)
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative pb-5 last:border-0 last:pb-0"
      style={{ borderBottom: '1px solid var(--border)', background: bg }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="flex gap-4"
      >
        {/* Product Image */}
        <Link
          href={`/products/${item.slug}`}
          onClick={onClose}
          className="relative h-24 w-20 flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: 'var(--muted)' }}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-lg font-light tracking-widest"
              style={{ color: 'var(--border)' }}
            >
              {item.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <Link
              href={`/products/${item.slug}`}
              onClick={onClose}
              className="text-[13px] font-medium transition-colors line-clamp-1"
              style={{ color: 'var(--foreground)' }}
            >
              {item.name}
            </Link>
            <div
              className="mt-0.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.06em]"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {item.size && <span>Size: {item.size}</span>}
              {item.size && item.color && <span>/</span>}
              {item.color && <span>Color: {item.color}</span>}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Quantity Controls */}
            <div
              className="flex items-center"
              style={{ border: '1.5px solid var(--border)' }}
            >
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" strokeWidth={1.5} />
              </button>
              <span
                className="flex h-7 w-8 items-center justify-center text-[11px] font-medium"
                style={{
                  color: 'var(--foreground)',
                  borderLeft: '1.5px solid var(--border)',
                  borderRight: '1.5px solid var(--border)',
                }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" strokeWidth={1.5} />
              </button>
            </div>

            {/* Price */}
            <p className="text-[13px] font-medium" style={{ color: 'var(--foreground)' }}>
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove(item.id)}
          className="self-start p-1 transition-colors text-[var(--muted-foreground)] hover:text-[var(--accent)]"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </motion.div>

    </motion.li>
  )
}

export default function CartSidebar() {
  const { items, isOpen, setCartOpen, removeItem, undoRemove, updateQuantity, total } =
    useCartStore()
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const subtotal = total()

  const handleRemoveWithUndo = (id: string) => {
    const item = items.find((i) => i.id === id)
    removeItem(id)

    if (item) {
      toast(
        (t) => (
          <div className="flex items-center gap-3">
            <span className="text-[13px]">{item.name} removed</span>
            <button
              onClick={() => {
                undoRemove()
                toast.dismiss(t.id)
              }}
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] uppercase tracking-[0.06em] hover:underline"
            >
              <Undo2 size={12} strokeWidth={1.5} />
              Undo
            </button>
          </div>
        ),
        { duration: 4000 }
      )
    }
  }

  // Swipe to close sidebar on mobile
  const handleSidebarDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      setCartOpen(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleSidebarDragEnd}
              className={cn(
                'fixed inset-y-0 right-0 z-50 w-full max-w-md',
                'flex flex-col shadow-2xl'
              )}
              style={{ backgroundColor: 'var(--background)' }}
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.5} style={{ color: 'var(--foreground)' }} />
                  <h2
                    className="heading-editorial text-lg tracking-wide"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Your Cart
                  </h2>
                  <span
                    className="text-[11px] uppercase tracking-[0.08em]"
                    style={{ color: 'var(--muted-foreground)' }}
                    aria-live="polite"
                  >
                    ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1 transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Free Shipping Progress */}
              {items.length > 0 && <ShippingProgress subtotal={subtotal} />}

              {/* Cart Items */}
              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6">
                  <ShoppingBag
                    className="h-16 w-16 mb-5"
                    strokeWidth={1}
                    style={{ color: 'var(--border)' }}
                  />
                  <p
                    className="heading-editorial text-lg mb-1"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Your cart is empty
                  </p>
                  <p
                    className="text-[13px] mb-8 text-center leading-relaxed"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setCartOpen(false)}
                    className="btn-primary"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="space-y-5">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <SwipeableCartItem
                          key={item.id}
                          item={item}
                          onRemove={handleRemoveWithUndo}
                          onUpdateQuantity={updateQuantity}
                          onClose={() => setCartOpen(false)}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}

              {/* Footer */}
              {items.length > 0 && (
                <div
                  className="px-6 py-5 space-y-4"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="subheading text-[11px]">Subtotal</span>
                    <span
                      className="heading-editorial text-lg"
                      style={{ color: 'var(--foreground)' }}
                      aria-live="polite"
                    >
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p
                    className="text-[11px] tracking-[0.04em]"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Shipping &amp; taxes calculated at checkout
                  </p>

                  {/* Divider */}
                  <div className="divider-accent" />

                  {/* Buttons */}
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="btn-accent block w-full py-3 text-center text-[13px] font-medium uppercase tracking-[0.1em] transition-colors"
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setCartOpen(false)}
                      className="btn-outline block w-full py-3 text-center text-[13px] font-medium uppercase tracking-[0.1em] transition-colors"
                    >
                      View Cart
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clear Cart Confirmation */}
      <ConfirmDialog
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={() => {
          useCartStore.getState().clearCart()
          setClearConfirmOpen(false)
        }}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmLabel="Clear Cart"
        variant="danger"
      />
    </>
  )
}

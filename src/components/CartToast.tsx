'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store'

interface CartToastData {
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

// Custom event name
const CART_TOAST_EVENT = 'cart-toast'

// Call this from anywhere to show the toast
export function showCartToast(data: CartToastData) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_TOAST_EVENT, { detail: data }))
  }
}

export function CartToastListener() {
  const [toast, setToast] = useState<CartToastData | null>(null)
  const [visible, setVisible] = useState(false)
  const { setCartOpen } = useCartStore()

  const dismiss = useCallback(() => {
    setVisible(false)
    // Wait for exit animation to complete before clearing data
    setTimeout(() => setToast(null), 300)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const data = (e as CustomEvent<CartToastData>).detail
      setToast(data)
      setVisible(true)
    }

    window.addEventListener(CART_TOAST_EVENT, handler)
    return () => window.removeEventListener(CART_TOAST_EVENT, handler)
  }, [])

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(dismiss, 4000)
    return () => clearTimeout(timer)
  }, [visible, dismiss])

  const handleViewCart = () => {
    dismiss()
    setCartOpen(true)
  }

  return (
    <AnimatePresence>
      {visible && toast && (
        <motion.div
          initial={{ opacity: 0, y: 80, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 right-6 z-[60] w-[360px] max-w-[calc(100vw-2rem)] shadow-2xl"
          style={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Top accent line */}
          <div
            className="h-[2px] w-full"
            style={{ backgroundColor: 'var(--accent)' }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between px-4 pt-3 pb-2"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={14} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
              <span
                className="text-[11px] font-medium tracking-[0.12em] uppercase"
                style={{ color: 'var(--accent)' }}
              >
                Added to Cart
              </span>
            </div>
            <button
              onClick={dismiss}
              className="flex h-6 w-6 items-center justify-center transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
              aria-label="Close notification"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="flex gap-3 px-4 pb-3">
            {/* Product image */}
            <div
              className="h-[60px] w-[60px] flex-shrink-0 overflow-hidden"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              {toast.image ? (
                <img
                  src={toast.image}
                  alt={toast.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-sm font-light tracking-widest"
                  style={{ color: 'var(--border)' }}
                >
                  {toast.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-center min-w-0">
              <p
                className="text-[13px] font-medium leading-tight line-clamp-1"
                style={{ color: 'var(--foreground)' }}
              >
                {toast.name}
              </p>
              <div
                className="mt-0.5 flex items-center gap-1.5 text-[11px] tracking-[0.04em]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {toast.size && <span>Size: {toast.size}</span>}
                {toast.size && toast.color && <span>/</span>}
                {toast.color && <span>{toast.color}</span>}
                {toast.quantity > 1 && <span>/ Qty: {toast.quantity}</span>}
              </div>
              <p
                className="mt-1 text-[13px] font-medium"
                style={{ color: 'var(--foreground)' }}
              >
                {formatPrice(toast.price * toast.quantity)}
              </p>
            </div>
          </div>

          {/* View Cart button */}
          <div className="px-4 pb-4">
            <button
              onClick={handleViewCart}
              className="flex w-full items-center justify-center h-9 text-[11px] font-medium tracking-[0.12em] uppercase transition-all"
              style={{
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              View Cart
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

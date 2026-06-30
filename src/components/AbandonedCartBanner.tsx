'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

const DISMISS_KEY = 'harungtan-abandoned-cart-dismissed'
const THRESHOLD_HOURS = 1 // Show if inactive for 1+ hours

export function AbandonedCartBanner() {
  const [visible, setVisible] = useState(false)
  const { items, total, lastActivity } = useCartStore()
  const cartTotal = total()

  useEffect(() => {
    if (items.length === 0) return
    if (!lastActivity) return

    const dismissed = sessionStorage.getItem(DISMISS_KEY)
    if (dismissed) return

    const hoursSince = (Date.now() - lastActivity) / (1000 * 60 * 60)
    if (hoursSince >= THRESHOLD_HOURS) {
      // Delay showing to let page load
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [items.length, lastActivity])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem(DISMISS_KEY, 'true')
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed left-0 right-0 top-0 z-[60]"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} strokeWidth={1.5} />
              <p className="text-[12px] tracking-wide sm:text-[13px]">
                You left {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                <span className="hidden sm:inline"> worth {formatPrice(cartTotal)}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                onClick={dismiss}
                className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                }}
              >
                Complete Order
                <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
              <button
                onClick={dismiss}
                className="p-1 transition-opacity hover:opacity-70"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

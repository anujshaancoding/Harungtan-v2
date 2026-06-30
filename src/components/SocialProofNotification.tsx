'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface ProofEvent {
  id: string
  name: string
  city: string
  productName: string
  productSlug: string
  productImage: string
}

const INTERVAL = 30000 // Show every 30 seconds
const DISPLAY_DURATION = 5000

export function SocialProofNotification() {
  const [events, setEvents] = useState<ProofEvent[]>([])
  const [current, setCurrent] = useState<ProofEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/social-proof')
        if (res.ok) {
          const data = await res.json()
          setEvents(data.events || [])
        }
      } catch {
        // silent
      }
    }

    // Delay first fetch
    const timer = setTimeout(fetchEvents, 5000)
    return () => clearTimeout(timer)
  }, [])

  const showNext = useCallback(() => {
    if (events.length === 0) return
    const randomEvent = events[Math.floor(Math.random() * events.length)]
    setCurrent(randomEvent)
    setVisible(true)

    setTimeout(() => setVisible(false), DISPLAY_DURATION)
  }, [events])

  useEffect(() => {
    if (events.length === 0) return

    // Show first notification after 15s
    const firstTimer = setTimeout(showNext, 15000)

    // Then show every INTERVAL
    const interval = setInterval(showNext, INTERVAL)

    return () => {
      clearTimeout(firstTimer)
      clearInterval(interval)
    }
  }, [events, showNext])

  return (
    <AnimatePresence>
      {visible && current && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed bottom-20 left-4 z-50 w-72 border shadow-lg sm:bottom-6"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <button
            onClick={() => setVisible(false)}
            className="absolute right-2 top-2 p-0.5 transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <X size={12} strokeWidth={1.5} />
          </button>

          <Link
            href={`/products/${current.productSlug}`}
            className="flex items-center gap-3 p-3"
          >
            <div
              className="relative h-12 w-12 shrink-0 overflow-hidden"
              style={{ backgroundColor: 'var(--muted)' }}
            >
              {current.productImage ? (
                <img
                  src={current.productImage}
                  alt={current.productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag size={16} strokeWidth={1.5} style={{ color: 'var(--border)' }} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px]" style={{ color: 'var(--foreground)' }}>
                <span className="font-medium">{current.name}</span>
                <span style={{ color: 'var(--muted-foreground)' }}> from {current.city}</span>
              </p>
              <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                just purchased{' '}
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {current.productName}
                </span>
              </p>
              <p className="mt-0.5 text-[9px] tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                a few moments ago
              </p>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

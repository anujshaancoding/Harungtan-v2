'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'harungtan-exit-popup-dismissed'
const DISMISS_DAYS = 7

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  }, [])

  useEffect(() => {
    // Check if dismissed recently
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed) {
      const diff = Date.now() - parseInt(dismissed)
      if (diff < DISMISS_DAYS * 24 * 60 * 60 * 1000) return
    }

    let triggered = false

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves toward top of viewport
      if (e.clientY <= 5 && !triggered) {
        triggered = true
        setVisible(true)
      }
    }

    // Delay activation to avoid immediate trigger
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 10000) // Wait 10s before activating

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
      setTimeout(dismiss, 3000)
    } catch {
      // still dismiss
      dismiss()
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[101] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2"
            style={{ backgroundColor: 'var(--background)' }}
          >
            <button
              onClick={dismiss}
              className="absolute right-4 top-4 p-1 transition-colors hover:opacity-70"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="p-8 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                <Gift size={28} strokeWidth={1.5} />
              </div>

              <h2
                className="heading-editorial text-2xl"
                style={{ color: 'var(--foreground)' }}
              >
                Wait! Don&apos;t Leave Empty-Handed
              </h2>

              <p
                className="mt-2 text-[13px] leading-relaxed"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Subscribe to our newsletter and get <span style={{ color: 'var(--accent)' }} className="font-semibold">10% OFF</span> your first order.
              </p>

              {submitted ? (
                <div className="mt-6">
                  <p className="text-[14px] font-medium" style={{ color: '#059669' }}>
                    Welcome aboard! Check your email for the discount code.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail
                        size={14}
                        strokeWidth={1.5}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--muted-foreground)' }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="w-full border py-3 pl-9 pr-3 text-[13px] focus:border-[var(--foreground)] focus:outline-none"
                        style={{
                          borderColor: 'var(--border)',
                          backgroundColor: 'var(--background)',
                          color: 'var(--foreground)',
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="shrink-0 px-6 py-3 text-[12px] font-medium tracking-[0.15em] uppercase"
                      style={{
                        backgroundColor: 'var(--foreground)',
                        color: 'var(--background)',
                      }}
                    >
                      Get 10% Off
                    </button>
                  </div>
                </form>
              )}

              <button
                onClick={dismiss}
                className="mt-4 text-[11px] tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--muted-foreground)' }}
              >
                No thanks, I&apos;ll pay full price
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

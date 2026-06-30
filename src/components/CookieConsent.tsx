'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--background)] p-4 shadow-lg sm:p-6">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 pr-8">
          <p className="text-sm text-[var(--muted-foreground)]">
            We use cookies to enhance your browsing experience and analyze site traffic.
            By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
            <Link
              href="/privacy-policy"
              className="underline transition-colors hover:text-[var(--foreground)]"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={decline}
            className="border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--muted)]"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] transition-colors hover:opacity-90"
          >
            Accept
          </button>
        </div>
        <button
          onClick={decline}
          className="absolute right-3 top-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:hidden"
          aria-label="Close cookie banner"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (!deferredPrompt) return

    // Check if dismissed within the last 7 days
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - dismissedAt < sevenDays) return
    }

    // Show after 5-second delay
    const timer = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [deferredPrompt])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
    setVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--background)] p-4 shadow-lg sm:p-6">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 pr-8">
          <Download
            size={20}
            strokeWidth={1.5}
            className="shrink-0"
            style={{ color: 'var(--accent)' }}
          />
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Install Harungtan for a faster, app-like shopping experience with offline access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDismiss}
            className="border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--muted)]"
          >
            Not Now
          </button>
          <button
            onClick={handleInstall}
            className="bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] transition-colors hover:opacity-90"
          >
            Install
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:hidden"
          aria-label="Close install prompt"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

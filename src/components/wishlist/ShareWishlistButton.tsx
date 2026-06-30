'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Twitter, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareWishlistButtonProps {
  productIds: string[]
  className?: string
}

export function ShareWishlistButton({ productIds, className }: ShareWishlistButtonProps) {
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleShare = async () => {
    if (productIds.length === 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/wishlist/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      })

      if (res.ok) {
        const data = await res.json()
        const fullUrl = `${window.location.origin}${data.shareUrl}`
        setShareUrl(fullUrl)
        setShowMenu(true)

        // Try native share first on mobile
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'My Harungtan Wishlist',
              text: 'Check out my favorite items from Harungtan!',
              url: fullUrl,
            })
            setShowMenu(false)
            return
          } catch {
            // Fall through to manual share
          }
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    if (!shareUrl) return
    const text = encodeURIComponent('Check out my wishlist from Harungtan! 🛍️')
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const shareToWhatsApp = () => {
    if (!shareUrl) return
    const text = encodeURIComponent(`Check out my wishlist from Harungtan! ${shareUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={handleShare}
        disabled={loading || productIds.length === 0}
        className="flex items-center gap-2 border px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors hover:bg-[var(--foreground)] hover:text-[var(--background)] disabled:opacity-40"
        style={{
          borderColor: 'var(--foreground)',
          color: 'var(--foreground)',
        }}
      >
        <Share2 size={14} strokeWidth={1.5} />
        {loading ? 'Creating link...' : 'Share Wishlist'}
      </button>

      {showMenu && shareUrl && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="absolute right-0 top-full z-50 mt-2 w-64 border shadow-lg"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="p-3">
              <p
                className="mb-2 text-[11px] font-medium tracking-[0.1em] uppercase"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Share via
              </p>
              <div className="space-y-1">
                <button
                  onClick={handleCopy}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-[13px] transition-colors hover:bg-[var(--muted)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {copied ? (
                    <Check size={16} strokeWidth={1.5} style={{ color: '#059669' }} />
                  ) : (
                    <Copy size={16} strokeWidth={1.5} />
                  )}
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={shareToWhatsApp}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-[13px] transition-colors hover:bg-[var(--muted)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  <MessageCircle size={16} strokeWidth={1.5} />
                  WhatsApp
                </button>
                <button
                  onClick={shareToTwitter}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-[13px] transition-colors hover:bg-[var(--muted)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Twitter size={16} strokeWidth={1.5} />
                  Twitter
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

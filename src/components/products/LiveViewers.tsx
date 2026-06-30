'use client'

import { useState, useEffect, useRef } from 'react'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LiveViewersProps {
  productSlug: string
  className?: string
}

export function LiveViewers({ productSlug, className }: LiveViewersProps) {
  const [viewerCount, setViewerCount] = useState(0)
  const [prevCount, setPrevCount] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Simulate live viewers with a realistic random count
    // In production, this would connect to an SSE/WebSocket endpoint
    const baseCount = Math.floor(Math.random() * 8) + 2
    setViewerCount(baseCount)
    setPrevCount(baseCount)

    // Fluctuate count periodically
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1
        const next = prev + change
        return Math.max(1, Math.min(20, next))
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [productSlug])

  // Animate on count change
  useEffect(() => {
    if (viewerCount !== prevCount && prevCount !== 0) {
      setAnimating(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setAnimating(false)
        setPrevCount(viewerCount)
      }, 300)
    }
  }, [viewerCount, prevCount])

  if (viewerCount <= 1) return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] tracking-wide transition-all duration-300',
        animating && 'scale-[1.03]',
        className
      )}
      style={{
        backgroundColor: 'color-mix(in srgb, var(--foreground) 5%, transparent)',
        color: 'var(--muted-foreground)',
      }}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{
            backgroundColor: '#059669',
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: '#059669' }}
        />
      </span>
      <Eye size={12} strokeWidth={1.5} className="shrink-0 opacity-60" />
      <span className="relative overflow-hidden">
        <span
          className="inline-flex items-center transition-transform duration-300 ease-out"
          style={{
            transform: animating
              ? viewerCount > prevCount
                ? 'translateY(-100%)'
                : 'translateY(100%)'
              : 'translateY(0)',
            opacity: animating ? 0 : 1,
          }}
        >
          <strong className="font-semibold" style={{ color: 'var(--foreground)' }}>
            {viewerCount}
          </strong>
          &nbsp;people viewing this
        </span>
      </span>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Tag, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface CouponInfo {
  id: string
  code: string
  description: string | null
  discountType: string
  discountValue: number
  minOrderValue: number | null
  maxDiscount: number | null
  validUntil: string | null
}

interface CouponDiscoveryProps {
  onApply: (code: string) => void
  className?: string
}

export function CouponDiscovery({ onApply, className }: CouponDiscoveryProps) {
  const [coupons, setCoupons] = useState<CouponInfo[]>([])
  const [expanded, setExpanded] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (expanded && coupons.length === 0) {
      fetchCoupons()
    }
  }, [expanded, coupons.length])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/coupons')
      if (res.ok) {
        const data = await res.json()
        setCoupons(data.coupons || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className={cn('', className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span
          className="flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] uppercase"
          style={{ color: 'var(--accent)' }}
        >
          <Tag size={14} strokeWidth={1.5} />
          View Available Coupons
        </span>
        {expanded ? (
          <ChevronUp size={16} strokeWidth={1.5} style={{ color: 'var(--muted-foreground)' }} />
        ) : (
          <ChevronDown size={16} strokeWidth={1.5} style={{ color: 'var(--muted-foreground)' }} />
        )}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse"
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <p
              className="py-4 text-center text-[12px] tracking-wide"
              style={{ color: 'var(--muted-foreground)' }}
            >
              No coupons available right now
            </p>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex items-center justify-between border px-4 py-3"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[13px] font-bold tracking-wider"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="transition-colors"
                      title="Copy code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check size={12} strokeWidth={2} style={{ color: '#059669' }} />
                      ) : (
                        <Copy size={12} strokeWidth={1.5} style={{ color: 'var(--muted-foreground)' }} />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                    {coupon.description ||
                      (coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% off`
                        : `${formatPrice(coupon.discountValue)} off`)}
                    {coupon.minOrderValue && ` · Min. ${formatPrice(coupon.minOrderValue)}`}
                    {coupon.maxDiscount && ` · Max. ${formatPrice(coupon.maxDiscount)}`}
                  </p>
                </div>
                <button
                  onClick={() => onApply(coupon.code)}
                  className="shrink-0 ml-3 px-4 py-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                  }}
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

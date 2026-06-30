'use client'

import { useState } from 'react'
import { Truck, MapPin, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeliveryEstimateProps {
  className?: string
}

export function DeliveryEstimate({ className }: DeliveryEstimateProps) {
  const [pincode, setPincode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    minDate: string
    maxDate: string
    zone: string
    available: boolean
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const formatDeliveryDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const handleCheck = async () => {
    const clean = pincode.replace(/\s/g, '')
    if (clean.length !== 6) {
      setError('Enter a valid 6-digit pincode')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/delivery/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: clean }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not estimate delivery')
        return
      }

      setResult(data)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getZoneLabel = (zone: string) => {
    switch (zone) {
      case 'metro': return 'Express Delivery Available'
      case 'tier2': return 'Standard Delivery'
      default: return 'Standard Delivery'
    }
  }

  return (
    <div className={cn('', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Truck size={16} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
        <span
          className="text-[11px] font-medium tracking-[0.15em] uppercase"
          style={{ color: 'var(--foreground)' }}
        >
          Delivery Estimate
        </span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            type="text"
            value={pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6)
              setPincode(val)
              if (result) setResult(null)
              if (error) setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCheck()
            }}
            placeholder="Enter pincode"
            className="w-full border py-2.5 pl-9 pr-3 text-[13px] tracking-wide transition-colors focus:border-[var(--foreground)] focus:outline-none"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={loading || pincode.length < 6}
          className="shrink-0 border px-5 py-2.5 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors hover:bg-[var(--foreground)] hover:text-[var(--background)] disabled:opacity-40"
          style={{
            borderColor: 'var(--foreground)',
            color: 'var(--foreground)',
          }}
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-[11px] tracking-wide" style={{ color: '#DC2626' }}>
          {error}
        </p>
      )}

      {result && (
        <div
          className="mt-3 flex items-start gap-3 border px-4 py-3"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
        >
          <CheckCircle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: '#059669' }} />
          <div>
            <p className="text-[13px] font-medium" style={{ color: 'var(--foreground)' }}>
              {formatDeliveryDate(result.minDate)} — {formatDeliveryDate(result.maxDate)}
            </p>
            <p className="mt-0.5 text-[11px] tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
              {getZoneLabel(result.zone)}
              {result.zone === 'metro' && ' · Faster delivery to your area'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FlashSaleData {
  id: string
  title: string
  discount: number
  endsAt: string
  category: string | null
  product: {
    name: string
    slug: string
    price: number
    image: string
  } | null
}

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calc())
    const interval = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-1.5">
      {[
        { value: timeLeft.hours, label: 'HRS' },
        { value: timeLeft.minutes, label: 'MIN' },
        { value: timeLeft.seconds, label: 'SEC' },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-[14px] font-bold opacity-60">:</span>}
          <div className="text-center">
            <span className="inline-block min-w-[2rem] bg-white/20 px-1.5 py-0.5 font-mono text-[16px] font-bold tracking-wider">
              {pad(unit.value)}
            </span>
            <p className="mt-0.5 text-[8px] tracking-[0.15em] uppercase opacity-70">
              {unit.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function FlashSaleBanner({ className }: { className?: string }) {
  const [sales, setSales] = useState<FlashSaleData[]>([])

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch('/api/flash-sales')
        if (res.ok) {
          const data = await res.json()
          setSales(data.flashSales || [])
        }
      } catch {
        // silent
      }
    }
    fetchSales()
  }, [])

  if (sales.length === 0) return null

  const sale = sales[0]
  const href = sale.product
    ? `/products/${sale.product.slug}`
    : sale.category
      ? `/products?category=${sale.category}`
      : '/products'

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
            <Zap size={20} strokeWidth={1.5} fill="currentColor" />
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase opacity-70">
              Flash Sale
            </p>
            <p className="text-[16px] font-semibold tracking-wide">
              {sale.title} — {sale.discount}% OFF
            </p>
          </div>
        </div>

        <CountdownTimer endsAt={sale.endsAt} />

        <Link
          href={href}
          className="shrink-0 px-6 py-2.5 text-[11px] font-medium tracking-[0.15em] uppercase transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          Shop Now
        </Link>
      </div>
    </div>
  )
}

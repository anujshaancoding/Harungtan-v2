'use client'

import { useState } from 'react'
import { Bell, CheckCircle, Mail } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

interface NotifyMeButtonProps {
  productSlug: string
  size: string
  className?: string
}

export function NotifyMeButton({ productSlug, size, className }: NotifyMeButtonProps) {
  const { data: session } = useSession()
  const [email, setEmail] = useState(session?.user?.email || '')
  const [showInput, setShowInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNotify = async () => {
    if (!email) {
      setError('Please enter your email')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/products/${productSlug}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, size }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to register')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        className={cn('flex items-center gap-2 py-2 text-[12px] tracking-wide', className)}
        style={{ color: '#059669' }}
      >
        <CheckCircle size={14} strokeWidth={1.5} />
        We&apos;ll notify you when {size} is back in stock
      </div>
    )
  }

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className={cn(
          'flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors',
          className
        )}
        style={{ color: 'var(--accent)' }}
      >
        <Bell size={14} strokeWidth={1.5} />
        Notify Me When Available
      </button>
    )
  }

  return (
    <div className={cn('', className)}>
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
            placeholder="Enter your email"
            className="w-full border py-2 pl-9 pr-3 text-[12px] tracking-wide focus:border-[var(--foreground)] focus:outline-none"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
          />
        </div>
        <button
          onClick={handleNotify}
          disabled={loading}
          className="shrink-0 px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors disabled:opacity-50"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
          }}
        >
          {loading ? '...' : 'Notify'}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-[10px]" style={{ color: '#DC2626' }}>
          {error}
        </p>
      )}
    </div>
  )
}

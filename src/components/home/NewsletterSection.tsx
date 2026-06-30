'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const FALLBACK_IMAGE = 'https://picsum.photos/seed/newsletter-harungtan/1200/800'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [bgImage, setBgImage] = useState(FALLBACK_IMAGE)

  useEffect(() => {
    fetch('/api/site-images?section=newsletter')
      .then((res) => res.json())
      .then((data) => {
        if (data.images?.length > 0) {
          setBgImage(data.images[0].imageUrl)
        }
      })
      .catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => null)
        setErrorMsg(data?.message || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="relative flex flex-col lg:flex-row">
      {/* Image Half */}
      <div className="relative min-h-[300px] lg:min-h-[500px] lg:w-1/2">
        <Image
          src={bgImage}
          alt="Join the Harungtan community"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Half */}
      <div className="flex items-center bg-[var(--foreground)] px-6 py-16 sm:px-10 lg:w-1/2 lg:px-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-lg"
        >
          <p className="subheading mb-4">Stay Connected</p>
          <h2 className="heading-editorial text-3xl text-white sm:text-4xl">
            Join the Club
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/50 max-w-md">
            Exclusive drops, early access to sales, and members-only offers.
            No spam, ever.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 flex items-center gap-3 text-emerald-400"
            >
              <CheckCircle size={20} strokeWidth={1.5} />
              <span className="text-sm font-medium">
                You&apos;re in! Check your inbox for a welcome surprise.
              </span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className={cn(
                    'h-13 flex-1 border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/30',
                    'focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]',
                    'transition-all duration-200'
                  )}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn(
                    'inline-flex h-13 items-center justify-center gap-2.5 bg-[var(--accent)] px-7 text-[13px] font-medium uppercase tracking-[0.08em] text-white',
                    'transition-all duration-300 hover:bg-[var(--warm-dark)]',
                    'disabled:opacity-50'
                  )}
                >
                  {status === 'loading' ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <ArrowRight size={15} strokeWidth={1.5} />
                  )}
                  Subscribe
                </button>
              </div>

              {status === 'error' && errorMsg && (
                <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
              )}

              <p className="mt-4 text-[11px] text-white/30 tracking-wide">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

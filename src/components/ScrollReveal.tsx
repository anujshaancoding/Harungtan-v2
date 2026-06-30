'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  animation?: 'reveal-up' | 'reveal-image' | 'reveal-line'
  delay?: number
  threshold?: number
}

export default function ScrollReveal({
  children,
  className,
  animation = 'reveal-up',
  delay = 0,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => {
      setTimeout(() => {
        el.classList.add('revealed')
      }, delay * 1000)
    }

    // Use threshold 0 to ensure observer fires even for clipped elements
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          observer.unobserve(el)
        }
      },
      { threshold: 0, rootMargin: '50px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold])

  return (
    <div ref={ref} className={cn(animation, className)}>
      {children}
    </div>
  )
}

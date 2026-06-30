'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnView)
  const ref = useRef<HTMLDivElement>(null)

  const start = useCallback(() => {
    setHasStarted(true)
  }, [])

  useEffect(() => {
    if (startOnView && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            start()
            observer.disconnect()
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(ref.current)
      return () => observer.disconnect()
    }
  }, [startOnView, start])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    let frameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const t = Math.min(elapsed / duration, 1)
      // Ease-out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(eased * end)

      if (t < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [hasStarted, end, duration])

  return { count, ref }
}

function formatNumber(value: number, decimals: number = 0): string {
  const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()
  if (decimals > 0) return rounded
  // Add commas
  return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

interface Stat {
  value: number
  decimals: number
  suffix: string
  label: string
}

const stats: Stat[] = [
  { value: 50000, decimals: 0, suffix: '+', label: 'Happy Customers' },
  { value: 100000, decimals: 0, suffix: '+', label: 'T-Shirts Sold' },
  { value: 180, decimals: 0, suffix: ' GSM', label: 'GSM Cotton' },
  { value: 4.8, decimals: 1, suffix: '/5', label: 'Average Rating' },
]

function StatItem({ stat }: { stat: Stat }) {
  const { count, ref } = useCountUp(stat.value, 2000)

  return (
    <div ref={ref} className="py-8 text-center">
      <p className="heading-editorial text-4xl sm:text-5xl lg:text-6xl text-white">
        {formatNumber(count, stat.decimals)}
        <span className="text-[var(--accent)]">{stat.suffix}</span>
      </p>
      <p className="mt-3 text-xs tracking-[0.2em] uppercase text-white/60">
        {stat.label}
      </p>
    </div>
  )
}

export default function StatsCounter() {
  return (
    <section className="bg-[var(--foreground)]">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-7xl px-4 py-16 lg:py-24"
      >
        <div className="grid grid-cols-2 gap-y-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

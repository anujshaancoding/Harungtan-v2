'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  name: string
  location: string
  rating: number
  comment: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Arjun Mehta',
    location: 'Mumbai',
    rating: 5,
    initials: 'AM',
    comment:
      'The fabric quality is incredible. I ordered 3 round necks and they feel softer than brands costing twice as much. Definitely my go-to now.',
  },
  {
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    initials: 'PS',
    comment:
      'Love the oversized fit! Perfect drop shoulders and the stitching is super clean. Got so many compliments wearing the charcoal one.',
  },
  {
    name: 'Rahul Nair',
    location: 'Bangalore',
    rating: 4,
    initials: 'RN',
    comment:
      'Fast delivery and great packaging. The polo tee fits true to size and the collar holds its shape even after multiple washes.',
  },
  {
    name: 'Sneha Patil',
    location: 'Pune',
    rating: 5,
    initials: 'SP',
    comment:
      "Finally a brand that gets women's tees right. The fit is flattering, fabric is breathable, and the colours don't fade. Highly recommend!",
  },
]

// Animated counter hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return
    let startTime: number | null = null
    let frameId: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const t = Math.min((timestamp - startTime) / duration, 1)
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
  { value: 180, decimals: 0, suffix: '', label: 'GSM Cotton' },
  { value: 4.8, decimals: 1, suffix: '/5', label: 'Average Rating' },
]

function StatItem({ stat }: { stat: Stat }) {
  const { count, ref } = useCountUp(stat.value, 2000)
  return (
    <div ref={ref} className="text-center">
      <p className="heading-editorial text-2xl sm:text-3xl lg:text-4xl text-white">
        {formatNumber(count, stat.decimals)}
        <span className="text-[var(--accent)]">{stat.suffix}</span>
      </p>
      <p className="mt-1.5 text-[10px] tracking-[0.2em] uppercase text-white/50">
        {stat.label}
      </p>
    </div>
  )
}

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1)
      setCurrent(index)
    },
    [current]
  )

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  const testimonial = testimonials[current]

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? 24 : -24,
    }),
    center: {
      opacity: 1,
      y: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: dir > 0 ? -24 : 24,
    }),
  }

  return (
    <section className="bg-[var(--foreground)]">
      {/* Stats Row */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="subheading mb-10"
            style={{ color: 'var(--accent)' }}
          >
            What They Say
          </motion.p>

          {/* Large quote mark */}
          <div
            className="mx-auto mb-8 text-6xl leading-none font-serif select-none"
            style={{ color: 'var(--accent)' }}
            aria-hidden
          >
            &ldquo;
          </div>

          {/* Testimonial content */}
          <div className="relative min-h-[220px] sm:min-h-[180px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Stars */}
                <div className="mb-6 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      strokeWidth={1.5}
                      className={cn(
                        i < testimonial.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-white/20 text-white/20'
                      )}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="heading-editorial text-xl sm:text-2xl lg:text-3xl text-white leading-snug">
                  {testimonial.comment}
                </p>

                {/* Author */}
                <div className="mt-8">
                  <p className="text-white font-medium text-sm tracking-wide">
                    {testimonial.name}
                  </p>
                  <p className="text-white/50 text-xs mt-1 tracking-wider uppercase">
                    {testimonial.location}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    'h-1.5 transition-all duration-300',
                    i === current
                      ? 'w-8 bg-[var(--accent)]'
                      : 'w-1.5 bg-white/30 hover:bg-white/50'
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="text-white/40 hover:text-white transition-colors duration-300"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

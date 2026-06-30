'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=960&h=1200&fit=crop&q=80'

const stats = [
  { label: '100% Cotton', detail: 'Premium long-staple fibers' },
  { label: '180 GSM', detail: 'Heavyweight luxury feel' },
  { label: 'Pre-Shrunk', detail: 'True-to-size, every wash' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
    },
  }),
}

export default function EditorialSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const [imageUrl, setImageUrl] = useState(FALLBACK_IMAGE)

  useEffect(() => {
    fetch('/api/site-images?section=editorial')
      .then((res) => res.json())
      .then((data) => {
        const img = data.images?.[0]
        if (img?.imageUrl) setImageUrl(img.imageUrl)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    // Only enable parallax on desktop
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    if (!mediaQuery.matches) return

    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far through the viewport the section has scrolled
      // When section top is at bottom of viewport: progress = 0
      // When section bottom is at top of viewport: progress = 1
      const sectionHeight = rect.height
      const progress = (windowHeight - rect.top) / (windowHeight + sectionHeight)

      // Clamp between 0 and 1
      const clamped = Math.max(0, Math.min(1, progress))

      // Map to -20px to +20px range (40px total movement, centered)
      const offset = (clamped - 0.5) * 40
      setParallaxOffset(offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="flex flex-col lg:flex-row">
      {/* Left: Lifestyle Image with parallax */}
      <ScrollReveal animation="reveal-image" className="relative min-h-[400px] lg:min-h-[600px] lg:w-1/2 overflow-hidden bg-neutral-200">
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${parallaxOffset}px)`,
            top: '-20px',
            bottom: '-20px',
          }}
        >
          <Image
            src={imageUrl}
            alt="Harungtan craftsmanship — premium cotton fabric detail"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </ScrollReveal>

      {/* Right: Brand Story */}
      <div className="flex items-center lg:w-1/2 bg-[var(--muted)] px-8 py-16 lg:px-16">
        <div className="max-w-lg">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="subheading mb-4"
          >
            The Harungtan Difference
          </motion.p>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl lg:text-[2.75rem] mb-6"
          >
            Crafted for
            <br />
            Those Who Care
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="space-y-4 mb-10"
          >
            <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)]">
              Every Harungtan piece begins with intention. We source only the
              finest long-staple cotton, chosen for its softness, strength, and
              the way it ages gracefully with every wear.
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)]">
              Our 180 GSM heavyweight fabric is pre-washed and pre-shrunk so it
              fits perfectly from day one — and stays that way. No pilling, no
              fading, no compromises.
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)]">
              We believe the best wardrobe is a considered one. Fewer pieces,
              better made, designed to last seasons instead of weeks.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            className="grid grid-cols-3 gap-6 mb-10"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-[var(--border)] pt-4">
                <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
                  {stat.label}
                </p>
                <p className="text-[12px] leading-snug text-[var(--muted-foreground)]">
                  {stat.detail}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
          >
            <Link href="/about" className="btn-outline">
              Our Story
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

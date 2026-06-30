'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  mediaUrl: string
  mediaType: string
  ctaText: string | null
  ctaLink: string | null
  ctaText2: string | null
  ctaLink2: string | null
}

const FALLBACK_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Wear What\nDefines You',
    subtitle: 'Spring/Summer 2026',
    description: 'Premium cotton essentials crafted for those who refuse to blend in. Designed in India, made to last.',
    mediaUrl: 'https://picsum.photos/seed/hero-editorial/1920/1080',
    mediaType: 'image',
    ctaText: 'Shop New Arrivals',
    ctaLink: '/products?newArrival=true',
    ctaText2: 'Explore All',
    ctaLink2: '/products',
  },
  {
    id: '2',
    title: 'Bold Moves\nOnly',
    subtitle: 'New Collection',
    description: 'Statement pieces that speak louder than words. Premium fabrics, unmatched comfort.',
    mediaUrl: 'https://picsum.photos/seed/hero-bold/1920/1080',
    mediaType: 'image',
    ctaText: 'Shop Collection',
    ctaLink: '/products?featured=true',
    ctaText2: null,
    ctaLink2: null,
  },
  {
    id: '3',
    title: 'Comfort\nRedefined',
    subtitle: 'Essentials',
    description: 'Everyday basics that feel anything but basic. 100% organic cotton, ethically made.',
    mediaUrl: 'https://picsum.photos/seed/hero-comfort/1920/1080',
    mediaType: 'image',
    ctaText: 'Shop Bestsellers',
    ctaLink: '/products?bestseller=true',
    ctaText2: null,
    ctaLink2: null,
  },
]

const AUTO_PLAY_INTERVAL = 6000

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map())

  useEffect(() => {
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (data.banners?.length > 0) setBanners(data.banners)
      })
      .catch(() => {})
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % banners.length)
    }, AUTO_PLAY_INTERVAL)
  }, [banners.length])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, resetTimer])

  // Play/pause videos based on current slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index === current) {
        video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [current])

  function goTo(index: number) {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  function goPrev() {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }

  function goNext() {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % banners.length)
  }

  const banner = banners[current]

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <section className="relative h-screen w-full overflow-hidden -mt-28 bg-black">
      {/* Background slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={banner.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {banner.mediaType === 'video' ? (
            <video
              ref={(el) => { if (el) videoRefs.current.set(current, el) }}
              src={banner.mediaUrl}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <Image
              src={banner.mediaUrl}
              alt={banner.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={current === 0}
            />
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay - stays in same position */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id + '-content'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Subtitle */}
              {banner.subtitle && (
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-[var(--accent)]" />
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                    {banner.subtitle}
                  </p>
                </div>
              )}

              {/* Title */}
              <h1 className="heading-editorial whitespace-pre-line text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                {banner.title}
              </h1>

              {/* Description */}
              {banner.description && (
                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                  {banner.description}
                </p>
              )}

              {/* CTAs */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {banner.ctaText && banner.ctaLink && (
                  <Link
                    href={banner.ctaLink}
                    className="group inline-flex items-center justify-center gap-3 bg-white px-8 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)] transition-all duration-300 hover:bg-[var(--accent)] hover:text-white"
                  >
                    {banner.ctaText}
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                )}
                {banner.ctaText2 && banner.ctaLink2 && (
                  <Link
                    href={banner.ctaLink2}
                    className="group inline-flex items-center justify-center gap-3 border border-white/30 px-8 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-white hover:bg-white/10"
                  >
                    {banner.ctaText2}
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:left-6 lg:left-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:right-6 lg:right-10"
            aria-label="Next slide"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-10 left-6 z-20 flex items-center gap-3 lg:left-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group flex h-6 items-center justify-center"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className={cn(
                  'h-[2px] rounded-full transition-all duration-500',
                  i === current ? 'w-10 bg-white' : 'w-5 bg-white/40 group-hover:bg-white/60'
                )}
              />
            </button>
          ))}
        </div>
      )}

      {/* Slide counter */}
      {banners.length > 1 && (
        <div className="absolute bottom-10 right-6 z-20 text-[11px] font-medium tracking-[0.15em] text-white/50 lg:right-10">
          <span className="text-white">{String(current + 1).padStart(2, '0')}</span>
          {' / '}
          {String(banners.length).padStart(2, '0')}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
          Scroll
        </span>
        <div className="relative h-10 w-[1.5px] overflow-hidden bg-white/20">
          <motion.div
            className="absolute top-0 left-0 w-full bg-white"
            animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}

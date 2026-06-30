'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const FALLBACK_IMAGE = 'https://picsum.photos/seed/harungtan-lifestyle/1920/1080'

export default function LifestyleBanner() {
  const [imageUrl, setImageUrl] = useState(FALLBACK_IMAGE)

  useEffect(() => {
    fetch('/api/site-images?section=lifestyle')
      .then((res) => res.json())
      .then((data) => {
        const img = data.images?.[0]
        if (img?.imageUrl) setImageUrl(img.imageUrl)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background image with subtle parallax via bg-fixed */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="Harungtan lifestyle"
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 text-center px-4 max-w-3xl"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="subheading mb-6"
          style={{ color: 'var(--accent)' }}
        >
          The Art of Simplicity
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="heading-editorial text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight"
        >
          Less Noise.
          <br />
          More Substance.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10"
        >
          <Link
            href="/shop"
            className="inline-block bg-white text-[var(--foreground)] px-10 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5"
          >
            Shop the Collection
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

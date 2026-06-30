'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

interface InstaImage {
  seed: string
  alt: string
  url: string
}

const FALLBACK_IMAGES: InstaImage[] = [
  { seed: 'harungtan-ig-1', alt: 'Lifestyle look 1', url: 'https://picsum.photos/seed/harungtan-ig-1/600/600' },
  { seed: 'harungtan-ig-2', alt: 'Lifestyle look 2', url: 'https://picsum.photos/seed/harungtan-ig-2/600/600' },
  { seed: 'harungtan-ig-3', alt: 'Lifestyle look 3', url: 'https://picsum.photos/seed/harungtan-ig-3/600/600' },
  { seed: 'harungtan-ig-4', alt: 'Lifestyle look 4', url: 'https://picsum.photos/seed/harungtan-ig-4/600/600' },
  { seed: 'harungtan-ig-5', alt: 'Lifestyle look 5', url: 'https://picsum.photos/seed/harungtan-ig-5/600/600' },
  { seed: 'harungtan-ig-6', alt: 'Lifestyle look 6', url: 'https://picsum.photos/seed/harungtan-ig-6/600/600' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function InstagramFeed() {
  const [images, setImages] = useState<InstaImage[]>(FALLBACK_IMAGES)

  useEffect(() => {
    fetch('/api/site-images?section=instagram')
      .then((res) => res.json())
      .then((data) => {
        if (data.images?.length > 0) {
          const mapped = data.images.map((img: { key: string; label: string; imageUrl: string }) => ({
            seed: img.key,
            alt: img.label,
            url: img.imageUrl,
          }))
          setImages(mapped)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-[var(--background)] py-20 lg:py-28">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-12 text-center px-4"
      >
        <p className="subheading mb-3">#harungtan</p>
        <h2 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl">
          Follow the Journey
        </h2>
        <div className="divider-accent-center mt-5" />
      </motion.div>

      {/* Image grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      >
        {images.map((img) => (
          <motion.div key={img.seed} variants={itemVariants}>
            <Link
              href="/products"
              className="group relative block aspect-square overflow-hidden"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16.67vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--foreground)]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Instagram
                  className="mb-2 text-white"
                  size={28}
                  strokeWidth={1.5}
                />
                <span className="text-sm tracking-wider text-white/90">
                  View Post
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 text-center"
      >
        <a
          href="#"
          className="inline-block text-sm tracking-widest text-[var(--accent)] uppercase transition-colors hover:text-[var(--warm-dark)]"
        >
          @harungtan
        </a>
      </motion.div>
    </section>
  )
}

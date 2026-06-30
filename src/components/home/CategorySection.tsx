'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface CategoryItem {
  name: string
  slug: string
  image: string
  large: boolean
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { name: 'Round Neck', slug: 'round-neck', image: 'https://picsum.photos/seed/cat-roundneck/800/1000', large: true },
  { name: 'V-Neck', slug: 'v-neck', image: 'https://picsum.photos/seed/cat-vneck/600/800', large: false },
  { name: 'Polo', slug: 'polo', image: 'https://picsum.photos/seed/cat-polo/600/800', large: false },
  { name: 'Henley', slug: 'henley', image: 'https://picsum.photos/seed/cat-henley/800/1000', large: true },
  { name: 'Oversized', slug: 'oversized', image: 'https://picsum.photos/seed/cat-oversized/800/1000', large: true },
  { name: 'Graphic Tees', slug: 'graphic-tees', image: 'https://picsum.photos/seed/cat-graphic/600/800', large: false },
]

const LARGE_KEYS = new Set(['round-neck', 'henley', 'oversized'])

const FILLER_WORDS = ['Drip.', 'Flex.', 'Slay.']

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
}

export default function CategorySection() {
  const [categories, setCategories] = useState<CategoryItem[]>(FALLBACK_CATEGORIES)

  useEffect(() => {
    fetch('/api/site-images?section=category')
      .then((res) => res.json())
      .then((data) => {
        if (data.images?.length > 0) {
          const mapped = data.images.map((img: { key: string; label: string; imageUrl: string }) => ({
            name: img.label,
            slug: img.key,
            image: img.imageUrl,
            large: LARGE_KEYS.has(img.key),
          }))
          setCategories(mapped)
        }
      })
      .catch(() => {})
  }, [])

  // Arrange into rows of 2
  const rows = []
  for (let i = 0; i < categories.length; i += 2) {
    rows.push(categories.slice(i, i + 2))
  }

  return (
    <section className="px-4 pt-10 pb-20 sm:px-6 lg:px-8 lg:pt-14 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        {/* Minimal heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12 flex items-center gap-4"
        >
          <div className="h-[1px] w-8 bg-[var(--accent)]" />
          <p className="subheading">Shop by Style</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col gap-3 sm:gap-4"
        >
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
            >
              {row.map((category) => {
                const isLarge = category.large
                return (
                  <motion.div
                    key={category.slug}
                    variants={itemVariants}
                    className={
                      isLarge
                        ? 'col-span-2 lg:col-span-2'
                        : 'col-span-2 sm:col-span-1 lg:col-span-1 lg:flex lg:flex-col'
                    }
                  >
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="group relative block overflow-hidden aspect-[3/4] sm:aspect-[4/5] lg:aspect-[16/9]"
                    >
                      {/* Image */}
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={
                          isLarge
                            ? '(max-width: 1024px) 100vw, 66vw'
                            : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        }
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition-all duration-500 group-hover:from-black/80" />

                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                        <h3 className="heading-editorial text-xl text-white sm:text-2xl lg:text-3xl">
                          {category.name}
                        </h3>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white/80 transition-all duration-300 group-hover:text-white group-hover:gap-3">
                          Shop Now
                          <ArrowRight
                            size={13}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                            strokeWidth={1.5}
                          />
                        </span>
                      </div>
                    </Link>

                    {/* Decorative filler word in gap below small card */}
                    {!isLarge && (
                      <div className="hidden lg:flex flex-1 items-center justify-center min-h-[60px]">
                        <p className="heading-editorial text-5xl italic text-[var(--foreground)] opacity-[0.15] select-none">
                          {FILLER_WORDS[rowIndex] ?? 'Vibe.'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

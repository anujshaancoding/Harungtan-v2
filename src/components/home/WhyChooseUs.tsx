'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CraftStory {
  title: string
  body: string
  image: string
  reverse: boolean
}

const FALLBACK_STORIES: CraftStory[] = [
  {
    title: 'Premium Cotton',
    body: 'Every Harungtan tee starts with 180 GSM combed cotton — sourced for its softness, breathability, and rich texture. No shortcuts, no blended fillers. Just pure, heavyweight cotton that drapes beautifully and feels better with every wash.',
    image: 'https://picsum.photos/seed/harungtan-cotton/800/800',
    reverse: false,
  },
  {
    title: 'Perfect Fit',
    body: 'We spent months refining our patterns across hundreds of body types. The result is a fit that flatters without clinging — structured shoulders, a clean silhouette, and proportions that work whether you\'re layering or going solo.',
    image: 'https://picsum.photos/seed/harungtan-fit/800/800',
    reverse: true,
  },
  {
    title: 'Built to Last',
    body: 'Reinforced stitching at every stress point. Colourfast dyes that hold their depth wash after wash. Pre-shrunk fabric so what you buy is what you keep. These aren\'t disposable basics — they\'re wardrobe foundations.',
    image: 'https://picsum.photos/seed/harungtan-durability/800/800',
    reverse: false,
  },
]

const CRAFT_KEYS = ['premium-cotton', 'perfect-fit', 'built-to-last']

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
}

export default function WhyChooseUs() {
  const [stories, setStories] = useState<CraftStory[]>(FALLBACK_STORIES)

  useEffect(() => {
    fetch('/api/site-images?section=why-choose-us')
      .then((res) => res.json())
      .then((data) => {
        if (data.images?.length > 0) {
          const updated = [...FALLBACK_STORIES]
          for (const img of data.images as { key: string; imageUrl: string }[]) {
            const idx = CRAFT_KEYS.indexOf(img.key)
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], image: img.imageUrl }
            }
          }
          setStories(updated)
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
        className="mb-16 text-center px-4"
      >
        <p className="subheading mb-3">The Craft</p>
        <h2 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl">
          What Goes Into Every Tee
        </h2>
        <div className="divider-accent-center mt-5" />
      </motion.div>

      {/* Craft stories */}
      <div className="mx-auto max-w-7xl">
        {stories.map((story, i) => (
          <motion.div
            key={story.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className={cn(
              'flex flex-col lg:flex-row',
              story.reverse && 'lg:flex-row-reverse'
            )}
          >
            {/* Image */}
            <div className="lg:w-1/2 relative aspect-square lg:aspect-auto lg:min-h-[480px]">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Text */}
            <div className="lg:w-1/2 flex items-center p-8 sm:p-12 lg:p-16">
              <div>
                <p className="subheading mb-3">0{i + 1}</p>
                <h3 className="heading-editorial text-2xl lg:text-3xl mb-4 text-[var(--foreground)]">
                  {story.title}
                </h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed text-base">
                  {story.body}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

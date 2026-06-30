'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageLightboxProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  productName: string
}

export function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  productName,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [direction, setDirection] = useState(0)

  // Touch swipe state
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isSwiping = useRef(false)

  // Sync initialIndex when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setDirection(0)
    }
  }, [isOpen, initialIndex])

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir)
      setCurrentIndex(index)
    },
    []
  )

  const goPrev = useCallback(() => {
    if (images.length <= 1) return
    const prev = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    goTo(prev, -1)
  }, [currentIndex, images.length, goTo])

  const goNext = useCallback(() => {
    if (images.length <= 1) return
    const next = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    goTo(next, 1)
  }, [currentIndex, images.length, goTo])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goPrev()
          break
        case 'ArrowRight':
          goNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goPrev, goNext])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Touch handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
    isSwiping.current = true
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) return
    isSwiping.current = false

    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left -> next
        goNext()
      } else {
        // Swiped right -> prev
        goPrev()
      }
    }
  }, [goNext, goPrev])

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  if (images.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: '#000' }}
          onClick={onClose}
        >
          {/* Top bar: counter + close */}
          <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
            <span className="text-[13px] tracking-wide text-white/70">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
              aria-label="Close lightbox"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Main image area */}
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden px-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left arrow (desktop) */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className="absolute left-4 z-10 hidden h-12 w-12 items-center justify-center text-white/50 transition-colors hover:text-white sm:flex"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} strokeWidth={1.5} />
              </button>
            )}

            {/* Image with slide animation */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                src={images[currentIndex]}
                alt={`${productName} — image ${currentIndex + 1} of ${images.length}`}
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
              />
            </AnimatePresence>

            {/* Right arrow (desktop) */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className="absolute right-4 z-10 hidden h-12 w-12 items-center justify-center text-white/50 transition-colors hover:text-white sm:flex"
                aria-label="Next image"
              >
                <ChevronRight size={28} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              className="relative z-10 flex items-center justify-center gap-2 px-4 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx, idx > currentIndex ? 1 : -1)}
                  className={cn(
                    'h-14 w-14 flex-shrink-0 overflow-hidden border-2 transition-all sm:h-16 sm:w-16',
                    currentIndex === idx
                      ? 'border-white opacity-100'
                      : 'border-transparent opacity-40 hover:opacity-70'
                  )}
                >
                  <img
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImageLightbox

'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const announcements = [
  'Free Shipping on orders above ₹999 | Use code FIRST10 for 10% off',
  'New Arrivals are here! Shop the latest collection now',
  'Buy 2 Get 1 Free on all Graphic Tees | Limited Time Only',
]

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextAnnouncement = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
      setIsAnimating(false)
    }, 300)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextAnnouncement, 4000)
    return () => clearInterval(interval)
  }, [nextAnnouncement])

  if (!isVisible) return null

  return (
    <div className="relative bg-[#1A1A1A] text-white overflow-hidden">
      <div className="flex items-center justify-center px-8 py-2.5">
        <p
          className={cn(
            'text-center text-[11px] sm:text-xs font-medium tracking-[0.08em] uppercase transition-all duration-300',
            isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          )}
        >
          {announcements[currentIndex]}
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className={cn(
          'absolute right-3 top-1/2 -translate-y-1/2',
          'text-white/50 hover:text-white transition-colors duration-200'
        )}
        aria-label="Close announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

'use client'

import { useState, useRef, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import 'swiper/css'
import 'swiper/css/pagination'

interface MobileImageCarouselProps {
  images: string[]
  productName: string
  discount?: number
  isNewArrival?: boolean
  onImageClick?: (index: number) => void
  className?: string
}

export function MobileImageCarousel({
  images,
  productName,
  discount,
  isNewArrival,
  onImageClick,
  className,
}: MobileImageCarouselProps) {
  const [scale, setScale] = useState(1)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const lastDistRef = useRef(0)
  const imgRef = useRef<HTMLDivElement>(null)

  const initials = productName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastDistRef.current = Math.sqrt(dx * dx + dy * dy)

      // Set zoom origin to midpoint
      const rect = imgRef.current?.getBoundingClientRect()
      if (rect) {
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2
        setOrigin({
          x: ((midX - rect.left) / rect.width) * 100,
          y: ((midY - rect.top) / rect.height) * 100,
        })
      }
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (lastDistRef.current > 0) {
        const newScale = scale * (dist / lastDistRef.current)
        setScale(Math.max(1, Math.min(4, newScale)))
      }
      lastDistRef.current = dist
    }
  }, [scale])

  const handleTouchEnd = useCallback(() => {
    lastDistRef.current = 0
    if (scale < 1.2) setScale(1)
  }, [scale])

  const displayImages = images.length > 0 ? images : ['']

  return (
    <div className={cn('lg:hidden', className)}>
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !bg-[var(--border)] !opacity-100',
          bulletActiveClass: '!bg-[var(--foreground)] !w-4 !rounded-full',
        }}
        spaceBetween={0}
        slidesPerView={1}
        className="aspect-[3/4]"
      >
        {displayImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div
              ref={idx === 0 ? imgRef : undefined}
              className="relative h-full w-full overflow-hidden"
              style={{
                backgroundColor: 'var(--muted)',
                touchAction: scale > 1 ? 'none' : 'pan-y',
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={() => onImageClick?.(idx)}
            >
              {img ? (
                <img
                  src={img}
                  alt={`${productName} view ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-100"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                  }}
                  draggable={false}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--muted), var(--border))' }}
                >
                  <span
                    className="text-7xl font-light tracking-widest"
                    style={{ color: 'var(--border)' }}
                  >
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Badges */}
      <div className="absolute left-4 top-4 z-10 flex gap-2">
        {discount && discount > 0 && <Badge variant="danger">{discount}% OFF</Badge>}
        {isNewArrival && <Badge>NEW</Badge>}
      </div>
    </div>
  )
}

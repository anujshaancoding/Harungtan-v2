'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface RangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  onChangeEnd?: (value: [number, number]) => void
  step?: number
  formatLabel?: (value: number) => string
  className?: string
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  onChangeEnd,
  step = 1,
  formatLabel = (v) => String(v),
  className,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null)

  // Use refs to avoid stale closures during drag — keeps event handlers stable
  const valueRef = useRef(value)
  const onChangeRef = useRef(onChange)
  const onChangeEndRef = useRef(onChangeEnd)
  useEffect(() => { valueRef.current = value }, [value])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  useEffect(() => { onChangeEndRef.current = onChangeEnd }, [onChangeEnd])

  const clamp = useCallback(
    (val: number) => Math.round(Math.min(max, Math.max(min, val)) / step) * step,
    [min, max, step]
  )

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return min
      const rect = track.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return clamp(min + ratio * (max - min))
    },
    [min, max, clamp]
  )

  useEffect(() => {
    if (!dragging) return

    const handleMove = (clientX: number) => {
      const newVal = getValueFromPosition(clientX)
      const cur = valueRef.current
      if (dragging === 'min') {
        onChangeRef.current([Math.min(newVal, cur[1]), cur[1]])
      } else {
        onChangeRef.current([cur[0], Math.max(newVal, cur[0])])
      }
    }

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX)
    const onEnd = () => {
      setDragging(null)
      onChangeEndRef.current?.(valueRef.current)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [dragging, getValueFromPosition])

  const minPercent = ((value[0] - min) / (max - min)) * 100
  const maxPercent = ((value[1] - min) / (max - min)) * 100

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newVal = getValueFromPosition(e.clientX)
    const distToMin = Math.abs(newVal - value[0])
    const distToMax = Math.abs(newVal - value[1])
    let next: [number, number]
    if (distToMin <= distToMax) {
      next = [Math.min(newVal, value[1]), value[1]]
    } else {
      next = [value[0], Math.max(newVal, value[0])]
    }
    onChange(next)
    onChangeEnd?.(next)
  }

  const handleKeyDown = (handle: 'min' | 'max', e: React.KeyboardEvent) => {
    let delta = 0
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      delta = step
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      delta = -step
    } else {
      return
    }
    e.preventDefault()
    let next: [number, number]
    if (handle === 'min') {
      const val = clamp(value[0] + delta)
      next = [Math.min(val, value[1]), value[1]]
    } else {
      const val = clamp(value[1] + delta)
      next = [value[0], Math.max(val, value[0])]
    }
    onChange(next)
    onChangeEnd?.(next)
  }

  return (
    <div className={cn('select-none', className)}>
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-1 cursor-pointer bg-[var(--border)]"
        onClick={handleTrackClick}
      >
        {/* Active range */}
        <div
          className="absolute top-0 h-full bg-[var(--accent)]"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />

        {/* Min handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Minimum value"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value[0]}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab bg-[var(--foreground)] transition-shadow hover:shadow-md active:cursor-grabbing"
          style={{ left: `${minPercent}%` }}
          onMouseDown={(e) => {
            e.stopPropagation()
            setDragging('min')
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            setDragging('min')
          }}
          onKeyDown={(e) => handleKeyDown('min', e)}
        />

        {/* Max handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Maximum value"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value[1]}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab bg-[var(--foreground)] transition-shadow hover:shadow-md active:cursor-grabbing"
          style={{ left: `${maxPercent}%` }}
          onMouseDown={(e) => {
            e.stopPropagation()
            setDragging('max')
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            setDragging('max')
          }}
          onKeyDown={(e) => handleKeyDown('max', e)}
        />
      </div>

      {/* Labels */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
        <span>{formatLabel(value[0])}</span>
        <span>{formatLabel(value[1])}</span>
      </div>
    </div>
  )
}

export default RangeSlider

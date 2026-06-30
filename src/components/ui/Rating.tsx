import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 22,
}

export function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  className,
}: RatingProps) {
  const clampedValue = Math.min(Math.max(0, value), max)

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(clampedValue)
        const halfFilled = !filled && i < clampedValue

        return (
          <Star
            key={i}
            size={sizeMap[size]}
            strokeWidth={1.5}
            className={cn(
              filled
                ? 'fill-[var(--accent)] text-[var(--accent)]'
                : halfFilled
                  ? 'fill-[var(--accent)]/50 text-[var(--accent)]'
                  : 'fill-[var(--border)] text-[var(--border)]'
            )}
          />
        )
      })}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-[var(--muted-foreground)]">
          {clampedValue.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default Rating

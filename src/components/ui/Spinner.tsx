import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const px = sizeMap[size]
  const innerPx = Math.round(px * 0.55)

  return (
    <div
      className={cn('relative animate-spin', className)}
      style={{ width: px, height: px }}
    >
      {/* Outer square */}
      <div
        className="absolute inset-0 border-2 border-[var(--accent)]"
        style={{ opacity: 0.3 }}
      />
      {/* Inner square, rotated */}
      <div
        className="absolute border-2 border-[var(--accent)]"
        style={{
          width: innerPx,
          height: innerPx,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(45deg)',
        }}
      />
    </div>
  )
}

export default Spinner

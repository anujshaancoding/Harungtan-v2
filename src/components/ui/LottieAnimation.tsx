'use client'

import { Suspense, lazy } from 'react'
import { cn } from '@/lib/utils'

const Lottie = lazy(() => import('lottie-react'))

interface LottieAnimationProps {
  animationData: object
  loop?: boolean
  autoplay?: boolean
  className?: string
  style?: React.CSSProperties
}

export function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className,
  style,
}: LottieAnimationProps) {
  return (
    <Suspense
      fallback={
        <div
          className={cn('animate-pulse', className)}
          style={{ ...style, backgroundColor: 'var(--muted)' }}
        />
      }
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        className={className}
        style={style}
      />
    </Suspense>
  )
}

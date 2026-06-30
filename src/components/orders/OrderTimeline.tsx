'use client'

import { motion } from 'framer-motion'
import {
  Package,
  CheckCircle,
  Cog,
  Truck,
  Home,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { OrderStatusEvent } from '@/types'

interface OrderTimelineProps {
  statusHistory: OrderStatusEvent[]
  currentStatus: string
}

const STEPS = [
  { key: 'pending', label: 'Ordered', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Cog },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
] as const

function getStepTimestamp(
  statusHistory: OrderStatusEvent[],
  stepKey: string
): string | null {
  const event = statusHistory.find((e) => e.status === stepKey)
  return event?.timestamp || null
}

export default function OrderTimeline({
  statusHistory,
  currentStatus,
}: OrderTimelineProps) {
  // If cancelled or returned, show that state separately
  const isCancelled = currentStatus === 'cancelled'
  const isReturned = currentStatus === 'returned'

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStatus)

  function getStepState(index: number) {
    if (isCancelled || isReturned) {
      // All steps up to where order got before cancel/return are completed
      const lastActiveStep = STEPS.findIndex(
        (s) =>
          statusHistory.some((e) => e.status === s.key)
      )
      if (index <= lastActiveStep) return 'completed'
      return 'future'
    }
    if (index < currentStepIndex) return 'completed'
    if (index === currentStepIndex) return 'current'
    return 'future'
  }

  return (
    <div className="py-6">
      {(isCancelled || isReturned) && (
        <div className="mb-4 inline-flex items-center px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-neutral-100 text-[var(--muted-foreground)] border border-[var(--border)]">
          Order {isCancelled ? 'Cancelled' : 'Returned'}
        </div>
      )}

      {/* Desktop: Horizontal */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between">
          {STEPS.map((step, index) => {
            const state = getStepState(index)
            const timestamp = getStepTimestamp(statusHistory, step.key)
            const Icon = step.icon
            const isLast = index === STEPS.length - 1

            return (
              <div key={step.key} className="flex flex-1 items-start">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                      state === 'completed' &&
                        'bg-[var(--foreground)] text-white',
                      state === 'current' &&
                        'bg-[var(--accent)] text-white',
                      state === 'future' &&
                        'border-2 border-dashed border-[var(--border)] text-[var(--border)]'
                    )}
                  >
                    {state === 'current' && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-20" />
                    )}
                    <Icon size={18} strokeWidth={1.5} className="relative z-10" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.15, duration: 0.3 }}
                    className="mt-3 text-center"
                  >
                    <p
                      className={cn(
                        'text-[10px] font-semibold uppercase tracking-wider',
                        state === 'future'
                          ? 'text-[var(--border)]'
                          : 'text-[var(--foreground)]'
                      )}
                    >
                      {step.label}
                    </p>
                    {timestamp && (
                      <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">
                        {formatDate(timestamp)}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Connecting line */}
                {!isLast && (
                  <div className="mt-5 flex-1 px-2">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.05, duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                      className={cn(
                        'h-[2px] w-full',
                        state === 'completed' || getStepState(index + 1) === 'current'
                          ? 'bg-[var(--foreground)]'
                          : 'border-t-2 border-dashed border-[var(--border)] h-0'
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile: Vertical */}
      <div className="block md:hidden">
        <div className="space-y-0">
          {STEPS.map((step, index) => {
            const state = getStepState(index)
            const timestamp = getStepTimestamp(statusHistory, step.key)
            const Icon = step.icon
            const isLast = index === STEPS.length - 1

            return (
              <div key={step.key} className="flex">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={cn(
                      'relative flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                      state === 'completed' &&
                        'bg-[var(--foreground)] text-white',
                      state === 'current' &&
                        'bg-[var(--accent)] text-white',
                      state === 'future' &&
                        'border-2 border-dashed border-[var(--border)] text-[var(--border)]'
                    )}
                  >
                    {state === 'current' && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-20" />
                    )}
                    <Icon size={16} strokeWidth={1.5} className="relative z-10" />
                  </motion.div>

                  {/* Vertical connecting line */}
                  {!isLast && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.1 + 0.05, duration: 0.3 }}
                      style={{ transformOrigin: 'top' }}
                      className={cn(
                        'w-[2px] h-8',
                        state === 'completed' || getStepState(index + 1) === 'current'
                          ? 'bg-[var(--foreground)]'
                          : 'border-l-2 border-dashed border-[var(--border)] w-0'
                      )}
                    />
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.15, duration: 0.3 }}
                  className="ml-4 pb-8"
                >
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      state === 'future'
                        ? 'text-[var(--border)]'
                        : 'text-[var(--foreground)]'
                    )}
                  >
                    {step.label}
                  </p>
                  {timestamp && (
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {formatDate(timestamp)}
                    </p>
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

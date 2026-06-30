'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    // Focus the cancel button for safety
    setTimeout(() => confirmRef.current?.focus(), 100)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-sm border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 p-1 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <div className="flex items-start gap-3">
              {variant !== 'default' && (
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center',
                  variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                )}>
                  <AlertTriangle size={20} strokeWidth={1.5} />
                </div>
              )}
              <div className="flex-1">
                <h3 id="confirm-title" className="heading-editorial text-lg text-[var(--foreground)]">
                  {title}
                </h3>
                <p id="confirm-message" className="mt-2 text-[13px] leading-relaxed text-[var(--muted-foreground)]">
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="btn-outline flex-1 h-10 text-[12px]"
                disabled={loading}
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmRef}
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  'flex-1 h-10 text-[12px] font-medium uppercase tracking-[0.08em] transition-all disabled:opacity-50',
                  variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'btn-primary'
                )}
              >
                {loading ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, X } from 'lucide-react'
import { useVoiceSearch } from '@/lib/voice-search'
import { cn } from '@/lib/utils'

interface VoiceSearchProps {
  className?: string
}

export function VoiceSearchButton({ className }: VoiceSearchProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleResult = useCallback((transcript: string) => {
    setTimeout(() => {
      setShowModal(false)
      router.push(`/products?search=${encodeURIComponent(transcript)}`)
    }, 500)
  }, [router])

  const { isListening, isSupported, transcript, startListening, stopListening } = useVoiceSearch({
    onResult: handleResult,
  })

  if (!isSupported) return null

  const handleClick = () => {
    setShowModal(true)
    setTimeout(startListening, 300)
  }

  const handleClose = () => {
    stopListening()
    setShowModal(false)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={cn('flex items-center justify-center transition-colors hover:opacity-70', className)}
        style={{ color: 'var(--foreground)' }}
        aria-label="Voice search"
        title="Search by voice"
      >
        <Mic size={18} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 z-[101] w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 p-8 text-center"
              style={{ backgroundColor: 'var(--background)' }}
            >
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 p-1"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              <div className="mb-6">
                <motion.div
                  animate={isListening ? {
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(196, 90, 60, 0)',
                      '0 0 0 20px rgba(196, 90, 60, 0.15)',
                      '0 0 0 0 rgba(196, 90, 60, 0)',
                    ],
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isListening ? 'var(--accent)' : 'var(--muted)',
                    color: isListening ? 'white' : 'var(--foreground)',
                  }}
                >
                  {isListening ? (
                    <Mic size={32} strokeWidth={1.5} />
                  ) : (
                    <MicOff size={32} strokeWidth={1.5} />
                  )}
                </motion.div>
              </div>

              <h3
                className="heading-editorial text-lg"
                style={{ color: 'var(--foreground)' }}
              >
                {isListening ? 'Listening...' : 'Tap to try again'}
              </h3>

              {transcript && (
                <p
                  className="mt-3 text-[14px] font-medium"
                  style={{ color: 'var(--foreground)' }}
                >
                  &ldquo;{transcript}&rdquo;
                </p>
              )}

              <p
                className="mt-2 text-[12px] tracking-wide"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {isListening
                  ? 'Say a product name or category'
                  : 'Voice recognition ended'}
              </p>

              {!isListening && (
                <button
                  onClick={startListening}
                  className="mt-4 px-6 py-2 text-[11px] font-medium tracking-[0.1em] uppercase"
                  style={{
                    backgroundColor: 'var(--foreground)',
                    color: 'var(--background)',
                  }}
                >
                  Try Again
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

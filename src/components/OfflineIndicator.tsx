'use client'

import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)
  const [showReconnected, setShowReconnected] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const goOffline = () => {
      setIsOffline(true)
      setWasOffline(true)
    }

    const goOnline = () => {
      setIsOffline(false)
      if (wasOffline) {
        setShowReconnected(true)
        setTimeout(() => setShowReconnected(false), 3000)
      }
    }

    // Check initial state
    if (!navigator.onLine) {
      setIsOffline(true)
      setWasOffline(true)
    }

    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [wasOffline])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[80] flex items-center justify-center gap-2 bg-red-600 py-2.5 text-[12px] font-medium tracking-[0.06em] text-white shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff size={14} strokeWidth={1.5} />
          You&apos;re offline. Some features may not work.
        </motion.div>
      )}

      {showReconnected && !isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[80] flex items-center justify-center gap-2 bg-green-600 py-2.5 text-[12px] font-medium tracking-[0.06em] text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          <Wifi size={14} strokeWidth={1.5} />
          Back online!
        </motion.div>
      )}
    </AnimatePresence>
  )
}

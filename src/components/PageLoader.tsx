'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageLoader() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Only show on first visit per session (not on internal navigation)
    const hasSeenLoader = sessionStorage.getItem('harungtan-loaded')
    if (!hasSeenLoader) {
      setLoading(true)
      sessionStorage.setItem('harungtan-loaded', '1')
      const timer = setTimeout(() => setLoading(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--foreground)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="heading-editorial text-3xl text-white tracking-[0.08em] sm:text-4xl">
              Harungtan
            </h1>
            <motion.div
              className="mx-auto mt-6 h-[1px] bg-[var(--accent)]"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

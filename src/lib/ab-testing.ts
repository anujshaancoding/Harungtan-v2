'use client'

import { useState, useEffect, useCallback } from 'react'

interface ABTestResult {
  variant: 'A' | 'B'
  track: (event: 'view' | 'click' | 'convert') => void
}

export function useABTest(testId: string): ABTestResult | null {
  const [variant, setVariant] = useState<'A' | 'B' | null>(null)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        // Get or create session ID
        let sessionId = sessionStorage.getItem('harungtan-ab-session')
        if (!sessionId) {
          sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
          sessionStorage.setItem('harungtan-ab-session', sessionId)
        }

        // Deterministic variant assignment based on session + test
        const hash = simpleHash(sessionId + testId)
        const assignedVariant: 'A' | 'B' = hash % 100 < 50 ? 'A' : 'B'
        setVariant(assignedVariant)
      } catch {
        setVariant('A')
      }
    }

    fetchTest()
  }, [testId])

  const track = useCallback(
    async (event: 'view' | 'click' | 'convert') => {
      if (!variant) return
      const sessionId = sessionStorage.getItem('harungtan-ab-session') || ''

      try {
        await fetch(`/api/admin/ab-tests/${testId}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variant, event, sessionId }),
        })
      } catch {
        // silent
      }
    },
    [testId, variant]
  )

  if (!variant) return null
  return { variant, track }
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

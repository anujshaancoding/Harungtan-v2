'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SessionExpiredHandler() {
  const { status } = useSession()
  const router = useRouter()
  const prevStatusRef = useRef(status)

  useEffect(() => {
    if (
      prevStatusRef.current === 'authenticated' &&
      status === 'unauthenticated'
    ) {
      toast.error('Your session has expired. Please sign in again.')
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    }

    prevStatusRef.current = status
  }, [status, router])

  return null
}

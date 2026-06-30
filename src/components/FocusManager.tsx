'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function FocusManager() {
  const pathname = usePathname()

  useEffect(() => {
    const timeout = setTimeout(() => {
      const main = document.getElementById('main-content')
      if (main) {
        main.focus({ preventScroll: true })
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [pathname])

  return null
}

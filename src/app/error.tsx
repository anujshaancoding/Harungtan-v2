'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="text-center px-4">
        {/* Brand Logo */}
        <Logo
          size="sm"
          href={false}
          className="justify-center mb-8 text-[var(--muted-foreground)]"
          iconClassName="h-6 w-6"
          textClassName="text-lg"
        />

        <p className="subheading mb-4">Something went wrong</p>
        <h1 className="heading-editorial text-5xl text-[var(--foreground)] sm:text-7xl mb-6">
          Oops!
        </h1>
        <p className="text-[var(--muted-foreground)] mb-10 max-w-md mx-auto text-sm leading-relaxed">
          We apologize for the inconvenience. An unexpected error occurred.
          Please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try Again
          </button>
          <Link href="/" className="btn-outline">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

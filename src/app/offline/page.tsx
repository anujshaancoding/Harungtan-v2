import type { Metadata } from 'next'
import { WifiOff } from 'lucide-react'
import ReloadButton from './ReloadButton'

export const metadata: Metadata = {
  title: 'Offline | Harungtan',
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mb-8 flex justify-center">
          <WifiOff
            size={48}
            strokeWidth={1.5}
            style={{ color: 'var(--muted-foreground)' }}
          />
        </div>

        <p
          className="mb-4 text-[11px] font-medium tracking-[0.2em] uppercase"
          style={{ color: 'var(--accent)' }}
        >
          Connection Lost
        </p>

        <h1
          className="heading-editorial mb-4 text-4xl sm:text-5xl"
          style={{ color: 'var(--foreground)' }}
        >
          You&apos;re Offline
        </h1>

        <p
          className="mx-auto mb-10 max-w-sm text-[15px] leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          It looks like you&apos;ve lost your internet connection. Please check your
          network settings and try again.
        </p>

        <div
          className="mx-auto mb-10 h-px w-12"
          style={{ backgroundColor: 'var(--accent)' }}
        />

        <ReloadButton />
      </div>
    </div>
  )
}

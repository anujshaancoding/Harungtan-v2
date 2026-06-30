import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--background)]">
      {/* Subtle decorative line accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-px w-full bg-[var(--border)]" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-[var(--border)]" />
        <div className="absolute left-12 top-12 h-24 w-px bg-[var(--border)] opacity-40" />
        <div className="absolute bottom-12 right-12 h-24 w-px bg-[var(--border)] opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-5 py-12 sm:px-6">
        {/* Brand */}
        <div className="mb-10 text-center">
          <Logo
            size="lg"
            className="text-[var(--foreground)]"
          />
          <div className="mx-auto mt-3 h-px w-8 bg-[var(--accent)]" />
        </div>

        {/* Auth form content */}
        {children}
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
        <span className="uppercase text-[var(--muted-foreground)]">
          &copy; {new Date().getFullYear()} Harungtan. All rights reserved.
        </span>
      </div>
    </div>
  )
}

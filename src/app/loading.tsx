import { LogoIcon } from '@/components/ui/Logo'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <LogoIcon className="h-10 w-10 text-[var(--foreground)] animate-pulse" />
          <div className="absolute -inset-3 border border-[var(--border)] animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
          Loading
        </p>
      </div>
    </div>
  )
}

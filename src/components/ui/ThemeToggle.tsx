'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed left-[76px] bottom-10 z-40 hidden lg:flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-[18px] w-[18px] text-[var(--foreground)]" strokeWidth={1.5} />
      ) : (
        <Moon className="h-[18px] w-[18px] text-[var(--foreground)]" strokeWidth={1.5} />
      )}
    </button>
  )
}

export default ThemeToggle

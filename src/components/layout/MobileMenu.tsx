'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronRight, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'
import Logo from '@/components/ui/Logo'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const shopLinks = [
  { label: 'Men', href: '/products?gender=men' },
  { label: 'Women', href: '/products?gender=women' },
  { label: 'All Products', href: '/products' },
]

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/products?newArrival=true' },
  { label: 'Bestsellers', href: '/products?bestseller=true' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [shopOpen, setShopOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-out panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-[320px] bg-[var(--background)]',
              'flex flex-col shadow-2xl'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
              <div onClick={onClose}>
                <Logo size="sm" />
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/"
                    onClick={onClose}
                    aria-current={pathname === '/' ? 'page' : undefined}
                    className="block py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>

                {/* Shop with dropdown */}
                <li>
                  <button
                    onClick={() => setShopOpen(!shopOpen)}
                    className={cn(
                      'flex w-full items-center justify-between py-3.5',
                      'text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200'
                    )}
                  >
                    <span>Shop</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-300',
                        shopOpen && 'rotate-180'
                      )}
                      strokeWidth={1.5}
                    />
                  </button>
                  <AnimatePresence>
                    {shopOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden ml-4 border-l border-[var(--border)]"
                      >
                        {shopLinks.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className="flex items-center gap-2 py-3 pl-4 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-200"
                            >
                              <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {navLinks.slice(1).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className="block py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="my-6 border-t border-[var(--border)]" />

              {/* Secondary links */}
              <ul className="space-y-0.5">
                {[
                  { label: 'My Account', href: '/profile' },
                  { label: 'Wishlist', href: '/profile/wishlist' },
                  { label: 'Track Order', href: '/profile/orders' },
                  { label: 'Help & Support', href: '/help' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-[var(--border)] px-6 py-4 space-y-3">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="flex w-full items-center justify-between py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)]">
                  {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)]">
                  {resolvedTheme === 'dark' ? (
                    <Sun className="h-[16px] w-[16px]" strokeWidth={1.5} />
                  ) : (
                    <Moon className="h-[16px] w-[16px]" strokeWidth={1.5} />
                  )}
                </span>
              </button>
              <p className="text-[11px] text-[var(--muted-foreground)] text-center tracking-wide">
                &copy; {new Date().getFullYear()} Harungtan. All rights reserved.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

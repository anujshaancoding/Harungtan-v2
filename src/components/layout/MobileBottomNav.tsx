'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/products' },
  { icon: ShoppingBag, label: 'Cart', href: '/cart', showBadge: true },
  { icon: User, label: 'Account', href: '/profile' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const cartItemCount = useCartStore((state) => state.itemCount())
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const activeIndex = useMemo(() => {
    return navItems.findIndex(({ href }) =>
      href === '/' ? pathname === '/' : pathname?.startsWith(href)
    )
  }, [pathname])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--background)] lg:hidden safe-area-bottom">
      <div className="relative flex items-center justify-around px-2 py-2">
        {/* Animated active indicator */}
        {activeIndex >= 0 && (
          <div
            className="absolute -top-0.5 h-[2px] bg-[var(--accent)] transition-all duration-300 ease-out"
            style={{
              width: `${100 / navItems.length}%`,
              left: `${(activeIndex / navItems.length) * 100}%`,
            }}
          />
        )}
        {navItems.map(({ icon: Icon, label, href, showBadge }) => {
          const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors duration-200',
                isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
              )}
            >
              <div className={cn(
                'relative transition-transform duration-200',
                isActive && 'scale-110'
              )}>
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                {showBadge && mounted && cartItemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[8px] font-bold text-white">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] tracking-wide transition-all duration-200',
                isActive ? 'font-semibold' : 'font-medium'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

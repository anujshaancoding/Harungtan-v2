'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, Package, Heart, Settings, LogOut, ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const navItems = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Orders', href: '/profile/orders', icon: Package },
  { label: 'Wishlist', href: '/profile/wishlist', icon: Heart },
  { label: 'Settings', href: '/profile/settings', icon: Settings },
]

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile')
    }
  }, [status, router])

  if (!mounted || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)] pt-28">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1 text-[var(--muted-foreground)]" style={{ fontSize: '11px', letterSpacing: '0.08em' }}>
            <Link href="/" className="uppercase transition-colors hover:text-[var(--foreground)]">
              Home
            </Link>
            <ChevronRight size={12} strokeWidth={1.5} className="text-[var(--border)]" />
            <span className="uppercase font-medium text-[var(--foreground)]">My Account</span>
          </nav>

          <div className="mb-8">
            <h1 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl">
              My Account
            </h1>
            <div className="mt-3 h-px w-10 bg-[var(--accent)]" />
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block lg:w-64 lg:shrink-0">
              <div className="border border-[var(--border)] bg-white">
                {/* User info */}
                <div className="border-b border-[var(--border)] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-[var(--foreground)] text-white" style={{ fontSize: '13px', fontWeight: 600 }}>
                      {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--foreground)]" style={{ fontSize: '13px' }}>
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="truncate text-[var(--muted-foreground)]" style={{ fontSize: '11px' }}>
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nav links */}
                <nav className="p-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 transition-colors',
                          isActive
                            ? 'bg-[var(--accent)] text-white'
                            : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                        )}
                        style={{ fontSize: '13px' }}
                      >
                        <item.icon size={18} strokeWidth={1.5} />
                        {item.label}
                      </Link>
                    )
                  })}

                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="mt-1 flex w-full items-center gap-3 px-3 py-2.5 text-red-600 transition-colors hover:bg-red-50"
                    style={{ fontSize: '13px' }}
                  >
                    <LogOut size={18} strokeWidth={1.5} />
                    Sign Out
                  </button>
                </nav>
              </div>
            </aside>

            {/* Mobile Tabs */}
            <div className="overflow-x-auto lg:hidden">
              <div className="flex gap-1 border-b border-[var(--border)] pb-px">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 font-medium transition-colors',
                        isActive
                          ? 'border-[var(--accent)] text-[var(--foreground)]'
                          : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                      )}
                      style={{ fontSize: '13px' }}
                    >
                      <item.icon size={16} strokeWidth={1.5} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Main Content */}
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

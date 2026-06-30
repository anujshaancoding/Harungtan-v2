'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { cn, formatPrice } from '@/lib/utils'
import Logo from '@/components/ui/Logo'
import MobileMenu from './MobileMenu'
import CartSidebar from './CartSidebar'
import { NotificationCenter } from '@/components/NotificationCenter'
import { VoiceSearchButton } from '@/components/VoiceSearch'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products', hasMegaMenu: true },
  { label: 'Stories', href: '/stories' },
]

const shopByStyle = [
  { label: 'Round Neck', href: '/products?category=round-neck' },
  { label: 'V-Neck', href: '/products?category=v-neck' },
  { label: 'Polo', href: '/products?category=polo' },
  { label: 'Henley', href: '/products?category=henley' },
  { label: 'Oversized', href: '/products?category=oversized' },
  { label: 'Graphic Tees', href: '/products?category=graphic-tees' },
]

const shopByFit = [
  { label: 'Regular Fit', href: '/products?fit=regular' },
  { label: 'Oversized Fit', href: '/products?fit=oversized' },
  { label: 'Slim Fit', href: '/products?fit=slim' },
]

const quickLinks = [
  { label: 'New Arrivals', href: '/products?newArrival=true' },
  { label: 'Bestsellers', href: '/products?bestseller=true' },
  { label: 'All Products', href: '/products' },
  { label: 'About Us', href: '/about' },
]

const popularSearches = ['Round Neck', 'Oversized', 'Polo', 'Graphic Tees', 'V-Neck']

const SEARCH_HISTORY_KEY = 'harungtan-search-history'
const MAX_HISTORY = 5

function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function addToSearchHistory(query: string) {
  const history = getSearchHistory().filter((h) => h.toLowerCase() !== query.toLowerCase())
  const updated = [query, ...history].slice(0, MAX_HISTORY)
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
}

function clearSearchHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY)
}

interface SearchProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string[]
  category: string
  rating: number
  reviewCount: number
}

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerVisible, setHeaderVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchHasQueried, setSearchHasQueried] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollY = useRef(0)

  const cartItemCount = useCartStore((state) => state.itemCount())
  const toggleCart = useCartStore((state) => state.toggleCart)
  const wishlistCount = useWishlistStore((state) => state.items.length)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 10)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHeaderVisible(false)
        setMegaMenuOpen(false)
      } else {
        setHeaderVisible(true)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
      setSearchHistory(getSearchHistory())
    }
  }, [searchOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
    setMegaMenuOpen(false)
  }, [pathname])

  // Lock body scroll when search is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Reset search state when overlay closes
      setSearchResults([])
      setSearchLoading(false)
      setSearchHasQueried(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [searchOpen])

  // Debounced live search
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    const trimmed = searchQuery.trim()

    if (!trimmed) {
      setSearchResults([])
      setSearchLoading(false)
      setSearchHasQueried(false)
      return
    }

    setSearchLoading(true)

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(trimmed)}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.products ?? [])
        } else {
          setSearchResults([])
        }
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
        setSearchHasQueried(true)
      }
    }, 300)

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }
    }
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery.trim())
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleMegaEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setMegaMenuOpen(true)
  }

  const handleMegaLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setMegaMenuOpen(false), 200)
  }

  const isHomepage = pathname === '/'
  const isTransparent = isHomepage && !scrolled && !megaMenuOpen

  const marqueeText =
    'FREE SHIPPING OVER \u20B9999  \u00B7  PREMIUM 100% COTTON  \u00B7  MADE IN INDIA  \u00B7  EASY 7-DAY RETURNS  \u00B7  '

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-30 w-full transition-all duration-500',
          headerVisible ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        {/* Announcement Bar */}
        <div className="overflow-hidden bg-[var(--foreground)] py-2.5">
          <div className="animate-marquee whitespace-nowrap flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 mx-0"
              >
                {marqueeText}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div
          className={cn(
            'transition-all duration-500',
            isTransparent
              ? 'bg-transparent'
              : megaMenuOpen
                ? 'bg-[var(--background)] border-b border-[var(--border)]'
                : 'glass border-b border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          )}
        >
          <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left: Mobile menu + Search (mobile) + Desktop Nav */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'lg:hidden p-1.5 transition-colors duration-200',
                  isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Search icon - mobile only (left side) */}
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'lg:hidden p-1.5 transition-colors duration-200',
                  isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>

              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) =>
                  link.hasMegaMenu ? (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={handleMegaEnter}
                      onMouseLeave={handleMegaLeave}
                    >
                      <Link
                        href={link.href}
                        aria-current={pathname === link.href || pathname?.startsWith('/products') ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-200',
                          isTransparent
                            ? (pathname === link.href || pathname?.startsWith('/products')
                              ? 'text-white'
                              : 'text-white/70 hover:text-white')
                            : (pathname === link.href || pathname?.startsWith('/products')
                              ? 'text-[var(--foreground)]'
                              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]')
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            'h-3 w-3 transition-transform duration-200',
                            megaMenuOpen && 'rotate-180'
                          )}
                          strokeWidth={1.5}
                        />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className={cn(
                        'hover-underline text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-200',
                        isTransparent
                          ? (pathname === link.href
                            ? 'text-white'
                            : 'text-white/70 hover:text-white')
                          : (pathname === link.href
                            ? 'text-[var(--foreground)]'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]')
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            </div>

            {/* Center: Logo */}
            <Logo
              size="md"
              className={cn(
                'absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0 transition-colors duration-500',
                isTransparent ? 'text-white' : 'text-[var(--foreground)]'
              )}
            />

            {/* Right: Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search icon - desktop only (right side) */}
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'hidden lg:block p-2 transition-colors duration-200',
                  isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>

              <div className={cn(
                'relative hidden sm:block',
                isTransparent ? '[&>button]:text-white/80 [&>button:hover]:text-white' : ''
              )}>
                <NotificationCenter />
              </div>

              <Link
                href="/profile"
                className={cn(
                  'hidden sm:block p-2 transition-colors duration-200',
                  isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>

              {/* Wishlist - hidden on mobile, visible sm+ */}
              <Link
                href="/profile/wishlist"
                className={cn(
                  'relative hidden sm:block p-2 transition-colors duration-200',
                  isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
                aria-label="Wishlist"
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center bg-[var(--accent)] text-[9px] font-semibold text-white" style={{ borderRadius: '50%' }}>
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleCart}
                className={cn(
                  'relative p-2 transition-colors duration-200',
                  isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                )}
                aria-label="Cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center bg-[var(--accent)] text-[9px] font-semibold text-white" style={{ borderRadius: '50%' }}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu — positioned after nav */}
        <AnimatePresence>
          {megaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute left-0 right-0 top-full hidden lg:block"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <div className="border-b border-[var(--border)] bg-[var(--background)] shadow-lg">
                <div className="mx-auto max-w-7xl px-8 py-10 grid grid-cols-4 gap-10">
                  {/* By Style */}
                  <div>
                    <p className="subheading mb-5">By Style</p>
                    <div className="space-y-3">
                      {shopByStyle.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-sm text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* By Fit */}
                  <div>
                    <p className="subheading mb-5">By Fit</p>
                    <div className="space-y-3">
                      {shopByFit.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-sm text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <p className="subheading mb-5">Quick Links</p>
                    <div className="space-y-3">
                      {quickLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block text-sm text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--foreground)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Featured Image */}
                  <Link href="/products?newArrival=true" className="group relative overflow-hidden aspect-[4/5]">
                    <Image
                      src="https://picsum.photos/seed/mega-menu-featured/600/750"
                      alt="New Arrivals"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-5 left-5">
                      <p className="text-white text-sm font-medium">New Arrivals</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.1em] text-white/70 transition-colors group-hover:text-white">
                        Shop Now
                        <ArrowRight size={11} strokeWidth={1.5} />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full-Screen Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]"
          >
            {/* Top bar: Logo + Close */}
            <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
              <Logo
                size="xs"
                className="text-[var(--muted-foreground)]"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-200"
                aria-label="Close search"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-full max-w-2xl px-6"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-end gap-3">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 border-b-2 border-[var(--foreground)] bg-transparent heading-editorial text-2xl sm:text-3xl lg:text-4xl text-[var(--foreground)] placeholder:text-[var(--border)] focus:outline-none py-4"
                />
                <div className="pb-4">
                  <VoiceSearchButton />
                </div>
              </form>

              <div className="mt-12" aria-live="polite" aria-atomic="true">
                {/* Loading spinner */}
                {searchLoading && (
                  <div className="flex items-center gap-3 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-[var(--muted-foreground)]" strokeWidth={1.5} />
                    <span className="text-sm text-[var(--muted-foreground)]">Searching...</span>
                  </div>
                )}

                {/* Search results */}
                {!searchLoading && searchResults.length > 0 && (
                  <div>
                    <p className="subheading mb-5">Results</p>
                    <div className="space-y-0 divide-y divide-[var(--border)]">
                      {searchResults.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: index * 0.05 }}
                        >
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="flex items-center gap-4 py-4 transition-colors duration-200 hover:bg-[var(--muted)]"
                          >
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-[var(--muted)]">
                              <Image
                                src={product.images[0] || '/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-[var(--foreground)] truncate">
                                {product.name}
                              </p>
                              <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
                                {product.category}
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-sm font-medium text-[var(--foreground)]">
                                {formatPrice(product.price)}
                              </p>
                              {product.comparePrice && product.comparePrice > product.price && (
                                <p className="text-[11px] text-[var(--muted-foreground)] line-through">
                                  {formatPrice(product.comparePrice)}
                                </p>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--accent)]"
                    >
                      View all results
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                  </div>
                )}

                {/* No results */}
                {!searchLoading && searchHasQueried && searchResults.length === 0 && searchQuery.trim() && (
                  <div className="py-4">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      No results found for &ldquo;{searchQuery.trim()}&rdquo;
                    </p>
                  </div>
                )}

                {/* Recent + Popular searches (shown when input is empty) */}
                {!searchQuery.trim() && !searchLoading && (
                  <>
                    {searchHistory.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-5">
                          <p className="subheading">Recent Searches</p>
                          <button
                            onClick={() => {
                              clearSearchHistory()
                              setSearchHistory([])
                            }}
                            className="hover-underline text-[11px] tracking-[0.04em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {searchHistory.map((term) => (
                            <button
                              key={term}
                              onClick={() => {
                                setSearchQuery(term)
                                searchInputRef.current?.focus()
                              }}
                              className="border border-[var(--border)] px-5 py-2.5 text-[13px] font-medium text-[var(--muted-foreground)] transition-all duration-200 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="subheading mb-5">Popular Searches</p>
                    <div className="flex flex-wrap gap-3">
                      {popularSearches.map((term) => (
                        <Link
                          key={term}
                          href={`/products?category=${term.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setSearchOpen(false)}
                          className="border border-[var(--border)] px-5 py-2.5 text-[13px] font-medium text-[var(--muted-foreground)] transition-all duration-200 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <CartSidebar />
    </>
  )
}

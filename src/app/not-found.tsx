import Link from 'next/link'
import { Search, ArrowRight, Home } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const popularCategories = [
  { name: 'Round Neck', slug: 'round-neck' },
  { name: 'Oversized', slug: 'oversized' },
  { name: 'Polo', slug: 'polo' },
  { name: 'Graphic Tees', slug: 'graphic-tees' },
  { name: 'V-Neck', slug: 'v-neck' },
  { name: 'Henley', slug: 'henley' },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        {/* Brand Logo */}
        <Logo
          size="sm"
          href={false}
          className="justify-center mb-8 text-[var(--muted-foreground)]"
          iconClassName="h-6 w-6"
          textClassName="text-lg"
        />

        {/* Subheading */}
        <p
          className="subheading mb-4 text-[11px] font-medium tracking-[0.2em] uppercase"
          style={{ color: 'var(--accent)' }}
        >
          Page Not Found
        </p>

        {/* Large 404 */}
        <h1
          className="heading-editorial mb-4 text-[8rem] font-normal leading-none sm:text-[12rem]"
          style={{ color: 'var(--foreground)' }}
        >
          404
        </h1>

        {/* Friendly message */}
        <p
          className="mx-auto mb-10 max-w-md text-[15px] leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Looks like this page has wandered off. It may have been moved, renamed,
          or is no longer available. Let us help you find what you need.
        </p>

        {/* Search bar */}
        <form
          action="/products"
          method="GET"
          className="mx-auto mb-12 flex max-w-md gap-3"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--muted-foreground)' }}
            />
            <input
              type="search"
              name="search"
              placeholder="Search for products..."
              className="w-full border py-3 pl-11 pr-4 text-[13px] transition-colors focus:border-[var(--foreground)] focus:outline-none"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center px-6 py-3 text-[13px] font-medium tracking-[0.1em] uppercase transition-all"
            style={{
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
            }}
          >
            Search
          </button>
        </form>

        {/* Divider */}
        <div
          className="mx-auto mb-10 h-px w-12"
          style={{ backgroundColor: 'var(--accent)' }}
        />

        {/* Popular categories */}
        <p
          className="mb-5 text-[11px] font-medium tracking-[0.15em] uppercase"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Popular Categories
        </p>
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          {popularCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="inline-flex items-center gap-1.5 border px-4 py-2.5 text-[12px] font-medium tracking-wide uppercase transition-all hover:border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              {cat.name}
              <ArrowRight size={12} strokeWidth={1.5} />
            </Link>
          ))}
        </div>

        {/* Back to Home button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 text-[13px] font-medium tracking-[0.15em] uppercase transition-all"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
          }}
        >
          <Home size={16} strokeWidth={1.5} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { cn, SIZES, COLORS, CATEGORIES } from '@/lib/utils'
import { RangeSlider } from '@/components/ui/RangeSlider'

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[var(--border)] py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)]">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={14} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
        ) : (
          <ChevronDown size={14} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
        )}
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Bestseller', value: 'bestseller' },
]

const GENDER_OPTIONS = ['Men', 'Women', 'Unisex']

export function ProductFilters({ className }: { className?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCategories = searchParams.get('category')?.split(',').filter(Boolean) || []
  const activeGender = searchParams.get('gender') || ''
  const activeSizes = searchParams.get('sizes')?.split(',').filter(Boolean) || []
  const activeColors = searchParams.get('colors')?.split(',').filter(Boolean) || []
  const activeSort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  // Local state for smooth slider dragging — keeps slider responsive
  // Key insight: don't clear localPriceRange until URL params actually sync,
  // otherwise there's a flash frame where localPriceRange=null but URL hasn't updated yet
  const [localPriceRange, setLocalPriceRange] = useState<[number, number] | null>(null)

  // Local state for text inputs — debounce before pushing URL
  const [localMinPrice, setLocalMinPrice] = useState(minPrice)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync local text inputs when URL params change (e.g. clear filters, slider release)
  useEffect(() => { setLocalMinPrice(minPrice) }, [minPrice])
  useEffect(() => { setLocalMaxPrice(maxPrice) }, [maxPrice])

  // Clear localPriceRange only after URL params have caught up
  // Compares the local slider position with what the URL says
  useEffect(() => {
    if (!localPriceRange) return
    const urlMin = minPrice ? Number(minPrice) : 0
    const urlMax = maxPrice ? Number(maxPrice) : 5000
    if (localPriceRange[0] === urlMin && localPriceRange[1] === urlMax) {
      setLocalPriceRange(null)
    }
    // Also clear if both are at defaults (params deleted from URL)
    if (localPriceRange[0] === 0 && localPriceRange[1] === 5000 && !minPrice && !maxPrice) {
      setLocalPriceRange(null)
    }
  }, [minPrice, maxPrice, localPriceRange])

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/products?${params.toString()}`)
    },
    [router, searchParams]
  )

  const toggleArrayParam = useCallback(
    (key: string, value: string, current: string[]) => {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      updateParams(key, next.join(','))
    },
    [updateParams]
  )

  const clearAllFilters = () => {
    setLocalPriceRange(null)
    setLocalMinPrice('')
    setLocalMaxPrice('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    router.push('/products')
  }

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeGender !== '' ||
    activeSizes.length > 0 ||
    activeColors.length > 0 ||
    minPrice !== '' ||
    maxPrice !== ''

  const filterContent = (
    <div className="space-y-0">
      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="relative">
          <select
            value={activeSort}
            onChange={(e) => updateParams('sort', e.target.value)}
            className="w-full appearance-none border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[13px] text-[var(--foreground)] transition-colors focus:border-[var(--foreground)] focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            strokeWidth={1.5}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
          />
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="group flex cursor-pointer items-center gap-3 text-[13px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center border transition-colors',
                  activeCategories.includes(cat.slug)
                    ? 'border-[var(--foreground)] bg-[var(--foreground)]'
                    : 'border-[var(--border)] group-hover:border-[var(--muted-foreground)]'
                )}
              >
                {activeCategories.includes(cat.slug) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                checked={activeCategories.includes(cat.slug)}
                onChange={() =>
                  toggleArrayParam('category', cat.slug, activeCategories)
                }
                className="sr-only"
              />
              <span className={cn(
                activeCategories.includes(cat.slug) && 'text-[var(--foreground)]'
              )}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        <div className="space-y-3">
          {GENDER_OPTIONS.map((g) => (
            <label
              key={g}
              className="group flex cursor-pointer items-center gap-3 text-[13px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full border transition-colors',
                  activeGender === g.toLowerCase()
                    ? 'border-[var(--foreground)]'
                    : 'border-[var(--border)] group-hover:border-[var(--muted-foreground)]'
                )}
              >
                {activeGender === g.toLowerCase() && (
                  <span className="h-2 w-2 rounded-full bg-[var(--foreground)]" />
                )}
              </span>
              <input
                type="radio"
                name="gender"
                checked={activeGender === g.toLowerCase()}
                onChange={() =>
                  updateParams(
                    'gender',
                    activeGender === g.toLowerCase() ? '' : g.toLowerCase()
                  )
                }
                className="sr-only"
              />
              <span className={cn(
                activeGender === g.toLowerCase() && 'text-[var(--foreground)]'
              )}>
                {g}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-4">
          <RangeSlider
            min={0}
            max={5000}
            step={100}
            value={localPriceRange ?? [
              minPrice ? Number(minPrice) : 0,
              maxPrice ? Number(maxPrice) : 5000,
            ]}
            onChange={([newMin, newMax]) => {
              setLocalPriceRange([newMin, newMax])
            }}
            onChangeEnd={([newMin, newMax]) => {
              // Keep localPriceRange set — the sync useEffect clears it once URL catches up
              setLocalPriceRange([newMin, newMax])
              const params = new URLSearchParams(searchParams.toString())
              if (newMin > 0) {
                params.set('minPrice', String(newMin))
              } else {
                params.delete('minPrice')
              }
              if (newMax < 5000) {
                params.set('maxPrice', String(newMax))
              } else {
                params.delete('maxPrice')
              }
              params.delete('page')
              router.push(`/products?${params.toString()}`)
            }}
            formatLabel={(v) => `₹${v.toLocaleString('en-IN')}`}
          />
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--muted-foreground)]">₹</span>
              <input
                type="number"
                placeholder="Min"
                value={localMinPrice}
                onChange={(e) => {
                  const val = e.target.value
                  setLocalMinPrice(val)
                  setLocalPriceRange(null)
                  if (debounceRef.current) clearTimeout(debounceRef.current)
                  debounceRef.current = setTimeout(() => updateParams('minPrice', val), 500)
                }}
                className="w-full border border-[var(--border)] bg-[var(--background)] py-2.5 pl-7 pr-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-colors focus:border-[var(--foreground)] focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-[var(--muted-foreground)]">&mdash;</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--muted-foreground)]">₹</span>
              <input
                type="number"
                placeholder="Max"
                value={localMaxPrice}
                onChange={(e) => {
                  const val = e.target.value
                  setLocalMaxPrice(val)
                  setLocalPriceRange(null)
                  if (debounceRef.current) clearTimeout(debounceRef.current)
                  debounceRef.current = setTimeout(() => updateParams('maxPrice', val), 500)
                }}
                className="w-full border border-[var(--border)] bg-[var(--background)] py-2.5 pl-7 pr-3 text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 transition-colors focus:border-[var(--foreground)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleArrayParam('sizes', size, activeSizes)}
              className={cn(
                'flex h-10 min-w-[2.75rem] items-center justify-center border px-3 text-[12px] font-medium tracking-[0.04em] transition-all duration-200',
                activeSizes.includes(size)
                  ? 'border-[var(--foreground)] bg-[var(--foreground)] text-white'
                  : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() =>
                toggleArrayParam('colors', color.name.toLowerCase(), activeColors)
              }
              className={cn(
                'flex items-center gap-2 border px-3 py-2 text-[12px] transition-all duration-200',
                activeColors.includes(color.name.toLowerCase())
                  ? 'border-[var(--foreground)] bg-[var(--muted)]'
                  : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
              )}
              title={color.name}
            >
              <span
                className={cn(
                  'h-3 w-3 border',
                  color.hex === '#FFFFFF'
                    ? 'border-[var(--border)]'
                    : 'border-transparent'
                )}
                style={{ backgroundColor: color.hex }}
              />
              <span className={cn(
                'transition-colors',
                activeColors.includes(color.name.toLowerCase())
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)]'
              )}>
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Clear all */}
      {hasActiveFilters && (
        <div className="pt-5">
          <button
            onClick={clearAllFilters}
            className="w-full border border-[var(--border)] py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-[13px]"
        >
          <SlidersHorizontal size={16} strokeWidth={1.5} />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-[var(--background)] shadow-2xl rounded-t-2xl animate-slideUp">
            {/* Drag handle */}
            <div className="sticky top-0 z-10 bg-[var(--background)] rounded-t-2xl">
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-[var(--border)]" />
              </div>
              <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)]">
                  Filters
                </h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="px-6 pb-8">
              {filterContent}
            </div>
            {/* Apply button for mobile */}
            <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--background)] px-6 py-4 safe-area-bottom">
              <button
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full py-3 text-[13px]"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn('hidden lg:block', className)}>
        <div className="sticky top-24">
          <div className="mb-1 flex items-center justify-between border-b border-[var(--border)] pb-5">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--foreground)]">
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="hover-underline text-[11px] tracking-[0.04em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                Clear all
              </button>
            )}
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  )
}

export default ProductFilters

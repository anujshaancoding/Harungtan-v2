'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

const SEGMENT_LABELS: Record<string, string> = {
  products: 'Shop',
  cart: 'Cart',
  checkout: 'Checkout',
  profile: 'Account',
  orders: 'Orders',
  wishlist: 'Wishlist',
  settings: 'Settings',
  stories: 'Stories',
  about: 'About',
  help: 'Help',
  guidelines: 'Brand Guidelines',
  'privacy-policy': 'Privacy Policy',
  'terms-of-service': 'Terms of Service',
  'return-policy': 'Return Policy',
  'refund-policy': 'Refund Policy',
  'shipping-policy': 'Shipping Policy',
}

function formatSegment(segment: string): string {
  // Check if we have a mapped label
  if (SEGMENT_LABELS[segment]) {
    return SEGMENT_LABELS[segment]
  }

  // Format dynamic segments: capitalize words, replace hyphens with spaces
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface PageBreadcrumbProps {
  className?: string
  customLabels?: Record<string, string>
}

export function PageBreadcrumb({ className, customLabels }: PageBreadcrumbProps) {
  const pathname = usePathname()

  if (!pathname || pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)

  // Merge custom labels with defaults
  const labels = customLabels ? { ...SEGMENT_LABELS, ...customLabels } : SEGMENT_LABELS

  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = labels[segment] || formatSegment(segment)
    const isLast = index === segments.length - 1

    return {
      label,
      href: isLast ? undefined : href,
    }
  })

  return <Breadcrumb items={items} showHome className={className} />
}

export default PageBreadcrumb

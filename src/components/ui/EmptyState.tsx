'use client'

import { type LucideIcon, PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from './Button'
import { motion } from 'framer-motion'

type IllustrationType = 'cart' | 'wishlist' | 'orders' | 'search' | 'reviews'

interface EmptyStateProps {
  icon?: LucideIcon
  illustration?: IllustrationType
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
}

function CartIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shopping bag outline - dashed */}
      <rect
        x="18" y="24" width="44" height="46" rx="2"
        stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 3"
      />
      {/* Bag handles */}
      <path
        d="M30 24V18C30 12.477 34.477 8 40 8C45.523 8 50 12.477 50 18V24"
        stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Accent detail - small tag */}
      <rect x="36" y="38" width="8" height="10" rx="1" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="40" cy="43" r="1.5" fill="var(--accent)" />
    </svg>
  )
}

function WishlistIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Heart */}
      <path
        d="M40 68L36.4 64.7C21.6 51.3 12 42.5 12 31.7C12 23 18.9 16 27.5 16C32.4 16 37 18.3 40 22C43 18.3 47.6 16 52.5 16C61.1 16 68 23 68 31.7C68 42.5 58.4 51.3 43.6 64.7L40 68Z"
        stroke="var(--border)" strokeWidth="1.5" fill="none"
      />
      {/* Sparkles */}
      <path d="M62 12L62 20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M58 16L66 16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 10L22 16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 13L25 13" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="70" cy="28" r="1.5" fill="var(--accent)" />
    </svg>
  )
}

function OrdersIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Box body */}
      <rect x="14" y="30" width="52" height="40" rx="2" stroke="var(--border)" strokeWidth="1.5" />
      {/* Box lid */}
      <path d="M10 22H70V30H10V22Z" stroke="var(--border)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Ribbon vertical */}
      <line x1="40" y1="30" x2="40" y2="70" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Ribbon horizontal on lid */}
      <line x1="40" y1="22" x2="40" y2="30" stroke="var(--accent)" strokeWidth="1.5" />
      {/* Bow */}
      <path
        d="M40 22C40 22 34 16 32 14C30 12 32 9 35 10C38 11 40 16 40 22Z"
        stroke="var(--accent)" strokeWidth="1.5" fill="none"
      />
      <path
        d="M40 22C40 22 46 16 48 14C50 12 48 9 45 10C42 11 40 16 40 22Z"
        stroke="var(--accent)" strokeWidth="1.5" fill="none"
      />
    </svg>
  )
}

function SearchIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Magnifying glass circle */}
      <circle cx="34" cy="34" r="20" stroke="var(--border)" strokeWidth="1.5" />
      {/* Handle */}
      <line x1="49" y1="49" x2="68" y2="68" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
      {/* Question mark */}
      <path
        d="M30 28C30 24.7 32.7 22 36 22C39.3 22 42 24.7 42 28C42 31.3 38 32 36 34"
        stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" fill="none"
      />
      <circle cx="36" cy="40" r="1.5" fill="var(--accent)" />
    </svg>
  )
}

function ReviewsIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Star */}
      <path
        d="M40 10L47.5 27.5L66 30L52 44L56 62L40 53L24 62L28 44L14 30L32.5 27.5L40 10Z"
        stroke="var(--border)" strokeWidth="1.5" fill="none" strokeLinejoin="round"
      />
      {/* Pen */}
      <line x1="58" y1="58" x2="70" y2="70" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M56 56L58 58L54 62L52 60L56 56Z"
        stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" strokeLinejoin="round"
      />
      <line x1="54" y1="62" x2="50" y2="66" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const illustrations: Record<IllustrationType, () => React.JSX.Element> = {
  cart: CartIllustration,
  wishlist: WishlistIllustration,
  orders: OrdersIllustration,
  search: SearchIllustration,
  reviews: ReviewsIllustration,
}

export function EmptyState({
  icon: Icon = PackageOpen,
  illustration,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  const IllustrationComponent = illustration ? illustrations[illustration] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center px-4 py-16 text-center',
        className
      )}
    >
      {IllustrationComponent ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mb-6"
        >
          <IllustrationComponent />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mb-6 border border-[var(--border)] bg-[var(--muted)] p-5"
        >
          <Icon size={32} strokeWidth={1.5} className="text-[var(--accent)]" />
        </motion.div>
      )}
      <h3 className="heading-editorial mb-2 text-xl text-[var(--foreground)]">{title}</h3>
      {description && (
        <p className="mb-8 max-w-sm text-sm text-[var(--muted-foreground)]">{description}</p>
      )}
      {actionLabel && actionHref && (
        <a href={actionHref}>
          <Button variant="primary" size="md">
            {actionLabel}
          </Button>
        </a>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState

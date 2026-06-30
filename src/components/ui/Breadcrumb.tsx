import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1.5 text-sm">
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
              aria-label="Home"
            >
              <Home size={14} strokeWidth={1.5} />
            </Link>
            {items.length > 0 && (
              <ChevronRight size={14} strokeWidth={1.5} className="mx-1.5 text-[var(--border)]" />
            )}
          </li>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover-underline text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-[var(--foreground)]">{item.label}</span>
              )}
              {!isLast && (
                <ChevronRight size={14} strokeWidth={1.5} className="mx-1.5 text-[var(--border)]" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb

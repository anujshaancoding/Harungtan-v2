'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: LucideIcon
  iconRight?: LucideIcon
  children?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--foreground)] text-[var(--primary-foreground)] hover:bg-black active:bg-black focus-visible:ring-[var(--foreground)]',
  secondary:
    'bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--foreground)] hover:bg-[var(--muted)] active:bg-[var(--border)] focus-visible:ring-[var(--foreground)]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600',
  ghost:
    'bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] active:bg-[var(--border)] focus-visible:ring-[var(--foreground)]',
  link: 'bg-transparent text-[var(--foreground)] underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-[var(--foreground)]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[11px] gap-1.5 tracking-[0.05em] uppercase font-medium',
  md: 'h-11 px-6 text-[12px] gap-2 tracking-[0.05em] uppercase font-medium',
  lg: 'h-13 px-8 text-[13px] gap-2.5 tracking-[0.05em] uppercase font-semibold',
}

const iconSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 15,
  lg: 16,
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon: Icon,
      iconRight: IconRight,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          variant !== 'link' && sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={iconSizes[size]} className="animate-spin" strokeWidth={1.5} />
        ) : Icon ? (
          <Icon size={iconSizes[size]} strokeWidth={1.5} />
        ) : null}
        {children}
        {!loading && IconRight && <IconRight size={iconSizes[size]} strokeWidth={1.5} />}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

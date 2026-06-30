'use client'

import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, Search, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
  inputSize?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-8 text-xs px-3',
  md: 'h-10 text-sm px-4',
  lg: 'h-12 text-base px-4',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon: Icon,
      iconRight: IconRight,
      inputSize = 'md',
      type = 'text',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const isPassword = type === 'password'
    const isSearch = type === 'search'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

    const LeftIcon = isSearch ? Search : Icon

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="subheading mb-2 block text-[var(--muted-foreground)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--muted-foreground)]">
              <LeftIcon size={16} strokeWidth={1.5} />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              'w-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] transition-all',
              'placeholder:text-[var(--muted-foreground)]',
              'focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20',
              'disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)]',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-[var(--border)]',
              sizeStyles[inputSize],
              LeftIcon && 'pl-10',
              (isPassword || IconRight) && 'pr-10',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
            </button>
          )}
          {!isPassword && IconRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--muted-foreground)]">
              <IconRight size={16} strokeWidth={1.5} />
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

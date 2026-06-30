'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
  selectSize?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-8 text-xs px-3 pr-8',
  md: 'h-10 text-sm px-4 pr-10',
  lg: 'h-12 text-base px-4 pr-10',
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
      selectSize = 'md',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="subheading mb-2 block text-[var(--muted-foreground)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none border border-[var(--border)] bg-white text-[var(--foreground)] transition-colors',
              'focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20',
              'disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)]',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-[var(--border)]',
              sizeStyles[selectSize],
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--muted-foreground)]">
            <ChevronDown size={16} strokeWidth={1.5} />
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select

import Link from 'next/link'
import { cn } from '@/lib/utils'

const sizes = {
  xs: { icon: 'h-4 w-4', text: 'text-sm' },
  sm: { icon: 'h-5 w-5', text: 'text-lg' },
  md: { icon: 'h-6 w-6 sm:h-[30px] sm:w-[30px]', text: 'text-xl sm:text-2xl' },
  lg: { icon: 'h-8 w-8', text: 'text-3xl' },
  xl: { icon: 'h-10 w-10', text: 'text-4xl' },
} as const

type LogoSize = keyof typeof sizes

interface LogoProps {
  size?: LogoSize
  className?: string
  iconClassName?: string
  textClassName?: string
  showText?: boolean
  showIcon?: boolean
  href?: string | false
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-112 131 1414 1514"
      fill="currentColor"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <path d="M14.8 1014.63V434.74H245.12V1014.63ZM944.29 1594.52V434.74H1174.59V1594.52ZM14.8 1594.52V1362.57C14.8 1298.51 30.54 1240.24 62.02 1187.77 93.51 1135.31 135.48 1093.33 187.94 1061.85 240.41 1030.38 298.68 1014.63 362.74 1014.63H826.66V1246.59H362.74C330.71 1246.59 303.37 1257.91 280.73 1280.56 258.09 1303.2 246.77 1330.54 246.77 1362.57V1594.52Z" />
      <path d="M480.38 1340.66V528.82C480.38 496.79 468.78 469.45 445.59 446.8 422.39 424.16 394.77 412.84 362.74 412.84H14.8V180.88H362.74C426.8 180.88 485.07 196.63 537.54 228.1 590.01 259.58 631.98 301.55 663.46 354.02 694.94 406.49 710.68 464.76 710.68 528.82V1340.66ZM710.68 412.84V180.88H1174.59V412.84Z" />
    </svg>
  )
}

export default function Logo({
  size = 'md',
  className,
  iconClassName,
  textClassName,
  showText = true,
  showIcon = true,
  href = '/',
}: LogoProps) {
  const s = sizes[size]

  const content = (
    <>
      {showIcon && <LogoIcon className={cn(s.icon, iconClassName)} />}
      {showText && (
        <span className={cn('heading-editorial tracking-[0.02em]', s.text, textClassName)}>
          Harungtan
        </span>
      )}
    </>
  )

  const wrapperClass = cn('inline-flex items-center gap-2', className)

  if (href === false) {
    return <div className={wrapperClass}>{content}</div>
  }

  return (
    <Link href={href} className={wrapperClass}>
      {content}
    </Link>
  )
}

export { LogoIcon }

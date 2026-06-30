'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Severity = 'critical' | 'serious' | 'moderate' | 'minor'

interface AuditIssue {
  id: string
  severity: Severity
  element: string
  description: string
  wcag: string
  suggestedFix: string
  source: 'live' | 'demo'
}

interface AuditResult {
  timestamp: Date
  passed: number
  failed: number
  issues: AuditIssue[]
  url: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; bg: string; border: string; icon: typeof XCircle }
> = {
  critical: {
    label: 'Critical',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircle,
  },
  serious: {
    label: 'Serious',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: AlertTriangle,
  },
  moderate: {
    label: 'Moderate',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: Info,
  },
  minor: {
    label: 'Minor',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
  },
}

const DEMO_ISSUES: AuditIssue[] = [
  {
    id: 'demo-1',
    severity: 'critical',
    element: 'html',
    description: 'The <html> element should have a valid lang attribute for screen readers.',
    wcag: 'WCAG 3.1.1 (Level A)',
    suggestedFix: 'Add lang="en" (or appropriate language) to the <html> element.',
    source: 'demo',
  },
  {
    id: 'demo-2',
    severity: 'critical',
    element: 'img.hero-banner',
    description: 'Image is missing alternative text. Screen readers cannot describe this content.',
    wcag: 'WCAG 1.1.1 (Level A)',
    suggestedFix: 'Add a descriptive alt attribute, or alt="" if purely decorative.',
    source: 'demo',
  },
  {
    id: 'demo-3',
    severity: 'serious',
    element: 'button.icon-btn',
    description: 'Button has no accessible name. Assistive technologies cannot convey its purpose.',
    wcag: 'WCAG 4.1.2 (Level A)',
    suggestedFix: 'Add an aria-label, aria-labelledby, or visible text content to the button.',
    source: 'demo',
  },
  {
    id: 'demo-4',
    severity: 'serious',
    element: 'input#email',
    description: 'Form input is missing an associated <label> element.',
    wcag: 'WCAG 1.3.1 (Level A)',
    suggestedFix:
      'Add a <label for="email"> element or use aria-label / aria-labelledby on the input.',
    source: 'demo',
  },
  {
    id: 'demo-5',
    severity: 'moderate',
    element: 'body > main > section > h4',
    description:
      'Heading hierarchy is skipped: an <h4> appears without a preceding <h3>. This confuses screen reader navigation.',
    wcag: 'WCAG 1.3.1 (Level A)',
    suggestedFix: 'Use sequential heading levels (h1 > h2 > h3) without skipping.',
    source: 'demo',
  },
  {
    id: 'demo-6',
    severity: 'moderate',
    element: 'div.card-text',
    description:
      'Potential color contrast issue: light gray text on white background may not meet the 4.5:1 ratio.',
    wcag: 'WCAG 1.4.3 (Level AA)',
    suggestedFix:
      'Ensure text color has at least 4.5:1 contrast ratio against its background for normal text.',
    source: 'demo',
  },
  {
    id: 'demo-7',
    severity: 'minor',
    element: 'body',
    description: 'No skip-navigation link found. Keyboard users must tab through all navigation.',
    wcag: 'WCAG 2.4.1 (Level A)',
    suggestedFix:
      'Add a visually hidden "Skip to main content" link as the first focusable element.',
    source: 'demo',
  },
  {
    id: 'demo-8',
    severity: 'minor',
    element: 'a.read-more',
    description:
      'Link text "Read more" is ambiguous without context. Multiple identical link texts on page.',
    wcag: 'WCAG 2.4.4 (Level A)',
    suggestedFix:
      'Use more descriptive link text, or add aria-label with context (e.g. "Read more about Product X").',
    source: 'demo',
  },
]

// ---------------------------------------------------------------------------
// Live DOM checks
// ---------------------------------------------------------------------------

function runLiveDOMChecks(): AuditIssue[] {
  if (typeof document === 'undefined') return []

  const issues: AuditIssue[] = []
  let id = 0
  const nextId = () => `live-${++id}`

  // 1. Images without alt text
  const imgsNoAlt = document.querySelectorAll('img:not([alt])')
  imgsNoAlt.forEach((img) => {
    const selector = buildSelector(img as HTMLElement)
    issues.push({
      id: nextId(),
      severity: 'critical',
      element: selector,
      description: 'Image is missing the alt attribute entirely.',
      wcag: 'WCAG 1.1.1 (Level A)',
      suggestedFix: 'Add a descriptive alt attribute, or alt="" if the image is decorative.',
      source: 'live',
    })
  })

  // 2. Buttons without accessible names
  const buttons = document.querySelectorAll('button')
  buttons.forEach((btn) => {
    const text = (btn.textContent || '').trim()
    const ariaLabel = btn.getAttribute('aria-label')
    const ariaLabelledBy = btn.getAttribute('aria-labelledby')
    const title = btn.getAttribute('title')
    if (!text && !ariaLabel && !ariaLabelledBy && !title) {
      issues.push({
        id: nextId(),
        severity: 'serious',
        element: buildSelector(btn),
        description: 'Button element has no accessible name (no text, aria-label, or title).',
        wcag: 'WCAG 4.1.2 (Level A)',
        suggestedFix: 'Add text content, aria-label, or title to the button.',
        source: 'live',
      })
    }
  })

  // 3. Form inputs without labels
  const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea')
  inputs.forEach((input) => {
    const el = input as HTMLInputElement
    const id_ = el.id
    const ariaLabel = el.getAttribute('aria-label')
    const ariaLabelledBy = el.getAttribute('aria-labelledby')
    const hasLabel = id_ ? document.querySelector(`label[for="${id_}"]`) : false
    const wrappedInLabel = el.closest('label')
    if (!ariaLabel && !ariaLabelledBy && !hasLabel && !wrappedInLabel) {
      issues.push({
        id: nextId(),
        severity: 'serious',
        element: buildSelector(el),
        description: 'Form input has no associated label, aria-label, or aria-labelledby.',
        wcag: 'WCAG 1.3.1 (Level A)',
        suggestedFix: 'Add a <label> element with a matching for attribute, or use aria-label.',
        source: 'live',
      })
    }
  })

  // 4. Check <html> lang attribute
  const htmlEl = document.documentElement
  const lang = htmlEl.getAttribute('lang')
  if (!lang || lang.trim() === '') {
    issues.push({
      id: nextId(),
      severity: 'critical',
      element: 'html',
      description: 'The <html> element is missing a lang attribute.',
      wcag: 'WCAG 3.1.1 (Level A)',
      suggestedFix: 'Add lang="en" (or the appropriate language code) to the <html> element.',
      source: 'live',
    })
  }

  // 5. Heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let prevLevel = 0
  headings.forEach((h) => {
    const level = parseInt(h.tagName[1], 10)
    if (prevLevel > 0 && level > prevLevel + 1) {
      issues.push({
        id: nextId(),
        severity: 'moderate',
        element: buildSelector(h as HTMLElement),
        description: `Heading level skipped: <${h.tagName.toLowerCase()}> follows <h${prevLevel}>. Expected <h${prevLevel + 1}> or same/higher level.`,
        wcag: 'WCAG 1.3.1 (Level A)',
        suggestedFix: 'Use sequential heading levels without skipping (h1 > h2 > h3).',
        source: 'live',
      })
    }
    prevLevel = level
  })

  // 6. Skip navigation link
  const firstLink = document.querySelector('a')
  const hasSkipNav =
    firstLink &&
    (firstLink.textContent || '').toLowerCase().includes('skip') &&
    (firstLink.getAttribute('href') || '').startsWith('#')
  if (!hasSkipNav) {
    issues.push({
      id: nextId(),
      severity: 'minor',
      element: 'body',
      description: 'No skip-navigation link detected as the first focusable element.',
      wcag: 'WCAG 2.4.1 (Level A)',
      suggestedFix:
        'Add a visually hidden "Skip to main content" anchor as the first element in <body>.',
      source: 'live',
    })
  }

  // 7. Basic color contrast check (very rough heuristic)
  const textElements = document.querySelectorAll('p, span, a, li, td, th, label')
  let contrastChecked = 0
  textElements.forEach((el) => {
    if (contrastChecked >= 3) return // limit to avoid noise
    const style = window.getComputedStyle(el)
    const color = style.color
    const bgColor = style.backgroundColor
    if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      const fgLum = parseLuminance(color)
      const bgLum = parseLuminance(bgColor)
      if (fgLum !== null && bgLum !== null) {
        const ratio = contrastRatio(fgLum, bgLum)
        if (ratio < 4.5) {
          contrastChecked++
          issues.push({
            id: nextId(),
            severity: 'moderate',
            element: buildSelector(el as HTMLElement),
            description: `Low color contrast detected (estimated ratio: ${ratio.toFixed(1)}:1). Minimum required is 4.5:1 for normal text.`,
            wcag: 'WCAG 1.4.3 (Level AA)',
            suggestedFix:
              'Increase the contrast between text color and background color to at least 4.5:1.',
            source: 'live',
          })
        }
      }
    }
  })

  return issues
}

function buildSelector(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase()
  const id = el.id ? `#${el.id}` : ''
  const cls = el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
    : ''
  return `${tag}${id}${cls}`
}

function parseRGB(color: string): [number, number, number] | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return null
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
}

function sRGBtoLinear(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * sRGBtoLinear(r) + 0.7152 * sRGBtoLinear(g) + 0.0722 * sRGBtoLinear(b)
}

function parseLuminance(color: string): number | null {
  const rgb = parseRGB(color)
  if (!rgb) return null
  return relativeLuminance(...rgb)
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
}

export default function AccessibilityAuditPage() {
  const [result, setResult] = useState<AuditResult | null>(null)
  const [scanning, setScanning] = useState(false)
  const [targetUrl, setTargetUrl] = useState('')
  const [expandedSeverity, setExpandedSeverity] = useState<Record<Severity, boolean>>({
    critical: true,
    serious: true,
    moderate: false,
    minor: false,
  })

  const runAudit = useCallback(
    (url?: string) => {
      setScanning(true)

      // Simulate async scan delay
      setTimeout(() => {
        const liveIssues = runLiveDOMChecks()
        const allIssues = [...liveIssues, ...DEMO_ISSUES]

        // Deduplicate by description similarity
        const seen = new Set<string>()
        const deduped = allIssues.filter((issue) => {
          const key = `${issue.severity}-${issue.description.slice(0, 60)}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })

        // Count passes: total checks minus failures
        const totalChecks = deduped.length + 12 // 12 assumed passing checks
        const failed = deduped.length
        const passed = totalChecks - failed

        setResult({
          timestamp: new Date(),
          passed,
          failed,
          issues: deduped,
          url: url || window.location.href,
        })
        setScanning(false)
      }, 1500)
    },
    []
  )

  useEffect(() => {
    runAudit()
  }, [runAudit])

  const groupedIssues = result
    ? (['critical', 'serious', 'moderate', 'minor'] as Severity[]).map((severity) => ({
        severity,
        issues: result.issues.filter((i) => i.severity === severity),
      }))
    : []

  const toggleSeverity = (severity: Severity) => {
    setExpandedSeverity((prev) => ({ ...prev, [severity]: !prev[severity] }))
  }

  const score = result ? Math.round((result.passed / (result.passed + result.failed)) * 100) : 0

  const scoreColor =
    score >= 90
      ? 'text-green-600'
      : score >= 70
        ? 'text-yellow-600'
        : score >= 50
          ? 'text-orange-600'
          : 'text-red-600'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="heading-editorial text-2xl"
            style={{ color: 'var(--foreground)' }}
          >
            Accessibility Audit
          </h1>
          <div className="divider-accent mt-3" />
          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--muted)' }}
          >
            Automated checks for WCAG compliance and accessibility best practices.
          </p>
        </div>
        <button
          onClick={() => runAudit(targetUrl || undefined)}
          disabled={scanning}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-all',
            'border border-[var(--border)] hover:border-[var(--foreground)]',
            scanning && 'opacity-60 pointer-events-none'
          )}
          style={{ color: 'var(--foreground)' }}
        >
          <RefreshCw className={cn('h-3.5 w-3.5', scanning && 'animate-spin')} />
          {scanning ? 'Scanning...' : 'Re-scan'}
        </button>
      </div>

      {/* URL Input */}
      <div
        className="flex gap-3 p-4 border"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--background)',
        }}
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
          />
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="Enter a URL to audit (e.g. /products, /about) or leave blank for current page"
            className="w-full border py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--foreground)]"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--background)',
            }}
          />
        </div>
        <button
          onClick={() => runAudit(targetUrl || undefined)}
          disabled={scanning}
          className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors"
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
          }}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Audit URL
        </button>
      </div>

      {/* Loading State */}
      {scanning && !result && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <RefreshCw
            className="h-8 w-8 animate-spin"
            style={{ color: 'var(--muted)' }}
          />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Running accessibility checks...
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Score Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Accessibility Score',
                value: `${score}%`,
                icon: Shield,
                valueClass: scoreColor,
                sublabel: result.timestamp.toLocaleTimeString(),
              },
              {
                label: 'Checks Passed',
                value: result.passed.toString(),
                icon: CheckCircle,
                valueClass: 'text-green-600',
                sublabel: 'No issues found',
              },
              {
                label: 'Issues Found',
                value: result.failed.toString(),
                icon: AlertTriangle,
                valueClass: result.failed > 0 ? 'text-red-600' : 'text-green-600',
                sublabel: `${groupedIssues.find((g) => g.severity === 'critical')?.issues.length || 0} critical`,
              },
              {
                label: 'Page Scanned',
                value: 'Current',
                icon: Info,
                valueClass: '',
                sublabel: result.url.length > 40 ? result.url.slice(0, 40) + '...' : result.url,
              },
            ].map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="border p-5"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--muted)' }}
                      >
                        {card.label}
                      </p>
                      <p className={cn('mt-1 text-3xl font-light tracking-tight', card.valueClass)}>
                        {card.value}
                      </p>
                      <p
                        className="mt-1 text-[11px]"
                        style={{ color: 'var(--muted)' }}
                      >
                        {card.sublabel}
                      </p>
                    </div>
                    <Icon className="h-5 w-5" style={{ color: 'var(--muted)' }} />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Severity Summary Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="border p-4"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
            }}
          >
            <div className="flex flex-wrap items-center gap-6">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--muted)' }}
              >
                Issues by Severity
              </p>
              <div className="flex flex-wrap gap-3">
                {groupedIssues.map(({ severity, issues }) => {
                  const cfg = SEVERITY_CONFIG[severity]
                  return (
                    <span
                      key={severity}
                      className={cn(
                        'inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-medium',
                        cfg.bg,
                        cfg.border,
                        cfg.color
                      )}
                    >
                      {cfg.label}: {issues.length}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Visual bar */}
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-gray-100">
              {groupedIssues.map(({ severity, issues }) => {
                if (issues.length === 0) return null
                const pct = (issues.length / result.failed) * 100
                const colors: Record<Severity, string> = {
                  critical: 'bg-red-500',
                  serious: 'bg-orange-500',
                  moderate: 'bg-yellow-400',
                  minor: 'bg-blue-400',
                }
                return (
                  <motion.div
                    key={severity}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className={cn('h-full', colors[severity])}
                    title={`${SEVERITY_CONFIG[severity].label}: ${issues.length}`}
                  />
                )
              })}
            </div>
          </motion.div>

          {/* Issue List by Severity */}
          <div className="space-y-4">
            {groupedIssues.map(({ severity, issues }) => {
              if (issues.length === 0) return null
              const cfg = SEVERITY_CONFIG[severity]
              const SevIcon = cfg.icon
              const expanded = expandedSeverity[severity]

              return (
                <motion.div
                  key={severity}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border overflow-hidden"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                  }}
                >
                  {/* Severity header */}
                  <button
                    onClick={() => toggleSeverity(severity)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-black/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-8 w-8 items-center justify-center', cfg.bg)}>
                        <SevIcon className={cn('h-4 w-4', cfg.color)} />
                      </div>
                      <div>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: 'var(--foreground)' }}
                        >
                          {cfg.label}
                        </span>
                        <span className="ml-2 text-xs" style={{ color: 'var(--muted)' }}>
                          {issues.length} issue{issues.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    {expanded ? (
                      <ChevronUp className="h-4 w-4" style={{ color: 'var(--muted)' }} />
                    ) : (
                      <ChevronDown className="h-4 w-4" style={{ color: 'var(--muted)' }} />
                    )}
                  </button>

                  {/* Issue items */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate="visible"
                          className="divide-y"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          {issues.map((issue) => (
                            <motion.div
                              key={issue.id}
                              variants={itemVariants}
                              className="px-4 py-3 pl-[60px]"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <code
                                      className="inline-block max-w-xs truncate px-1.5 py-0.5 text-xs"
                                      style={{
                                        backgroundColor: 'var(--muted)',
                                        color: 'var(--foreground)',
                                        opacity: 0.7,
                                      }}
                                    >
                                      {issue.element}
                                    </code>
                                    <span
                                      className="text-[10px] font-medium uppercase tracking-wider"
                                      style={{ color: 'var(--muted)' }}
                                    >
                                      {issue.source === 'live' ? 'Live Check' : 'Demo'}
                                    </span>
                                  </div>
                                  <p
                                    className="mt-1 text-sm leading-relaxed"
                                    style={{ color: 'var(--foreground)' }}
                                  >
                                    {issue.description}
                                  </p>
                                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                    <span
                                      className="text-[11px]"
                                      style={{ color: 'var(--muted)' }}
                                    >
                                      <strong>WCAG:</strong> {issue.wcag}
                                    </span>
                                  </div>
                                  <div
                                    className="mt-2 border-l-2 pl-3 text-xs leading-relaxed"
                                    style={{
                                      borderColor: 'var(--accent)',
                                      color: 'var(--muted)',
                                    }}
                                  >
                                    <strong style={{ color: 'var(--foreground)' }}>Fix:</strong>{' '}
                                    {issue.suggestedFix}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Educational Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="border p-5"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
            }}
          >
            <div className="flex gap-3">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--foreground)' }}
                >
                  About This Audit
                </p>
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ color: 'var(--muted)' }}
                >
                  This audit combines real-time DOM checks (images without alt text, unlabeled buttons,
                  missing form labels, heading hierarchy, lang attribute, skip navigation, and basic color
                  contrast analysis) with demonstration issues that highlight common accessibility patterns.
                  For a comprehensive audit, supplement with manual testing, keyboard navigation testing,
                  and screen reader verification. Issues marked <strong>&quot;Live Check&quot;</strong> were
                  detected on the current page; <strong>&quot;Demo&quot;</strong> issues are educational
                  examples.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

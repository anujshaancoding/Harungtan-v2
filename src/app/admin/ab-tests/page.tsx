'use client'

import { useState, useEffect, useCallback } from 'react'
import { FlaskConical, Plus, ToggleLeft, ToggleRight, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Variant {
  views: number
  clicks: number
  conversions: number
}

interface ABTest {
  id: string
  name: string
  description: string | null
  active: boolean
  trafficPercent: number
  variantA: Variant
  variantB: Variant
  createdAt: string
}

function ctr(variant: Variant): string {
  if (variant.views === 0) return '0.0%'
  return ((variant.clicks / variant.views) * 100).toFixed(1) + '%'
}

function convRate(variant: Variant): string {
  if (variant.views === 0) return '0.0%'
  return ((variant.conversions / variant.views) * 100).toFixed(1) + '%'
}

export default function ABTestsPage() {
  const [tests, setTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formTraffic, setFormTraffic] = useState(50)

  const fetchTests = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ab-tests')
      if (res.ok) {
        const data = await res.json()
        setTests(data.tests ?? data ?? [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  function openCreateModal() {
    setFormName('')
    setFormDescription('')
    setFormTraffic(50)
    setShowModal(true)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim() || null,
          trafficPercent: formTraffic,
        }),
      })
      if (res.ok) {
        setShowModal(false)
        await fetchTests()
      }
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(test: ABTest) {
    setToggling(test.id)
    try {
      const res = await fetch('/api/admin/ab-tests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: test.id, active: !test.active }),
      })
      if (res.ok) {
        setTests((prev) =>
          prev.map((t) => (t.id === test.id ? { ...t, active: !t.active } : t))
        )
      }
    } catch {
      // silent
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <FlaskConical size={22} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
            <h1
              className="heading-editorial text-2xl"
              style={{ color: 'var(--foreground)' }}
            >
              A/B Tests
            </h1>
          </div>
          <div className="divider-accent mt-3" />
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors"
          style={{ backgroundColor: 'var(--foreground)' }}
        >
          <Plus size={14} strokeWidth={2} />
          Create Test
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse"
              style={{ backgroundColor: 'var(--muted)' }}
            />
          ))}
        </div>
      ) : tests.length === 0 ? (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center border py-20"
          style={{ borderColor: 'var(--border)', backgroundColor: 'white' }}
        >
          <FlaskConical size={40} strokeWidth={1} style={{ color: 'var(--muted)' }} />
          <p
            className="mt-4 text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            No A/B tests yet. Create your first test to get started.
          </p>
        </div>
      ) : (
        /* Tests list */
        <div className="space-y-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="border bg-white"
              style={{ borderColor: test.active ? 'var(--accent)' : 'var(--border)' }}
            >
              {/* Test header */}
              <div
                className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <BarChart3
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: test.active ? 'var(--accent)' : 'var(--muted)' }}
                  />
                  <div>
                    <h2
                      className="text-sm font-semibold tracking-wide"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {test.name}
                    </h2>
                    {test.description && (
                      <p
                        className="mt-0.5 text-xs"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {test.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Traffic: {test.trafficPercent}%
                  </span>

                  <span
                    className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
                    style={{
                      backgroundColor: test.active ? 'var(--accent)' : 'var(--muted)',
                      color: test.active ? 'white' : 'var(--muted-foreground)',
                    }}
                  >
                    {test.active ? 'Active' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => toggleActive(test)}
                    disabled={toggling === test.id}
                    className="transition-colors hover:opacity-70 disabled:opacity-40"
                    title={test.active ? 'Deactivate test' : 'Activate test'}
                  >
                    {test.active ? (
                      <ToggleRight
                        size={24}
                        strokeWidth={1.5}
                        style={{ color: 'var(--accent)' }}
                      />
                    ) : (
                      <ToggleLeft
                        size={24}
                        strokeWidth={1.5}
                        style={{ color: 'var(--muted)' }}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Variant results */}
              <div className="grid gap-0 sm:grid-cols-2">
                {(['A', 'B'] as const).map((label) => {
                  const variant = label === 'A' ? test.variantA : test.variantB
                  return (
                    <div
                      key={label}
                      className={`px-6 py-5 ${label === 'A' ? 'sm:border-r' : ''}`}
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <p
                        className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        Variant {label}
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <p
                            className="text-[10px] uppercase tracking-wider"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            Views
                          </p>
                          <p
                            className="mt-1 text-lg font-semibold tabular-nums"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {variant.views.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] uppercase tracking-wider"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            Clicks
                          </p>
                          <p
                            className="mt-1 text-lg font-semibold tabular-nums"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {variant.clicks.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] uppercase tracking-wider"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            Conv.
                          </p>
                          <p
                            className="mt-1 text-lg font-semibold tabular-nums"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {variant.conversions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] uppercase tracking-wider"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            CTR
                          </p>
                          <p
                            className="mt-1 text-lg font-semibold tabular-nums"
                            style={{ color: 'var(--accent)' }}
                          >
                            {ctr(variant)}
                          </p>
                          <p
                            className="text-[9px] uppercase tracking-wider"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            Conv: {convRate(variant)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Test Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => !saving && setShowModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full max-w-md border bg-white p-8"
                style={{ borderColor: 'var(--border)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-center gap-3">
                  <FlaskConical
                    size={20}
                    strokeWidth={1.5}
                    style={{ color: 'var(--accent)' }}
                  />
                  <h2
                    className="heading-editorial text-lg"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Create A/B Test
                  </h2>
                </div>

                <form onSubmit={handleCreate} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Test Name
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      placeholder="e.g. Homepage Hero Banner"
                      className="w-full border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--foreground)]"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--background)',
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Description
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows={3}
                      placeholder="Describe what this test is measuring..."
                      className="w-full resize-none border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--foreground)]"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--background)',
                      }}
                    />
                  </div>

                  {/* Traffic Slider */}
                  <div>
                    <label
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Traffic Split: {formTraffic}% / {100 - formTraffic}%
                    </label>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--accent)' }}
                      >
                        A
                      </span>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        step={5}
                        value={formTraffic}
                        onChange={(e) => setFormTraffic(Number(e.target.value))}
                        className="flex-1 accent-[var(--foreground)]"
                      />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--accent)' }}
                      >
                        B
                      </span>
                    </div>
                    <div className="mt-2 flex gap-1" style={{ height: '4px' }}>
                      <div
                        className="transition-all"
                        style={{
                          width: `${formTraffic}%`,
                          backgroundColor: 'var(--foreground)',
                        }}
                      />
                      <div
                        className="transition-all"
                        style={{
                          width: `${100 - formTraffic}%`,
                          backgroundColor: 'var(--muted)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={saving}
                      className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest border transition-colors hover:border-[var(--foreground)]"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !formName.trim()}
                      className="px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white transition-opacity disabled:opacity-40"
                      style={{ backgroundColor: 'var(--foreground)' }}
                    >
                      {saving ? 'Creating...' : 'Create Test'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Zap, Plus, Clock, Percent, X, ToggleLeft, ToggleRight, Tag, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlashSaleProduct {
  id: string
  name: string
  slug: string
}

interface FlashSale {
  id: string
  title: string
  discount: number
  startsAt: string
  endsAt: string
  category: string | null
  productId: string | null
  active: boolean
  product: FlashSaleProduct | null
}

interface ProductOption {
  id: string
  name: string
}

const emptyForm = {
  title: '',
  discount: '',
  startsAt: '',
  endsAt: '',
  productId: '',
  category: '',
  active: true,
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getSaleStatus(sale: FlashSale): { label: string; color: string } {
  const now = new Date()
  const start = new Date(sale.startsAt)
  const end = new Date(sale.endsAt)

  if (!sale.active) {
    return { label: 'Inactive', color: 'bg-gray-100 text-gray-600' }
  }
  if (now < start) {
    return { label: 'Scheduled', color: 'bg-blue-100 text-blue-700' }
  }
  if (now > end) {
    return { label: 'Expired', color: 'bg-red-100 text-red-700' }
  }
  return { label: 'Live', color: 'bg-green-100 text-green-700' }
}

export default function FlashSalesPage() {
  const [sales, setSales] = useState<FlashSale[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const fetchSales = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/flash-sales')
      const data = await res.json()
      setSales(data.flashSales || [])
    } catch (err) {
      console.error('Failed to fetch flash sales:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setProducts(
        (data.products || []).map((p: { id: string; name: string }) => ({
          id: p.id,
          name: p.name,
        }))
      )
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }, [])

  useEffect(() => {
    fetchSales()
    fetchProducts()
  }, [fetchSales, fetchProducts])

  function openModal() {
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setError('')
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.title || !form.discount || !form.startsAt || !form.endsAt) {
      setError('Please fill in all required fields.')
      return
    }

    const discount = parseFloat(form.discount)
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      setError('Discount must be between 1 and 100.')
      return
    }

    if (new Date(form.endsAt) <= new Date(form.startsAt)) {
      setError('End date must be after start date.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/flash-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          discount,
          startsAt: new Date(form.startsAt).toISOString(),
          endsAt: new Date(form.endsAt).toISOString(),
          productId: form.productId || null,
          category: form.category || null,
          active: form.active,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create flash sale.')
        return
      }

      await fetchSales()
      closeModal()
    } catch (err) {
      console.error('Failed to create flash sale:', err)
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(sale: FlashSale) {
    try {
      await fetch('/api/admin/flash-sales', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sale.id, active: !sale.active }),
      })
      await fetchSales()
    } catch (err) {
      console.error('Failed to toggle flash sale:', err)
    }
  }

  const liveSales = sales.filter((s) => {
    const now = new Date()
    return s.active && new Date(s.startsAt) <= now && new Date(s.endsAt) >= now
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-[var(--accent)]" />
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">Flash Sales</h1>
          </div>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Create and manage time-limited discount campaigns.
            {liveSales.length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                {liveSales.length} live now
              </span>
            )}
          </p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <Plus size={16} />
          Create Sale
        </button>
      </div>

      {/* Sales Grid */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-[var(--muted-foreground)]">
          Loading...
        </div>
      ) : sales.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-white"
        >
          <Zap size={36} className="mb-3 text-[var(--muted-foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">
            No flash sales yet. Create your first campaign.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {sales.map((sale, index) => {
              const status = getSaleStatus(sale)
              return (
                <motion.div
                  key={sale.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${
                    sale.active ? 'border-[var(--border)]' : 'border-[var(--border)] opacity-60'
                  }`}
                >
                  {/* Title + Status */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[var(--foreground)] leading-tight">
                      {sale.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10">
                      <Percent size={18} className="text-[var(--accent)]" />
                    </div>
                    <span className="text-2xl font-bold text-[var(--foreground)]">
                      {sale.discount}%
                    </span>
                    <span className="text-sm text-[var(--muted-foreground)]">off</span>
                  </div>

                  {/* Dates */}
                  <div className="mb-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <Clock size={13} />
                      <span>Start: {formatDate(sale.startsAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <Clock size={13} />
                      <span>End: {formatDate(sale.endsAt)}</span>
                    </div>
                  </div>

                  {/* Product / Category */}
                  {(sale.product || sale.category) && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {sale.product && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--foreground)]">
                          <Package size={10} />
                          {sale.product.name}
                        </span>
                      )}
                      {sale.category && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--foreground)]">
                          <Tag size={10} />
                          {sale.category}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Toggle Active */}
                  <div className="border-t border-[var(--border)] pt-3">
                    <button
                      onClick={() => toggleActive(sale)}
                      className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {sale.active ? (
                        <ToggleRight size={20} className="text-green-600" />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                      {sale.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal()
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg rounded-xl bg-[var(--background)] p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-[var(--accent)]" />
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    Create Flash Sale
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Summer Blowout Sale"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Discount % *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={form.discount}
                      onChange={(e) => setForm({ ...form, discount: e.target.value })}
                      placeholder="e.g. 25"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 pr-10 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                    <Percent
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={form.startsAt}
                      onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={form.endsAt}
                      onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                  </div>
                </div>

                {/* Product (optional) */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Product <span className="font-normal text-[var(--muted-foreground)]">(optional)</span>
                  </label>
                  <select
                    value={form.productId}
                    onChange={(e) => setForm({ ...form, productId: e.target.value })}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  >
                    <option value="">All products</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category (optional) */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                    Category <span className="font-normal text-[var(--muted-foreground)]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. t-shirts, hoodies"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? 'Creating...' : 'Create Sale'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

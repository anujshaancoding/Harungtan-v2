'use client'

import { useState, useEffect } from 'react'
import { Search, Tag, Download, Users, ShoppingBag, Star } from 'lucide-react'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'

interface Customer {
  id: string
  name: string | null
  email: string
  phone: string | null
  createdAt: string
  tags: { id: string; name: string; color: string }[]
  orderCount: number
  reviewCount: number
  totalSpent: number
  lastOrderDate: string | null
}

interface TagInfo {
  id: string
  name: string
  color: string
  userCount: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [tags, setTags] = useState<TagInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchCustomers()
    fetchTags()
  }, [search, activeTag])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (activeTag) params.set('tag', activeTag)

      const res = await fetch(`/api/admin/customers?${params}`)
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.customers || [])
        setTotal(data.total || 0)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/admin/tags')
      if (res.ok) {
        const data = await res.json()
        setTags(data.tags || [])
      }
    } catch {
      // silent
    }
  }

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Tags', 'Joined'].join(','),
      ...customers.map((c) => [
        c.name || '',
        c.email,
        c.phone || '',
        c.orderCount,
        c.totalSpent,
        c.tags.map((t) => t.name).join('; '),
        c.createdAt.split('T')[0],
      ].join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast.success('Customer data exported')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-editorial text-2xl" style={{ color: 'var(--foreground)' }}>Customers</h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--muted-foreground)' }}>
            {total} total customers
          </p>
          <div className="divider-accent mt-3" />
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 border px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors hover:bg-[var(--foreground)] hover:text-[var(--background)]"
          style={{ borderColor: 'var(--foreground)', color: 'var(--foreground)' }}
        >
          <Download size={14} strokeWidth={1.5} />
          Export CSV
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full border py-2.5 pl-9 pr-3 text-[13px] focus:border-[var(--foreground)] focus:outline-none"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTag('')}
            className={cn(
              'shrink-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors',
              !activeTag
                ? 'bg-[var(--foreground)] text-white'
                : 'border border-[var(--border)] text-[var(--muted-foreground)]'
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.name)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors',
                activeTag === tag.name
                  ? 'bg-[var(--foreground)] text-white'
                  : 'border border-[var(--border)] text-[var(--muted-foreground)]'
              )}
            >
              <span className="inline-block h-2 w-2" style={{ backgroundColor: tag.color }} />
              {tag.name} ({tag.userCount})
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="py-12 text-center">
          <Users size={40} strokeWidth={1} className="mx-auto mb-3" style={{ color: 'var(--border)' }} />
          <p className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>No customers found</p>
        </div>
      ) : (
        <div className="overflow-x-auto border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)' }}>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Customer</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Orders</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Spent</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Tags</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {customers.map((customer) => (
                <tr key={customer.id} className="transition-colors hover:bg-[var(--muted)]">
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{customer.name || 'Anonymous'}</p>
                    <p style={{ color: 'var(--muted-foreground)' }}>{customer.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ShoppingBag size={12} strokeWidth={1.5} style={{ color: 'var(--muted-foreground)' }} />
                      <span style={{ color: 'var(--foreground)' }}>{customer.orderCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>
                    {formatDate(customer.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

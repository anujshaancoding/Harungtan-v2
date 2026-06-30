'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import dynamic from 'next/dynamic'

const RevenueChart = dynamic(() => import('@/components/admin/charts/RevenueChart').then(m => ({ default: m.RevenueChart })), { ssr: false })
const TopProductsChart = dynamic(() => import('@/components/admin/charts/TopProducts').then(m => ({ default: m.TopProductsChart })), { ssr: false })

interface AnalyticsData {
  summary: {
    totalRevenue: number
    totalOrders: number
    avgOrderValue: number
    totalCustomers: number
  }
  revenueData: { date: string; revenue: number; orders: number }[]
  topProducts: { name: string; slug: string; quantity: number; revenue: number }[]
  statusBreakdown: Record<string, number>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30d')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/analytics?range=${range}`)
        if (res.ok) {
          setData(await res.json())
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [range])

  const statCards = data ? [
    { label: 'Total Revenue', value: formatPrice(data.summary.totalRevenue), icon: DollarSign, accent: true },
    { label: 'Total Orders', value: data.summary.totalOrders.toString(), icon: ShoppingBag },
    { label: 'Avg. Order Value', value: formatPrice(data.summary.avgOrderValue), icon: TrendingUp },
    { label: 'Customers', value: data.summary.totalCustomers.toString(), icon: Users },
  ] : []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-editorial text-2xl" style={{ color: 'var(--foreground)' }}>Analytics</h1>
          <div className="divider-accent mt-3" />
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors',
                range === r
                  ? 'bg-[var(--foreground)] text-white'
                  : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]'
              )}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          ))}
        </div>
      ) : data ? (
        <>
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="border p-6"
                style={{
                  borderColor: stat.accent ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: 'white',
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="subheading text-[var(--muted-foreground)]">{stat.label}</p>
                  <stat.icon
                    size={18}
                    strokeWidth={1.5}
                    style={{ color: stat.accent ? 'var(--accent)' : 'var(--muted-foreground)' }}
                  />
                </div>
                <p
                  className="mt-2 text-2xl font-semibold tracking-wide"
                  style={{ color: 'var(--foreground)' }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border bg-white p-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="heading-editorial text-lg mb-4" style={{ color: 'var(--foreground)' }}>
                Revenue Overview
              </h3>
              <RevenueChart data={data.revenueData} />
            </div>

            <div className="border bg-white p-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="heading-editorial text-lg mb-4" style={{ color: 'var(--foreground)' }}>
                Top Products
              </h3>
              <TopProductsChart data={data.topProducts} />
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="border bg-white p-6" style={{ borderColor: 'var(--border)' }}>
            <h3 className="heading-editorial text-lg mb-4" style={{ color: 'var(--foreground)' }}>
              Order Status Distribution
            </h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(data.statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3" style={{
                    backgroundColor: status === 'delivered' ? '#059669'
                      : status === 'shipped' ? '#7C3AED'
                      : status === 'processing' ? '#2563EB'
                      : status === 'cancelled' ? '#DC2626'
                      : '#D97706',
                  }} />
                  <span className="text-[12px] capitalize" style={{ color: 'var(--foreground)' }}>
                    {status}: <strong>{count}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

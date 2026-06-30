'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '@/lib/utils'

interface TopProductsChartProps {
  data: { name: string; slug: string; quantity: number; revenue: number }[]
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-[12px] tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          No product data for this period
        </p>
      </div>
    )
  }

  const chartData = data.slice(0, 8).map((p) => ({
    name: p.name.length > 20 ? p.name.slice(0, 20) + '...' : p.name,
    revenue: p.revenue,
    quantity: p.quantity,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis
          type="number"
          fontSize={10}
          stroke="var(--muted-foreground)"
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
        />
        <YAxis
          dataKey="name"
          type="category"
          fontSize={10}
          stroke="var(--muted-foreground)"
          tickLine={false}
          width={120}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            fontSize: 12,
          }}
          formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
        />
        <Bar dataKey="revenue" fill="var(--accent)" radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

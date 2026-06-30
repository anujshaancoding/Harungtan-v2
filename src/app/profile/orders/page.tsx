'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Package,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Truck,
} from 'lucide-react'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/utils'
import type { Order } from '@/types'
import EmptyState from '@/components/ui/EmptyState'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'

function StatusBadge({ status }: { status: string }) {
  const statusInfo =
    ORDER_STATUSES[status as keyof typeof ORDER_STATUSES] || ORDER_STATUSES.pending

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border border-blue-200',
    shipped: 'bg-violet-50 text-violet-700 border border-violet-200',
    delivered: 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20',
    cancelled: 'bg-neutral-100 text-[var(--muted-foreground)] border border-[var(--border)]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-wider',
        statusStyles[status] || statusStyles.pending
      )}
    >
      {statusInfo.label}
    </span>
  )
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="border border-[var(--border)] bg-white transition-all hover:shadow-sm hover:border-[var(--foreground)]/20">
      {/* Order Header */}
      <div className="flex w-full items-center justify-between p-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-3 text-left"
        >
          <div>
            <p className="subheading text-[var(--muted-foreground)] mb-1">
              Order
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)] tracking-wide">
              #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div>
            <p className="subheading text-[var(--muted-foreground)] mb-1">
              Date
            </p>
            <p className="text-sm text-[var(--foreground)]">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="subheading text-[var(--muted-foreground)] mb-1">
              Total
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {formatPrice(order.total)}
            </p>
          </div>
          <div>
            <p className="subheading text-[var(--muted-foreground)] mb-1">
              Items
            </p>
            <p className="text-sm text-[var(--foreground)]">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </button>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <Link
            href={`/profile/orders/${order.id}`}
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">View Details</span>
          </Link>
          {expanded ? (
            <ChevronUp size={18} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
          ) : (
            <ChevronDown size={18} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
          )}
        </div>
      </div>

      {/* Order Details */}
      {expanded && (
        <div className="border-t border-[var(--border)]">
          {/* Items */}
          <div className="divide-y divide-[var(--border)]">
            {order.items.map((item) => {
              const images = (() => {
                try {
                  return JSON.parse(item.product.images)
                } catch {
                  return ['/placeholder.png']
                }
              })()

              return (
                <div key={item.id} className="flex items-center gap-4 p-6">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[var(--muted)]">
                    <Image
                      src={images[0] || '/placeholder.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-medium text-[var(--foreground)] hover-underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      Size: {item.size} &middot; Color: {item.color} &middot;
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="border-t border-[var(--border)] bg-[var(--muted)] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5 text-sm">
                <p className="text-[var(--muted-foreground)]">
                  Payment:{' '}
                  <span className="text-[var(--foreground)]">
                    {order.paymentMethod || 'N/A'}
                  </span>
                </p>
                {order.trackingNumber && (
                  <p className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                    <Truck size={14} strokeWidth={1.5} />
                    Tracking:{' '}
                    <span className="font-mono text-[var(--foreground)]">
                      {order.trackingNumber}
                    </span>
                  </p>
                )}
              </div>
              <div className="space-y-1.5 text-right text-sm">
                <p className="text-[var(--muted-foreground)]">
                  Subtotal: {formatPrice(order.subtotal)}
                </p>
                <p className="text-[var(--muted-foreground)]">
                  Shipping: {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                </p>
                {order.discount > 0 && (
                  <p className="text-green-600">
                    Discount: -{formatPrice(order.discount)}
                  </p>
                )}
                <p className="font-semibold text-[var(--foreground)]">
                  Total: {formatPrice(order.total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status === filter)

  const filterOptions = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse bg-[var(--muted)]"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageBreadcrumb className="mb-2" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="heading-editorial text-2xl text-[var(--foreground)]">Order History</h2>
          <div className="divider-accent mt-3" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                'shrink-0 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors',
                filter === option.value
                  ? 'bg-[var(--foreground)] text-white'
                  : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will appear here. Start shopping to find something you love."
          actionLabel="Start Shopping"
          actionHref="/shop"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

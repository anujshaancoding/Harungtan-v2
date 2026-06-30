'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Truck,
  CreditCard,
  MapPin,
  Download,
  Copy,
} from 'lucide-react'
import { cn, formatPrice, formatDate, ORDER_STATUSES } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import OrderTimeline from '@/components/orders/OrderTimeline'
import type { Order } from '@/types'

function StatusBadge({ status }: { status: string }) {
  const statusInfo =
    ORDER_STATUSES[status as keyof typeof ORDER_STATUSES] || ORDER_STATUSES.pending

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
    processing: 'bg-blue-50 text-blue-700 border border-blue-200',
    shipped: 'bg-violet-50 text-violet-700 border border-violet-200',
    delivered: 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20',
    cancelled: 'bg-neutral-100 text-[var(--muted-foreground)] border border-[var(--border)]',
    returned: 'bg-neutral-100 text-[var(--muted-foreground)] border border-[var(--border)]',
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

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-[var(--muted)]', className)} />
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-5 w-32" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}

interface ParsedAddress {
  name?: string
  phone?: string
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

function parseAddress(addressStr: string): ParsedAddress {
  try {
    return JSON.parse(addressStr)
  } catch {
    return { street: addressStr }
  }
}

function formatAddress(addr: ParsedAddress): string {
  const parts = [
    addr.street,
    addr.city,
    addr.state && addr.zipCode ? `${addr.state} ${addr.zipCode}` : addr.state || addr.zipCode,
    addr.country,
  ].filter(Boolean)
  return parts.join(', ')
}

export default function OrderDetailClient() {
  const params = useParams()
  const id = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Failed to load order')
          return
        }
        const data = await res.json()
        // Parse statusHistory if it's a string
        const statusHistory =
          typeof data.statusHistory === 'string'
            ? JSON.parse(data.statusHistory)
            : data.statusHistory || []
        setOrder({ ...data, statusHistory })
      } catch {
        setError('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchOrder()
  }, [id])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Orders
        </Link>
        <div className="border border-[var(--border)] p-12 text-center">
          <p className="text-[var(--muted-foreground)]">
            {error || 'Order not found'}
          </p>
        </div>
      </div>
    )
  }

  const shippingAddr = parseAddress(order.shippingAddress)
  const billingAddr = order.billingAddress
    ? parseAddress(order.billingAddress)
    : null

  const paymentStatusStyles: Record<string, string> = {
    paid: 'text-green-700',
    pending: 'text-amber-700',
    failed: 'text-red-700',
    refunded: 'text-blue-700',
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/profile/orders"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="heading-editorial text-2xl text-[var(--foreground)]">
            Order #{id.slice(-8).toUpperCase()}
          </h2>
          <div className="divider-accent mt-3" />
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <button
            onClick={() => {
              showToast.info('Invoice download will be available soon')
            }}
            className="inline-flex items-center gap-1.5 border border-[var(--border)] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
          >
            <Download size={14} strokeWidth={1.5} />
            Invoice
          </button>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="border border-[var(--border)] bg-white p-6">
        <OrderTimeline
          statusHistory={order.statusHistory}
          currentStatus={order.status}
        />
        {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            Estimated delivery:{' '}
            <span className="font-medium text-[var(--foreground)]">
              {formatDate(order.estimatedDelivery)}
            </span>
          </p>
        )}
      </div>

      {/* Main Content: Items + Summary */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Items */}
        <div className="lg:col-span-2 space-y-0">
          <div className="border border-[var(--border)] bg-white">
            <div className="border-b border-[var(--border)] px-6 py-4">
              <h3 className="subheading text-[var(--muted-foreground)]">
                Items ({order.items.length})
              </h3>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {order.items.map((item) => {
                const images = (() => {
                  try {
                    return typeof item.product.images === 'string'
                      ? JSON.parse(item.product.images)
                      : item.product.images
                  } catch {
                    return ['/placeholder.png']
                  }
                })()

                return (
                  <div key={item.id} className="flex items-center gap-4 p-6">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[var(--muted)]">
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
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        Size: {item.size} &middot; Color: {item.color}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        Qty: {item.quantity} &times; {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Summary + Address + Payment */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="border border-[var(--border)] bg-white">
            <div className="border-b border-[var(--border)] px-6 py-4">
              <h3 className="subheading text-[var(--muted-foreground)]">
                Order Summary
              </h3>
            </div>
            <div className="space-y-3 p-6 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span className="text-[var(--foreground)]">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Shipping</span>
                <span className="text-[var(--foreground)]">
                  {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Discount</span>
                  <span className="text-green-600">
                    -{formatPrice(order.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Tax</span>
                <span className="text-[var(--foreground)]">
                  {formatPrice(order.tax)}
                </span>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-[var(--foreground)]">Total</span>
                  <span className="text-[var(--foreground)]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border border-[var(--border)] bg-white">
            <div className="border-b border-[var(--border)] px-6 py-4">
              <h3 className="subheading text-[var(--muted-foreground)] flex items-center gap-2">
                <MapPin size={14} strokeWidth={1.5} />
                Shipping Address
              </h3>
            </div>
            <div className="p-6 text-sm text-[var(--foreground)] space-y-1">
              {shippingAddr.name && (
                <p className="font-medium">{shippingAddr.name}</p>
              )}
              {shippingAddr.phone && (
                <p className="text-[var(--muted-foreground)]">
                  {shippingAddr.phone}
                </p>
              )}
              <p>{formatAddress(shippingAddr)}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border border-[var(--border)] bg-white">
            <div className="border-b border-[var(--border)] px-6 py-4">
              <h3 className="subheading text-[var(--muted-foreground)] flex items-center gap-2">
                <CreditCard size={14} strokeWidth={1.5} />
                Payment
              </h3>
            </div>
            <div className="p-6 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Method</span>
                <span className="text-[var(--foreground)]">
                  {order.paymentMethod || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-foreground)]">Status</span>
                <span
                  className={cn(
                    'font-medium capitalize',
                    paymentStatusStyles[order.paymentStatus] ||
                      'text-[var(--foreground)]'
                  )}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div className="border border-[var(--border)] bg-white">
              <div className="border-b border-[var(--border)] px-6 py-4">
                <h3 className="subheading text-[var(--muted-foreground)] flex items-center gap-2">
                  <Truck size={14} strokeWidth={1.5} />
                  Tracking
                </h3>
              </div>
              <div className="flex items-center justify-between p-6">
                <span className="font-mono text-sm text-[var(--foreground)]">
                  {order.trackingNumber}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(order.trackingNumber!)
                    showToast.success('Tracking number copied')
                  }}
                  className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  title="Copy tracking number"
                >
                  <Copy size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

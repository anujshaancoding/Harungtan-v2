'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import Confetti from '@/components/Confetti'

interface OrderDetails {
  orderId: string
  total: number
  itemCount: number
  email: string
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore((state) => state.clearCart)

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Clear cart on mount
    clearCart()

    // Verify checkout session
    async function verifySession() {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(
          `/api/checkout/verify?session_id=${sessionId}`
        )
        const json = await res.json()

        if (res.ok && json.order) {
          setOrder(json.order)
          setVerified(true)
        } else {
          setError(json.message || 'Could not verify order')
        }
      } catch {
        setError('Failed to verify order')
      } finally {
        setLoading(false)
      }
    }

    verifySession()
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin border-[1.5px] border-[var(--border)] border-t-[var(--foreground)]" />
          <p className="subheading text-[var(--muted-foreground)]">Verifying your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      {verified && <Confetti />}
      <div className="text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-[1.5px] border-green-700 bg-green-50">
          <CheckCircle size={40} strokeWidth={1.5} className="text-green-700" />
        </div>

        <h1 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl">
          Thank you for your order!
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">
          Your order has been placed successfully. We&apos;ll send you a
          confirmation email shortly.
        </p>

        {/* Order details card */}
        {(order || !error) && (
          <div className="mt-10 border border-[var(--border)] bg-[var(--muted)] p-6 text-left sm:p-8">
            <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
              <div className="flex h-10 w-10 items-center justify-center bg-[var(--foreground)]">
                <Package size={18} strokeWidth={1.5} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Order Confirmed
                </p>
                {order?.orderId && (
                  <p className="subheading text-[var(--muted-foreground)]">
                    Order #{order.orderId}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {order?.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Confirmation sent to</span>
                  <span className="font-medium text-[var(--foreground)]">{order.email}</span>
                </div>
              )}
              {order?.itemCount && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Items ordered</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {order.itemCount}
                  </span>
                </div>
              )}
              {order?.total && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Total paid</span>
                  <span className="heading-editorial text-[var(--foreground)]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-10 border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            {error}. If you were charged, your order is still being processed.
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {order?.orderId && (
            <Link href={`/profile/orders/${order.orderId}`}>
              <Button variant="secondary" size="lg" icon={Package}>
                View Order
              </Button>
            </Link>
          )}
          <Link href="/products">
            <Button size="lg" className="btn-accent" iconRight={ArrowRight}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin border-[1.5px] border-[var(--border)] border-t-[var(--foreground)]" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  )
}

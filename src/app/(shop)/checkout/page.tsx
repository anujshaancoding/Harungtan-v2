'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  MapPin,
  CreditCard,
  ClipboardList,
  Tag,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Lock,
  ShoppingBag,
} from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { cn, formatPrice } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AddressSelector, type AddressFormData } from '@/components/checkout/AddressSelector'
import { PageBreadcrumb } from '@/components/layout/PageBreadcrumb'
import { CouponDiscovery } from '@/components/checkout/CouponDiscovery'
import Image from 'next/image'

const steps = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Review', icon: ClipboardList },
  { id: 3, label: 'Payment', icon: CreditCard },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, total } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponApplied, setCouponApplied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [address, setAddress] = useState<AddressFormData | null>(null)

  const subtotal = total()
  const shipping = subtotal >= 999 ? 0 : 99
  const discount = couponDiscount
  const orderTotal = subtotal + shipping - discount

  // Address form is now handled by AddressSelector component

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
    }
  }, [status, router])

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && status !== 'loading') {
      router.push('/cart')
    }
  }, [items, status, router])

  const onAddressSelect = (data: AddressFormData) => {
    setAddress(data)
    setCurrentStep(2)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponError(null)

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      })
      const json = await res.json()
      if (!res.ok) {
        setCouponError(json.message || 'Invalid coupon code')
        return
      }
      setCouponDiscount(json.discount || 0)
      setCouponApplied(true)
    } catch {
      setCouponError('Failed to validate coupon')
    }
  }

  const handlePayment = async () => {
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
          shippingAddress: address,
          couponCode: couponApplied ? couponCode : undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.message || 'Failed to create checkout session')
        return
      }

      // Redirect to Stripe checkout
      if (json.url) {
        window.location.href = json.url
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin border-[1.5px] border-[var(--border)] border-t-[var(--foreground)]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageBreadcrumb className="mb-6" />
      <h1 className="heading-editorial mb-2 text-2xl text-[var(--foreground)] sm:text-3xl lg:text-4xl">
        Checkout
      </h1>
      <div className="divider-accent mb-10" />

      {/* Step indicator */}
      <div className="mb-8 sm:mb-12">
        {/* Progress bar */}
        <div className="mx-auto mb-6 sm:mb-8 max-w-xs sm:max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] tracking-[0.04em] text-[var(--muted-foreground)]">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.04em] text-[var(--foreground)]">
              {Math.round((currentStep / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-[3px] w-full bg-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-[var(--foreground)] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center border-[1.5px] transition-colors',
                    currentStep >= step.id
                      ? 'border-[var(--foreground)] bg-[var(--foreground)] text-white'
                      : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]'
                  )}
                >
                  <step.icon size={16} strokeWidth={1.5} className="sm:h-[18px] sm:w-[18px]" />
                </div>
                <span
                  className={cn(
                    'subheading mt-1.5 sm:mt-2 text-[9px] sm:text-[11px]',
                    currentStep >= step.id
                      ? 'text-[var(--foreground)]'
                      : 'text-[var(--muted-foreground)]'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 sm:mx-4 mb-5 h-[1.5px] w-8 sm:w-24',
                    currentStep > step.id ? 'bg-[var(--foreground)]' : 'bg-[var(--border)]'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Main content */}
        <div className="lg:col-span-7">
          {/* Step 1: Address */}
          {currentStep === 1 && (
            <AddressSelector
              onAddressSelect={onAddressSelect}
              initialAddress={address}
            />
          )}

          {/* Step 2: Review */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Shipping address summary */}
              <div className="border border-[var(--border)] bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="heading-editorial text-xl text-[var(--foreground)]">
                    Shipping Address
                  </h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="hover-underline subheading text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    Edit
                  </button>
                </div>
                {address && (
                  <div className="mt-4 space-y-1 text-sm text-[var(--muted-foreground)]">
                    <p className="font-medium text-[var(--foreground)]">{address.fullName}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p>Phone: {address.phone}</p>
                  </div>
                )}
              </div>

              {/* Items review */}
              <div className="border border-[var(--border)] bg-white p-6 sm:p-8">
                <h2 className="heading-editorial mb-1 text-xl text-[var(--foreground)]">
                  Order Items
                </h2>
                <p className="subheading mb-4 text-[var(--muted-foreground)]">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
                <div className="divide-y divide-[var(--border)]">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[var(--muted)]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag
                              size={16}
                              strokeWidth={1.5}
                              className="text-[var(--muted-foreground)]"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {item.name}
                          </p>
                          <p className="subheading text-[var(--muted-foreground)]">
                            {item.size} / {item.color} / Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon code */}
              <div className="border border-[var(--border)] bg-white p-6 sm:p-8">
                <h2 className="heading-editorial mb-1 text-xl text-[var(--foreground)]">
                  Coupon Code
                </h2>
                <p className="subheading mb-4 text-[var(--muted-foreground)]">Have a promo code?</p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter coupon code"
                      icon={Tag}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      error={couponError || undefined}
                    />
                  </div>
                  <Button
                    variant={couponApplied ? 'ghost' : 'secondary'}
                    onClick={
                      couponApplied
                        ? () => {
                            setCouponCode('')
                            setCouponDiscount(0)
                            setCouponApplied(false)
                            setCouponError(null)
                          }
                        : handleApplyCoupon
                    }
                  >
                    {couponApplied ? 'Remove' : 'Apply'}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="mt-3 text-sm text-green-700">
                    Coupon applied! You save {formatPrice(couponDiscount)}
                  </p>
                )}

                {/* Browse available coupons */}
                {!couponApplied && (
                  <CouponDiscovery
                    onApply={(code) => {
                      setCouponCode(code)
                    }}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  icon={ChevronLeft}
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  iconRight={ChevronRight}
                  onClick={() => setCurrentStep(3)}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border border-[var(--border)] bg-white p-6 sm:p-8">
                <h2 className="heading-editorial mb-1 text-xl text-[var(--foreground)]">
                  Payment
                </h2>
                <p className="mb-6 text-sm text-[var(--muted-foreground)]">
                  You will be redirected to Stripe&apos;s secure payment page to
                  complete your purchase.
                </p>

                {error && (
                  <div className="mb-4 flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={16} strokeWidth={1.5} className="shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  size="lg"
                  className="btn-accent w-full"
                  loading={loading}
                  icon={Lock}
                  onClick={handlePayment}
                >
                  Pay with Stripe - {formatPrice(orderTotal)}
                </Button>

                <p className="mt-4 text-center text-xs tracking-wide text-[var(--muted-foreground)]">
                  Your payment is secured with 256-bit SSL encryption
                </p>
              </div>

              <div className="flex justify-start">
                <Button
                  variant="ghost"
                  icon={ChevronLeft}
                  onClick={() => setCurrentStep(2)}
                >
                  Back to Review
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="mt-10 lg:col-span-5 lg:mt-0">
          <div className="sticky top-24 border border-[var(--border)] bg-[var(--muted)] p-6">
            <h2 className="heading-editorial text-xl text-[var(--foreground)]">Order Summary</h2>

            {/* Compact items list */}
            <div className="mt-5 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-[var(--border)]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag
                          size={12}
                          strokeWidth={1.5}
                          className="text-[var(--muted-foreground)]"
                        />
                      </div>
                    )}
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-[var(--foreground)] text-[10px] text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm text-[var(--foreground)]">{item.name}</p>
                    <p className="subheading text-[var(--muted-foreground)]">
                      {item.size} / {item.color}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-[var(--foreground)]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span className="text-[var(--foreground)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Shipping</span>
                <span className="text-[var(--foreground)]">
                  {shipping === 0 ? (
                    <span className="text-green-700">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Discount</span>
                  <span className="text-green-700">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-[var(--border)] pt-3">
                <span className="heading-editorial text-base text-[var(--foreground)]">
                  Total
                </span>
                <span className="heading-editorial text-base text-[var(--foreground)]">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

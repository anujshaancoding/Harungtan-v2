'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Minus,
  Plus,
  Star,
  ChevronDown,
  ChevronUp,
  Ruler,
  Truck,
  ShieldCheck,
  Shirt,
  Sparkles,
} from 'lucide-react'
import { cn, formatPrice, getDiscountPercentage, COLORS } from '@/lib/utils'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { showCartToast } from '@/components/CartToast'
import { SizeGuide } from '@/components/products/SizeGuide'
import { SizeQuiz } from '@/components/products/SizeQuiz'
import { ImageLightbox } from '@/components/products/ImageLightbox'
import { triggerCompanion } from '@/components/ShopCompanion'
import type { Product } from '@/types'
import { DeliveryEstimate } from '@/components/products/DeliveryEstimate'
import { NotifyMeButton } from '@/components/products/NotifyMeButton'
import { LiveViewers } from '@/components/products/LiveViewers'
import { CompleteTheLook } from '@/components/products/CompleteTheLook'

interface ProductDetailsProps {
  product: Product
}

interface AccordionItemProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionItem({ title, icon, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors"
        style={{ color: 'var(--foreground)' }}
      >
        <span className="flex items-center gap-3 text-[13px] font-medium tracking-wide uppercase">
          {icon}
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={16} strokeWidth={1.5} style={{ color: 'var(--muted-foreground)' }} />
        ) : (
          <ChevronDown size={16} strokeWidth={1.5} style={{ color: 'var(--muted-foreground)' }} />
        )}
      </button>
      {isOpen && (
        <div
          className="pb-5 text-[13px] leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(
    product.colors.length > 0 ? product.colors[0] : ''
  )
  const [quantity, setQuantity] = useState(1)
  const [quantityDirection, setQuantityDirection] = useState<'up' | 'down'>('up')
  const [activeImage, setActiveImage] = useState(0)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [sizeQuizOpen, setSizeQuizOpen] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Zoom state (desktop only)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Sticky bar state (mobile)
  const ctaButtonRef = useRef<HTMLDivElement>(null)
  const sizeSelectorRef = useRef<HTMLDivElement>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [highlightSize, setHighlightSize] = useState(false)

  const { addItem } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()
  const isWishlisted = hasItem(product.id)

  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0

  const initials = product.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const getColorHex = (colorName: string) => {
    const found = COLORS.find(
      (c) => c.name.toLowerCase() === colorName.toLowerCase()
    )
    return found?.hex || '#6B7280'
  }

  // Trigger companion on product view
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerCompanion({ type: 'product_view', name: product.name, category: product.category })
    }, 3000)
    return () => clearTimeout(timer)
  }, [product.name, product.category])

  // IntersectionObserver for sticky bar
  useEffect(() => {
    const ctaEl = ctaButtonRef.current
    if (!ctaEl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(ctaEl)
    return () => observer.disconnect()
  }, [])

  // Zoom handlers (desktop only)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false)
  }, [])

  const scrollToSizeSelector = () => {
    sizeSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlightSize(true)
    setTimeout(() => setHighlightSize(false), 2000)
  }

  const handleAddToCart = (fromStickyBar = false) => {
    if (!selectedSize) {
      if (fromStickyBar) scrollToSizeSelector()
      return
    }
    setAddingToCart(true)

    addItem({
      id: '',
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity,
      slug: product.slug,
    })

    showCartToast({
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity,
    })

    setTimeout(() => setAddingToCart(false), 800)
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        strokeWidth={1.5}
        className={cn(
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'text-[var(--border)]'
        )}
        style={i >= Math.floor(rating) ? { fill: 'var(--border)' } : undefined}
      />
    ))

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          {/* Thumbnails - sharp square edges */}
          <div className="flex gap-3 sm:flex-col">
            {(product.images.length > 0
              ? product.images
              : ['', '', '', '']
            ).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  'h-16 w-16 flex-shrink-0 overflow-hidden border transition-all sm:h-20 sm:w-20',
                  activeImage === idx
                    ? 'border-[var(--foreground)] shadow-sm'
                    : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                )}
              >
                {img ? (
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <span
                      className="text-xs font-light"
                      style={{ color: 'var(--border)' }}
                    >
                      {initials}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Main image - no rounded corners, with desktop zoom */}
          <div className="flex-1">
            <div
              ref={imageContainerRef}
              className="sticky top-24 relative aspect-[3/4] overflow-hidden"
              style={{
                backgroundColor: 'var(--muted)',
                cursor: isZoomed ? 'crosshair' : 'zoom-in',
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                if (!isZoomed && product.images.length > 0) {
                  setLightboxOpen(true)
                }
              }}
            >
              {product.images[activeImage] ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-200 ease-out product-zoom-image"
                  style={{
                    transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                  draggable={false}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--muted), var(--border))' }}
                >
                  <span
                    className="text-7xl font-light tracking-widest"
                    style={{ color: 'var(--border)' }}
                  >
                    {initials}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute left-4 top-4">
                  <Badge variant="danger">{discount}% OFF</Badge>
                </div>
              )}
              {product.newArrival && (
                <div className="absolute right-4 top-4">
                  <Badge>NEW</Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product info */}
        <div>
          {/* Subheading label */}
          <p
            className="subheading mb-3 text-[11px] font-medium tracking-[0.2em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Harungtan
          </p>

          {/* Name - editorial serif */}
          <h1
            className="heading-editorial mb-3 text-2xl font-normal sm:text-3xl lg:text-[2.25rem] leading-tight"
            style={{ color: 'var(--foreground)' }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mb-5 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span
                className="text-[11px] tracking-wide"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6 flex items-baseline gap-3">
            <span
              className="text-xl font-medium tracking-wide"
              style={{ color: 'var(--foreground)' }}
            >
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span
                  className="text-sm line-through"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {formatPrice(product.comparePrice)}
                </span>
                <span
                  className="text-[11px] font-medium tracking-wide"
                  style={{ color: 'var(--accent)' }}
                >
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock indicator */}
          <div className="mb-4 flex items-center gap-2 text-[12px] tracking-wide">
            {product.stock === 0 ? (
              <>
                <span
                  className="inline-block h-2 w-2"
                  style={{ backgroundColor: '#DC2626' }}
                />
                <span style={{ color: '#DC2626' }}>Out of Stock</span>
              </>
            ) : product.stock <= 5 ? (
              <>
                <span
                  className="inline-block h-2 w-2"
                  style={{ backgroundColor: '#D97706' }}
                />
                <span style={{ color: '#D97706' }}>
                  Only {product.stock} left in stock!
                </span>
              </>
            ) : product.stock <= 15 ? (
              <>
                <span
                  className="inline-block h-2 w-2"
                  style={{ backgroundColor: '#D97706' }}
                />
                <span style={{ color: '#D97706' }}>Low stock</span>
              </>
            ) : (
              <>
                <span
                  className="inline-block h-2 w-2"
                  style={{ backgroundColor: '#059669' }}
                />
                <span style={{ color: '#059669' }}>In Stock</span>
              </>
            )}
          </div>

          {/* Live Viewers */}
          <LiveViewers productSlug={product.slug} />

          {/* Divider */}
          <div className="divider-accent mb-6 h-px w-12" style={{ backgroundColor: 'var(--accent)' }} />

          {/* Short description */}
          <p
            className="mb-8 text-[13px] leading-[1.8]"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {product.description}
          </p>

          {/* Color selector */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <label
                className="mb-3 block text-[11px] font-medium tracking-[0.15em] uppercase"
                style={{ color: 'var(--foreground)' }}
              >
                Color:{' '}
                <span
                  className="font-normal capitalize tracking-normal"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {selectedColor}
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); triggerCompanion({ type: 'color_select', color }) }}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center border transition-all',
                      selectedColor === color
                        ? 'border-[var(--foreground)] scale-105'
                        : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                    )}
                    title={color}
                  >
                    <span
                      className={cn(
                        'h-7 w-7',
                        getColorHex(color) === '#FFFFFF' && 'border border-[var(--border)]'
                      )}
                      style={{ backgroundColor: getColorHex(color) }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div
              ref={sizeSelectorRef}
              className={cn('mb-6 transition-all duration-500 rounded-sm', highlightSize && 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/5 p-3 -m-3')}
            >
              <div className="mb-3 flex items-center justify-between">
                <label
                  className="text-[11px] font-medium tracking-[0.15em] uppercase"
                  style={{ color: 'var(--foreground)' }}
                >
                  Size:{' '}
                  {selectedSize && (
                    <span
                      className="font-normal tracking-normal"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {selectedSize}
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSizeQuizOpen(true)}
                    className="hover-underline flex items-center gap-1.5 text-[11px] tracking-wide transition-colors"
                    style={{ color: 'var(--accent)' }}
                  >
                    <Sparkles size={12} strokeWidth={1.5} />
                    Find Your Size
                  </button>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="hover-underline flex items-center gap-1.5 text-[11px] tracking-wide transition-colors"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <Ruler size={12} strokeWidth={1.5} />
                    Size Guide
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const sizeStockCount = product.sizeStock?.[size]
                  const isSizeOOS = sizeStockCount !== undefined && sizeStockCount <= 0
                  return (
                    <div key={size} className="relative">
                      <button
                        onClick={() => { if (!isSizeOOS) { setSelectedSize(size); triggerCompanion({ type: 'size_select', size }) } }}
                        disabled={isSizeOOS}
                        className={cn(
                          'flex h-11 min-w-[3rem] items-center justify-center border px-4 text-[13px] font-medium tracking-wide transition-all',
                          isSizeOOS
                            ? 'border-[var(--border)] text-[var(--muted-foreground)] opacity-40 cursor-not-allowed line-through'
                            : selectedSize === size
                              ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                              : 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)]'
                        )}
                        title={isSizeOOS ? `${size} is out of stock` : `Select size ${size}`}
                      >
                        {size}
                      </button>
                      {sizeStockCount !== undefined && sizeStockCount > 0 && sizeStockCount <= 5 && (
                        <span
                          className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold tracking-wide"
                          style={{ color: '#D97706' }}
                        >
                          Only {sizeStockCount} left
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              {!selectedSize && (
                <p
                  className={cn("mt-2 text-[11px] tracking-wide", product.sizeStock ? "mt-7" : "")}
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Please select a size
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <label
              className="mb-3 block text-[11px] font-medium tracking-[0.15em] uppercase"
              style={{ color: 'var(--foreground)' }}
            >
              Quantity
            </label>
            <div
              className="inline-flex items-center rounded-lg border"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => {
                  setQuantityDirection('down')
                  setQuantity(Math.max(1, quantity - 1))
                }}
                className="flex h-12 w-12 items-center justify-center rounded-l-lg transition-all duration-150 hover:bg-[var(--muted)] active:scale-90 disabled:opacity-30"
                style={{ color: 'var(--muted-foreground)' }}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <span
                className="relative flex h-12 w-14 items-center justify-center overflow-hidden border-x text-[14px] font-semibold"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <span
                  key={quantity}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    animation: `quantity-${quantityDirection === 'up' ? 'slide-up' : 'slide-down'} 0.2s ease-out`,
                  }}
                >
                  {quantity}
                </span>
              </span>
              <button
                onClick={() => {
                  setQuantityDirection('up')
                  setQuantity(Math.min(10, quantity + 1))
                }}
                className="flex h-12 w-12 items-center justify-center rounded-r-lg transition-all duration-150 hover:bg-[var(--muted)] active:scale-90 disabled:opacity-30"
                style={{ color: 'var(--muted-foreground)' }}
                disabled={quantity >= 10}
                aria-label="Increase quantity"
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Actions - ref for IntersectionObserver */}
          <div ref={ctaButtonRef} className="mb-8 flex gap-3">
            <button
              className="btn-primary flex-1 flex items-center justify-center h-12 text-[13px] font-medium tracking-[0.15em] uppercase transition-all disabled:opacity-40"
              onClick={() => handleAddToCart()}
              disabled={!selectedSize || product.stock === 0}
              style={{
                backgroundColor: addingToCart ? 'var(--warm-dark)' : 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
              }}
            >
              {product.stock === 0
                ? 'Out of Stock'
                : addingToCart
                  ? 'Added!'
                  : 'Add to Cart'}
            </button>
            <button
              onClick={() => { toggleItem(product.id); if (!isWishlisted) triggerCompanion({ type: 'wishlist_add' }) }}
              className="flex h-12 w-12 items-center justify-center border transition-all hover:bg-[var(--muted)]"
              style={{ borderColor: 'var(--border)' }}
              aria-label={
                isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
              }
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                className={cn(
                  'transition-colors',
                  isWishlisted
                    ? 'fill-[var(--accent)] text-[var(--accent)]'
                    : 'text-[var(--foreground)]'
                )}
              />
            </button>
          </div>

          {/* Trust badges - accent themed */}
          <div
            className="mb-8 flex flex-wrap gap-6 border px-6 py-4"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
          >
            <span
              className="flex items-center gap-2.5 text-[11px] tracking-wide"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <Truck size={16} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
              Free shipping over Rs. 999
            </span>
            <span
              className="flex items-center gap-2.5 text-[11px] tracking-wide"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <ShieldCheck size={16} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
              7-day easy returns
            </span>
          </div>

          {/* Delivery Estimate */}
          <div className="mb-6">
            <DeliveryEstimate />
          </div>

          {/* Notify Me (when out of stock) */}
          {product.stock === 0 && (
            <div className="mb-6">
              <NotifyMeButton productSlug={product.slug} size={selectedSize} />
            </div>
          )}

          {/* Accordion sections */}
          <div className="border-t" style={{ borderColor: 'var(--border)' }}>
            <AccordionItem
              title="Description"
              icon={<Shirt size={16} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />}
              defaultOpen
            >
              <p>{product.description}</p>
              {product.material && (
                <p className="mt-2">
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                    Material:
                  </span>{' '}
                  {product.material}
                </p>
              )}
            </AccordionItem>

            <AccordionItem
              title="Size Guide"
              icon={<Ruler size={16} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />}
            >
              <p className="mb-2">
                Not sure about your size? Check our detailed size chart.
              </p>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="hover-underline text-[13px] font-medium"
                style={{ color: 'var(--foreground)' }}
              >
                View Size Guide
              </button>
            </AccordionItem>

            <AccordionItem
              title="Care Instructions"
              icon={<ShieldCheck size={16} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />}
            >
              {product.careInfo ? (
                <p>{product.careInfo}</p>
              ) : (
                <ul className="list-inside list-disc space-y-1.5">
                  <li>Machine wash cold with like colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                  <li>Do not dry clean</li>
                </ul>
              )}
            </AccordionItem>

            <AccordionItem
              title="Shipping & Returns"
              icon={<Truck size={16} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />}
            >
              <ul className="list-inside list-disc space-y-1.5">
                <li>Free standard shipping on orders above Rs. 999</li>
                <li>Standard delivery: 5-7 business days</li>
                <li>Express delivery: 2-3 business days</li>
                <li>7-day easy return policy</li>
                <li>Free exchange on all orders</li>
              </ul>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Complete the Look */}
      <div className="mt-16">
        <CompleteTheLook productSlug={product.slug} />
      </div>

      {/* Size Guide Modal */}
      <SizeGuide
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      {/* Size Recommendation Quiz */}
      <SizeQuiz
        isOpen={sizeQuizOpen}
        onClose={() => setSizeQuizOpen(false)}
        onSizeSelect={(size) => setSelectedSize(size)}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        images={product.images}
        initialIndex={activeImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        productName={product.name}
      />

      {/* Sticky Add-to-Cart Bar (Mobile) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
            style={{
              backgroundColor: 'var(--background)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Product name + price */}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-[13px] font-medium"
                  style={{ color: 'var(--foreground)' }}
                >
                  {product.name}
                </p>
                <p
                  className="text-[12px] font-medium tracking-wide"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Add to Bag button */}
              <button
                onClick={() => handleAddToCart(true)}
                disabled={product.stock === 0}
                className="flex h-11 shrink-0 items-center justify-center px-6 text-[12px] font-medium tracking-[0.15em] uppercase transition-all disabled:opacity-40"
                style={{
                  backgroundColor: addingToCart ? 'var(--warm-dark)' : 'var(--foreground)',
                  color: 'var(--background)',
                  border: 'none',
                }}
              >
                {product.stock === 0
                  ? 'Out of Stock'
                  : addingToCart
                    ? 'Added!'
                    : 'Add to Bag'}
              </button>
            </div>

            {/* Safe area spacer for notched devices */}
            <div className="h-[env(safe-area-inset-bottom)]" style={{ backgroundColor: 'var(--background)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Add-to-Cart Bar (Desktop) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 hidden lg:block"
            style={{
              backgroundColor: 'var(--background)',
              borderBottom: '1px solid var(--border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div className="mx-auto flex max-w-7xl items-center gap-6 px-8 py-3">
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-[14px] font-medium"
                  style={{ color: 'var(--foreground)' }}
                >
                  {product.name}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[13px] font-medium" style={{ color: 'var(--foreground)' }}>
                    {formatPrice(product.price)}
                  </span>
                  {selectedSize && (
                    <span className="text-[11px] tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Size: {selectedSize}
                    </span>
                  )}
                  {selectedColor && (
                    <span className="text-[11px] tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Color: {selectedColor}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleItem(product.id)}
                  className="flex h-10 w-10 items-center justify-center border transition-all hover:bg-[var(--muted)]"
                  style={{ borderColor: 'var(--border)' }}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    size={16}
                    strokeWidth={1.5}
                    className={cn(
                      'transition-colors',
                      isWishlisted
                        ? 'fill-[var(--accent)] text-[var(--accent)]'
                        : 'text-[var(--foreground)]'
                    )}
                  />
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={product.stock === 0}
                  className="flex h-10 items-center justify-center px-8 text-[12px] font-medium tracking-[0.15em] uppercase transition-all disabled:opacity-40"
                  style={{
                    backgroundColor: addingToCart ? 'var(--warm-dark)' : 'var(--foreground)',
                    color: 'var(--background)',
                    border: 'none',
                  }}
                >
                  {product.stock === 0
                    ? 'Out of Stock'
                    : addingToCart
                      ? 'Added!'
                      : 'Add to Cart'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}

export default ProductDetails

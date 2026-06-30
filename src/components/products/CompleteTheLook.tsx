'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store'
import { showCartToast } from '@/components/CartToast'
import type { Product } from '@/types'

interface CompleteTheLookProps {
  productSlug: string
  className?: string
}

export function CompleteTheLook({ productSlug, className }: CompleteTheLookProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await fetch(`/api/products/${productSlug}/bundle`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchBundle()
  }, [productSlug])

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes[0] || 'M'
    const defaultColor = product.colors[0] || 'Black'

    addItem({
      id: '',
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: defaultSize,
      color: defaultColor,
      quantity: 1,
      slug: product.slug,
    })

    showCartToast({
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: defaultSize,
      color: defaultColor,
      quantity: 1,
    })
  }

  if (loading || products.length === 0) return null

  return (
    <div className={cn('', className)}>
      <div className="mb-6 flex items-center gap-2">
        <Sparkles size={18} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
        <h2 className="heading-editorial text-xl" style={{ color: 'var(--foreground)' }}>
          Complete the Look
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="group">
            <Link href={`/products/${product.slug}`}>
              <div
                className="relative aspect-[3/4] overflow-hidden"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingBag size={24} strokeWidth={1} style={{ color: 'var(--border)' }} />
                  </div>
                )}
              </div>
            </Link>
            <div className="mt-3">
              <Link href={`/products/${product.slug}`}>
                <p
                  className="truncate text-[13px] font-medium hover-underline"
                  style={{ color: 'var(--foreground)' }}
                >
                  {product.name}
                </p>
              </Link>
              <p className="mt-1 text-[12px] tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                {formatPrice(product.price)}
              </p>
              <button
                onClick={() => handleQuickAdd(product)}
                className="mt-2 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.1em] uppercase transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                <Plus size={12} strokeWidth={1.5} />
                Quick Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

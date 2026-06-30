'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn, SIZES, COLORS, CATEGORIES } from '@/lib/utils'

interface ProductFormData {
  name: string
  description: string
  price: string
  comparePrice: string
  category: string
  gender: string
  sizes: string[]
  colors: string[]
  images: string
  material: string
  careInfo: string
  stock: string
  featured: boolean
  bestseller: boolean
  newArrival: boolean
  active: boolean
}

export default function NewProductPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      category: '',
      gender: '',
      sizes: [],
      colors: [],
      images: '',
      material: '',
      careInfo: '',
      stock: '0',
      featured: false,
      bestseller: false,
      newArrival: false,
      active: true,
    },
  })

  const selectedSizes = watch('sizes')
  const selectedColors = watch('colors')

  const toggleSize = (size: string) => {
    const current = selectedSizes || []
    if (current.includes(size)) {
      setValue('sizes', current.filter((s) => s !== size))
    } else {
      setValue('sizes', [...current, size])
    }
  }

  const toggleColor = (colorName: string) => {
    const current = selectedColors || []
    if (current.includes(colorName)) {
      setValue('colors', current.filter((c) => c !== colorName))
    } else {
      setValue('colors', [...current, colorName])
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    if (data.sizes.length === 0) {
      toast.error('Please select at least one size')
      return
    }
    if (data.colors.length === 0) {
      toast.error('Please select at least one color')
      return
    }

    setSubmitting(true)
    try {
      const images = data.images
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean)

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          price: data.price,
          comparePrice: data.comparePrice || null,
          category: data.category,
          gender: data.gender,
          sizes: data.sizes,
          colors: data.colors,
          images,
          material: data.material || null,
          careInfo: data.careInfo || null,
          stock: data.stock,
          featured: data.featured,
          bestseller: data.bestseller,
          newArrival: data.newArrival,
          active: data.active,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      toast.success('Product created successfully')
      router.push('/admin/products')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Add Product
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Create a new product for your store
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {/* Basic Information */}
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Basic Information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Product Name"
                placeholder="e.g., Classic Round Neck T-Shirt"
                error={errors.name?.message}
                {...register('name', { required: 'Product name is required' })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="subheading mb-2 block text-[var(--muted-foreground)]">
                Description
              </label>
              <textarea
                placeholder="Describe your product..."
                rows={4}
                className={cn(
                  'w-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] transition-all',
                  'placeholder:text-[var(--muted-foreground)]',
                  'focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20',
                  errors.description && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                )}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
            <div>
              <label className="subheading mb-2 block text-[var(--muted-foreground)]">
                Category
              </label>
              <select
                className={cn(
                  'h-10 w-full border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] transition-all',
                  'focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20',
                  errors.category && 'border-red-500'
                )}
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1.5 text-xs text-red-600">{errors.category.message}</p>
              )}
            </div>
            <div>
              <label className="subheading mb-2 block text-[var(--muted-foreground)]">
                Gender
              </label>
              <select
                className={cn(
                  'h-10 w-full border border-[var(--border)] bg-[var(--background)] px-4 text-sm text-[var(--foreground)] transition-all',
                  'focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20',
                  errors.gender && 'border-red-500'
                )}
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="">Select gender</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
              {errors.gender && (
                <p className="mt-1.5 text-xs text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Pricing & Stock
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Input
              label="Price (INR)"
              type="number"
              step="0.01"
              min="0"
              placeholder="999"
              error={errors.price?.message}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
              })}
            />
            <Input
              label="Compare Price (INR)"
              type="number"
              step="0.01"
              min="0"
              placeholder="1299"
              hint="Original price before discount"
              {...register('comparePrice')}
            />
            <Input
              label="Stock"
              type="number"
              min="0"
              placeholder="100"
              error={errors.stock?.message}
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock must be positive' },
              })}
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Sizes
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Select available sizes for this product
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={cn(
                  'flex h-10 min-w-[3rem] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all',
                  selectedSizes?.includes(size)
                    ? 'border-[var(--foreground)] bg-[var(--foreground)] text-white'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--foreground)]'
                )}
              >
                {size}
              </button>
            ))}
          </div>
          {selectedSizes?.length === 0 && (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              At least one size is required
            </p>
          )}
        </div>

        {/* Colors */}
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Colors
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Select available colors for this product
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all',
                  selectedColors?.includes(color.name)
                    ? 'border-[var(--foreground)] bg-[var(--muted)]'
                    : 'border-[var(--border)] hover:border-[var(--foreground)]'
                )}
              >
                <span
                  className={cn(
                    'h-5 w-5 rounded-full border',
                    color.hex === '#FFFFFF' ? 'border-[var(--border)]' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[var(--foreground)]">{color.name}</span>
                {selectedColors?.includes(color.name) && (
                  <span className="text-xs text-[var(--muted-foreground)]">✓</span>
                )}
              </button>
            ))}
          </div>
          {selectedColors?.length === 0 && (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              At least one color is required
            </p>
          )}
        </div>

        {/* Images */}
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Images
          </h2>
          <div className="mt-4">
            <Input
              label="Image URLs"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              hint="Enter comma-separated image URLs"
              {...register('images')}
            />
          </div>
        </div>

        {/* Details */}
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Product Details
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Material"
              placeholder="e.g., 100% Cotton"
              {...register('material')}
            />
            <div className="sm:col-span-1" />
            <div className="sm:col-span-2">
              <label className="subheading mb-2 block text-[var(--muted-foreground)]">
                Care Instructions
              </label>
              <textarea
                placeholder="e.g., Machine wash cold, tumble dry low..."
                rows={3}
                className={cn(
                  'w-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] transition-all',
                  'placeholder:text-[var(--muted-foreground)]',
                  'focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/20'
                )}
                {...register('careInfo')}
              />
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="rounded-xl border border-[var(--border)] bg-white p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Visibility & Tags
          </h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--foreground)]"
                {...register('active')}
              />
              <div>
                <span className="text-sm font-medium text-[var(--foreground)]">Active</span>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Product is visible on the store
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--foreground)]"
                {...register('featured')}
              />
              <div>
                <span className="text-sm font-medium text-[var(--foreground)]">Featured</span>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Show in featured products section
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--foreground)]"
                {...register('bestseller')}
              />
              <div>
                <span className="text-sm font-medium text-[var(--foreground)]">Bestseller</span>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Mark as a bestselling product
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border)] accent-[var(--foreground)]"
                {...register('newArrival')}
              />
              <div>
                <span className="text-sm font-medium text-[var(--foreground)]">New Arrival</span>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Show in new arrivals section
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link href="/admin/products">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" icon={Save} loading={submitting}>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  )
}

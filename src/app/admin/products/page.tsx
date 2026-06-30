'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '20')
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/products?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch products')

      const data: ProductsResponse = await res.json()
      setProducts(data.products)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Debounce search - reset page when searching
  useEffect(() => {
    setPage(1)
  }, [search])

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete product')
      }

      toast.success(`"${name}" deleted successfully`)
      fetchProducts()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Products
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage your product catalog ({total} total)
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button icon={Plus} size="sm">
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mt-6 max-w-md">
        <Input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputSize="md"
        />
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package size={48} className="text-[var(--muted-foreground)]" strokeWidth={1} />
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              {search ? 'No products match your search.' : 'No products yet.'}
            </p>
            {!search && (
              <Link href="/admin/products/new" className="mt-4">
                <Button icon={Plus} size="sm" variant="secondary">
                  Add your first product
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">
                    Product
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-[var(--muted-foreground)] md:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">
                    Price
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-[var(--muted-foreground)] sm:table-cell">
                    Stock
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-[var(--muted-foreground)] sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[var(--muted)]/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
                          {product.images.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package size={16} className="text-[var(--muted-foreground)]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[var(--foreground)]">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-[var(--muted-foreground)] md:hidden">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 capitalize text-[var(--muted-foreground)] md:table-cell">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={cn(
                          'text-sm',
                          product.stock <= 0
                            ? 'font-medium text-red-600'
                            : product.stock <= 10
                              ? 'text-amber-600'
                              : 'text-[var(--muted-foreground)]'
                        )}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                          product.active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                          className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                          title="Edit product"
                        >
                          <Pencil size={16} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete product"
                        >
                          {deleting === product.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          ) : (
                            <Trash2 size={16} strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconRight={ChevronRight}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

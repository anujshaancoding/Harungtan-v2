'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

const MAX_ITEMS = 8

interface RecentlyViewedStore {
  products: Product[]
  addProduct: (product: Product) => void
  getProducts: () => Product[]
  clearProducts: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const current = get().products.filter((p) => p.id !== product.id)
        const updated = [product, ...current].slice(0, MAX_ITEMS)
        set({ products: updated })
      },
      getProducts: () => get().products,
      clearProducts: () => set({ products: [] }),
    }),
    {
      name: 'harungtan-recently-viewed',
    }
  )
)

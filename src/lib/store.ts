'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  slug: string
}

interface CartStore {
  items: CartItem[]
  savedItems: CartItem[]
  isOpen: boolean
  lastRemoved: CartItem | null
  lastActivity: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  undoRemove: () => void
  updateQuantity: (id: string, quantity: number) => void
  saveForLater: (id: string) => void
  moveToCart: (id: string) => void
  removeSaved: (id: string) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (open: boolean) => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      isOpen: false,
      lastRemoved: null,
      lastActivity: 0,
      addItem: (item) => {
        const existing = get().items.find(
          (i) =>
            i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color
        )
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            lastActivity: Date.now(),
          })
        } else {
          set({ items: [...get().items, { ...item, id: Math.random().toString(36).substring(2) + Date.now().toString(36) }], lastActivity: Date.now() })
        }
        broadcastSync('cart')
      },
      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id)
        set({
          items: get().items.filter((i) => i.id !== id),
          lastRemoved: item || null,
        })
        broadcastSync('cart')
      },
      undoRemove: () => {
        const removed = get().lastRemoved
        if (removed) {
          set({
            items: [...get().items, removed],
            lastRemoved: null,
          })
          broadcastSync('cart')
        }
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          const item = get().items.find((i) => i.id === id)
          set({
            items: get().items.filter((i) => i.id !== id),
            lastRemoved: item || null,
          })
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          })
        }
        broadcastSync('cart')
      },
      saveForLater: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (item) {
          set({
            items: get().items.filter((i) => i.id !== id),
            savedItems: [...get().savedItems, item],
          })
          broadcastSync('cart')
        }
      },
      moveToCart: (id) => {
        const item = get().savedItems.find((i) => i.id === id)
        if (item) {
          set({
            savedItems: get().savedItems.filter((i) => i.id !== id),
            items: [...get().items, item],
          })
          broadcastSync('cart')
        }
      },
      removeSaved: (id) => {
        set({ savedItems: get().savedItems.filter((i) => i.id !== id) })
        broadcastSync('cart')
      },
      clearCart: () => {
        set({ items: [], lastRemoved: null })
        broadcastSync('cart')
      },
      toggleCart: () => set({ isOpen: !get().isOpen }),
      setCartOpen: (open) => set({ isOpen: open }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'harungtan-cart',
      partialize: (state) => ({ items: state.items, savedItems: state.savedItems, lastActivity: state.lastActivity }),
    }
  )
)

interface WishlistStore {
  items: string[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  toggleItem: (productId: string) => void
  hasItem: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] })
          broadcastSync('wishlist')
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) })
        broadcastSync('wishlist')
      },
      toggleItem: (productId) => {
        if (get().items.includes(productId)) {
          get().removeItem(productId)
        } else {
          get().addItem(productId)
        }
      },
      hasItem: (productId) => get().items.includes(productId),
    }),
    {
      name: 'harungtan-wishlist',
    }
  )
)

// ========= TAB SYNCING via BroadcastChannel =========
let cartChannel: BroadcastChannel | null = null
let wishlistChannel: BroadcastChannel | null = null

function broadcastSync(store: 'cart' | 'wishlist') {
  try {
    if (store === 'cart') {
      if (!cartChannel) cartChannel = new BroadcastChannel('harungtan-cart-sync')
      cartChannel.postMessage({ type: 'sync', data: useCartStore.getState().items })
    } else {
      if (!wishlistChannel) wishlistChannel = new BroadcastChannel('harungtan-wishlist-sync')
      wishlistChannel.postMessage({ type: 'sync', data: useWishlistStore.getState().items })
    }
  } catch {
    // BroadcastChannel not supported
  }
}

if (typeof window !== 'undefined') {
  try {
    cartChannel = new BroadcastChannel('harungtan-cart-sync')
    cartChannel.onmessage = (e) => {
      if (e.data?.type === 'sync') {
        useCartStore.setState({ items: e.data.data })
      }
    }

    wishlistChannel = new BroadcastChannel('harungtan-wishlist-sync')
    wishlistChannel.onmessage = (e) => {
      if (e.data?.type === 'sync') {
        useWishlistStore.setState({ items: e.data.data })
      }
    }
  } catch {
    // BroadcastChannel not supported
  }
}

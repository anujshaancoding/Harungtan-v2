import { act } from '@testing-library/react'
import { useCartStore, useWishlistStore, type CartItem } from '@/lib/store'

// Reset stores before each test
beforeEach(() => {
  act(() => {
    useCartStore.setState({ items: [], isOpen: false })
    useWishlistStore.setState({ items: [] })
  })
})

const createCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'item-1',
  productId: 'prod-1',
  name: 'Classic Round Neck T-Shirt',
  price: 599,
  image: '/images/tshirt-1.jpg',
  size: 'M',
  color: 'Black',
  quantity: 1,
  slug: 'classic-round-neck-t-shirt',
  ...overrides,
})

describe('Cart Store', () => {
  describe('addItem', () => {
    it('adds a new item to the cart', () => {
      const item = createCartItem()
      act(() => {
        useCartStore.getState().addItem(item)
      })
      const items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].name).toBe('Classic Round Neck T-Shirt')
      expect(items[0].quantity).toBe(1)
    })

    it('increments quantity when adding an existing item with same productId, size, and color', () => {
      const item = createCartItem()
      act(() => {
        useCartStore.getState().addItem(item)
        useCartStore.getState().addItem(item)
      })
      const items = useCartStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it('adds as separate item when same product but different size', () => {
      const itemM = createCartItem({ size: 'M' })
      const itemL = createCartItem({ id: 'item-2', size: 'L' })
      act(() => {
        useCartStore.getState().addItem(itemM)
        useCartStore.getState().addItem(itemL)
      })
      expect(useCartStore.getState().items).toHaveLength(2)
    })

    it('adds as separate item when same product but different color', () => {
      const itemBlack = createCartItem({ color: 'Black' })
      const itemWhite = createCartItem({ id: 'item-2', color: 'White' })
      act(() => {
        useCartStore.getState().addItem(itemBlack)
        useCartStore.getState().addItem(itemWhite)
      })
      expect(useCartStore.getState().items).toHaveLength(2)
    })

    it('generates a new id via crypto.randomUUID', () => {
      const item = createCartItem({ id: 'original-id' })
      act(() => {
        useCartStore.getState().addItem(item)
      })
      const items = useCartStore.getState().items
      // The store reassigns the id using crypto.randomUUID
      expect(items[0].id).not.toBe('original-id')
    })
  })

  describe('removeItem', () => {
    it('removes an item by id', () => {
      const item = createCartItem()
      act(() => {
        useCartStore.getState().addItem(item)
      })
      const addedItemId = useCartStore.getState().items[0].id
      act(() => {
        useCartStore.getState().removeItem(addedItemId)
      })
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('does nothing if id does not exist', () => {
      const item = createCartItem()
      act(() => {
        useCartStore.getState().addItem(item)
      })
      act(() => {
        useCartStore.getState().removeItem('nonexistent')
      })
      expect(useCartStore.getState().items).toHaveLength(1)
    })
  })

  describe('updateQuantity', () => {
    it('updates the quantity of an item', () => {
      const item = createCartItem()
      act(() => {
        useCartStore.getState().addItem(item)
      })
      const id = useCartStore.getState().items[0].id
      act(() => {
        useCartStore.getState().updateQuantity(id, 5)
      })
      expect(useCartStore.getState().items[0].quantity).toBe(5)
    })

    it('removes the item when quantity is set to 0', () => {
      const item = createCartItem()
      act(() => {
        useCartStore.getState().addItem(item)
      })
      const id = useCartStore.getState().items[0].id
      act(() => {
        useCartStore.getState().updateQuantity(id, 0)
      })
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('removes the item when quantity is negative', () => {
      const item = createCartItem()
      act(() => {
        useCartStore.getState().addItem(item)
      })
      const id = useCartStore.getState().items[0].id
      act(() => {
        useCartStore.getState().updateQuantity(id, -1)
      })
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('removes all items from the cart', () => {
      act(() => {
        useCartStore.getState().addItem(createCartItem({ productId: 'prod-1' }))
        useCartStore.getState().addItem(createCartItem({ productId: 'prod-2', id: 'item-2' }))
      })
      act(() => {
        useCartStore.getState().clearCart()
      })
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe('total', () => {
    it('returns 0 for an empty cart', () => {
      expect(useCartStore.getState().total()).toBe(0)
    })

    it('calculates total for a single item', () => {
      act(() => {
        useCartStore.getState().addItem(createCartItem({ price: 599, quantity: 2 }))
      })
      expect(useCartStore.getState().total()).toBe(1198)
    })

    it('calculates total for multiple items', () => {
      act(() => {
        useCartStore.getState().addItem(createCartItem({ productId: 'prod-1', price: 500, quantity: 1 }))
        useCartStore.getState().addItem(createCartItem({ productId: 'prod-2', id: 'item-2', price: 300, quantity: 3 }))
      })
      expect(useCartStore.getState().total()).toBe(500 + 900)
    })
  })

  describe('itemCount', () => {
    it('returns 0 for an empty cart', () => {
      expect(useCartStore.getState().itemCount()).toBe(0)
    })

    it('sums quantities across all items', () => {
      act(() => {
        useCartStore.getState().addItem(createCartItem({ productId: 'prod-1', quantity: 2 }))
        useCartStore.getState().addItem(createCartItem({ productId: 'prod-2', id: 'item-2', quantity: 3 }))
      })
      expect(useCartStore.getState().itemCount()).toBe(5)
    })
  })

  describe('toggleCart / setCartOpen', () => {
    it('toggles the cart open state', () => {
      expect(useCartStore.getState().isOpen).toBe(false)
      act(() => {
        useCartStore.getState().toggleCart()
      })
      expect(useCartStore.getState().isOpen).toBe(true)
      act(() => {
        useCartStore.getState().toggleCart()
      })
      expect(useCartStore.getState().isOpen).toBe(false)
    })

    it('sets cart open state explicitly', () => {
      act(() => {
        useCartStore.getState().setCartOpen(true)
      })
      expect(useCartStore.getState().isOpen).toBe(true)
      act(() => {
        useCartStore.getState().setCartOpen(false)
      })
      expect(useCartStore.getState().isOpen).toBe(false)
    })
  })
})

describe('Wishlist Store', () => {
  describe('addItem', () => {
    it('adds a product id to the wishlist', () => {
      act(() => {
        useWishlistStore.getState().addItem('prod-1')
      })
      expect(useWishlistStore.getState().items).toContain('prod-1')
    })

    it('does not add duplicate product ids', () => {
      act(() => {
        useWishlistStore.getState().addItem('prod-1')
        useWishlistStore.getState().addItem('prod-1')
      })
      expect(useWishlistStore.getState().items).toHaveLength(1)
    })
  })

  describe('removeItem', () => {
    it('removes a product id from the wishlist', () => {
      act(() => {
        useWishlistStore.getState().addItem('prod-1')
        useWishlistStore.getState().addItem('prod-2')
      })
      act(() => {
        useWishlistStore.getState().removeItem('prod-1')
      })
      expect(useWishlistStore.getState().items).toEqual(['prod-2'])
    })

    it('does nothing if product id is not in the wishlist', () => {
      act(() => {
        useWishlistStore.getState().addItem('prod-1')
      })
      act(() => {
        useWishlistStore.getState().removeItem('prod-999')
      })
      expect(useWishlistStore.getState().items).toHaveLength(1)
    })
  })

  describe('toggleItem', () => {
    it('adds the item if not present', () => {
      act(() => {
        useWishlistStore.getState().toggleItem('prod-1')
      })
      expect(useWishlistStore.getState().items).toContain('prod-1')
    })

    it('removes the item if already present', () => {
      act(() => {
        useWishlistStore.getState().addItem('prod-1')
      })
      act(() => {
        useWishlistStore.getState().toggleItem('prod-1')
      })
      expect(useWishlistStore.getState().items).not.toContain('prod-1')
    })
  })

  describe('hasItem', () => {
    it('returns true if item is in the wishlist', () => {
      act(() => {
        useWishlistStore.getState().addItem('prod-1')
      })
      expect(useWishlistStore.getState().hasItem('prod-1')).toBe(true)
    })

    it('returns false if item is not in the wishlist', () => {
      expect(useWishlistStore.getState().hasItem('prod-999')).toBe(false)
    })
  })
})

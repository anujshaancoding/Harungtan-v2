import { serializeProduct, type ProductRaw, type Product } from '@/types'

describe('serializeProduct', () => {
  const createRawProduct = (overrides: Partial<ProductRaw> = {}): ProductRaw => ({
    id: 'prod-1',
    name: 'Classic Round Neck T-Shirt',
    slug: 'classic-round-neck-t-shirt',
    description: 'A comfortable cotton t-shirt',
    price: 599,
    comparePrice: 999,
    category: 'round-neck',
    subcategory: null,
    gender: 'unisex',
    images: '["https://example.com/img1.jpg","https://example.com/img2.jpg"]',
    sizes: '["S","M","L","XL"]',
    colors: '["Black","White"]',
    material: '100% Cotton',
    careInfo: 'Machine wash cold',
    featured: true,
    bestseller: false,
    newArrival: true,
    stock: 50,
    rating: 4.5,
    reviewCount: 12,
    active: true,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-06-15T12:00:00Z'),
    ...overrides,
  })

  it('parses images JSON string into an array', () => {
    const raw = createRawProduct()
    const result = serializeProduct(raw)
    expect(result.images).toEqual([
      'https://example.com/img1.jpg',
      'https://example.com/img2.jpg',
    ])
  })

  it('parses sizes JSON string into an array', () => {
    const raw = createRawProduct()
    const result = serializeProduct(raw)
    expect(result.sizes).toEqual(['S', 'M', 'L', 'XL'])
  })

  it('parses colors JSON string into an array', () => {
    const raw = createRawProduct()
    const result = serializeProduct(raw)
    expect(result.colors).toEqual(['Black', 'White'])
  })

  it('converts createdAt Date to ISO string', () => {
    const raw = createRawProduct()
    const result = serializeProduct(raw)
    expect(result.createdAt).toBe('2025-01-01T00:00:00.000Z')
    expect(typeof result.createdAt).toBe('string')
  })

  it('converts updatedAt Date to ISO string', () => {
    const raw = createRawProduct()
    const result = serializeProduct(raw)
    expect(result.updatedAt).toBe('2025-06-15T12:00:00.000Z')
    expect(typeof result.updatedAt).toBe('string')
  })

  it('preserves all other fields unchanged', () => {
    const raw = createRawProduct()
    const result = serializeProduct(raw)
    expect(result.id).toBe('prod-1')
    expect(result.name).toBe('Classic Round Neck T-Shirt')
    expect(result.slug).toBe('classic-round-neck-t-shirt')
    expect(result.description).toBe('A comfortable cotton t-shirt')
    expect(result.price).toBe(599)
    expect(result.comparePrice).toBe(999)
    expect(result.category).toBe('round-neck')
    expect(result.subcategory).toBeNull()
    expect(result.gender).toBe('unisex')
    expect(result.material).toBe('100% Cotton')
    expect(result.careInfo).toBe('Machine wash cold')
    expect(result.featured).toBe(true)
    expect(result.bestseller).toBe(false)
    expect(result.newArrival).toBe(true)
    expect(result.stock).toBe(50)
    expect(result.rating).toBe(4.5)
    expect(result.reviewCount).toBe(12)
    expect(result.active).toBe(true)
  })

  it('handles empty arrays in JSON fields', () => {
    const raw = createRawProduct({
      images: '[]',
      sizes: '[]',
      colors: '[]',
    })
    const result = serializeProduct(raw)
    expect(result.images).toEqual([])
    expect(result.sizes).toEqual([])
    expect(result.colors).toEqual([])
  })

  it('returns a Product type with correct shape', () => {
    const raw = createRawProduct()
    const result: Product = serializeProduct(raw)
    expect(Array.isArray(result.images)).toBe(true)
    expect(Array.isArray(result.sizes)).toBe(true)
    expect(Array.isArray(result.colors)).toBe(true)
    expect(typeof result.createdAt).toBe('string')
    expect(typeof result.updatedAt).toBe('string')
  })
})

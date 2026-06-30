export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  category: string
  subcategory: string | null
  gender: string
  images: string[]
  sizes: string[]
  colors: string[]
  sizeStock: Record<string, number> | null
  material: string | null
  careInfo: string | null
  featured: boolean
  bestseller: boolean
  newArrival: boolean
  stock: number
  rating: number
  reviewCount: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductRaw {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  category: string
  subcategory: string | null
  gender: string
  images: string
  sizes: string
  colors: string
  sizeStock: string | null
  material: string | null
  careInfo: string | null
  featured: boolean
  bestseller: boolean
  newArrival: boolean
  stock: number
  rating: number
  reviewCount: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface OrderStatusEvent {
  status: string
  timestamp: string
}

export interface Order {
  id: string
  userId?: string
  status: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  discount: number
  paymentStatus: string
  paymentMethod: string | null
  shippingAddress: string
  billingAddress?: string | null
  trackingNumber: string | null
  statusHistory: OrderStatusEvent[]
  estimatedDelivery: string | null
  createdAt: string
  updatedAt?: string
  items: OrderItem[]
  user?: {
    name: string | null
    email: string
  }
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  size: string
  color: string
  product: {
    name: string
    slug: string
    images: string
  }
}

export interface ReviewImage {
  id: string
  imageUrl: string
  sortOrder: number
}

export interface Review {
  id: string
  rating: number
  title: string | null
  comment: string | null
  verified: boolean
  helpfulCount: number
  createdAt: string
  images: ReviewImage[]
  user: {
    name: string | null
    image: string | null
  }
  userVote?: boolean | null
}

export interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface FilterParams {
  category?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  sort?: string
  search?: string
  page?: number
  limit?: number
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  tags: string[]
  published: boolean
  authorId: string
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  readTime: number
  createdAt: string
  updatedAt: string
  author?: {
    name: string | null
    image: string | null
  }
}

export interface PostRaw {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  tags: string
  published: boolean
  authorId: string
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string | null
  readTime: number
  createdAt: Date
  updatedAt: Date
  author?: {
    name: string | null
    image: string | null
  }
}

export interface Coupon {
  id: string
  code: string
  description: string | null
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue: number | null
  maxDiscount: number | null
  usageLimit: number | null
  usedCount: number
  validFrom: string
  validUntil: string | null
  active: boolean
}

export interface FlashSale {
  id: string
  title: string
  productId: string | null
  category: string | null
  discount: number
  startsAt: string
  endsAt: string
  active: boolean
  product?: Product
}

export interface StockNotification {
  id: string
  email: string
  productId: string
  size: string
  notified: boolean
  createdAt: string
}

export interface CustomerTag {
  id: string
  name: string
  color: string
}

export interface ABTest {
  id: string
  name: string
  description: string | null
  variantA: string
  variantB: string
  traffic: number
  active: boolean
  createdAt: string
}

export interface HomeSection {
  id: string
  type: string
  title: string | null
  config: string
  sortOrder: number
  active: boolean
}

export function serializePost(post: PostRaw): Post {
  return {
    ...post,
    tags: JSON.parse(post.tags || '[]'),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }
}

export function serializeProduct(product: ProductRaw): Product {
  return {
    ...product,
    images: JSON.parse(product.images),
    sizes: JSON.parse(product.sizes),
    colors: JSON.parse(product.colors),
    sizeStock: product.sizeStock ? JSON.parse(product.sizeStock) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be')
}

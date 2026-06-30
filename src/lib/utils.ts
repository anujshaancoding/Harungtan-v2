export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getDiscountPercentage(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

export function parseJsonField(field: string): string[] {
  try {
    return JSON.parse(field)
  } catch {
    return []
  }
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
export const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#059669' },
  { name: 'Olive', hex: '#65713A' },
  { name: 'Maroon', hex: '#7F1D1D' },
  { name: 'Beige', hex: '#D4C5A9' },
  { name: 'Mustard', hex: '#CA8A04' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Lavender', hex: '#A78BFA' },
  { name: 'Teal', hex: '#0D9488' },
]

export const CATEGORIES = [
  { name: 'Round Neck', slug: 'round-neck' },
  { name: 'V-Neck', slug: 'v-neck' },
  { name: 'Polo', slug: 'polo' },
  { name: 'Henley', slug: 'henley' },
  { name: 'Oversized', slug: 'oversized' },
  { name: 'Crop Top', slug: 'crop-top' },
  { name: 'Graphic Tees', slug: 'graphic-tees' },
  { name: 'Plain', slug: 'plain' },
  { name: 'Printed', slug: 'printed' },
  { name: 'Acid Wash', slug: 'acid-wash' },
]

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Processing', color: 'bg-indigo-100 text-indigo-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  returned: { label: 'Returned', color: 'bg-gray-100 text-gray-800' },
}

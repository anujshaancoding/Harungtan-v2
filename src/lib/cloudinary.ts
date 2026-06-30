/**
 * Cloudinary URL helper utilities for Harungtan.
 *
 * Usage:
 *   import { cloudinaryUrl, cloudinaryLoader } from '@/lib/cloudinary'
 *
 *   // Basic optimized URL
 *   cloudinaryUrl('products/tshirt-black-front')
 *   // → https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/v1/harungtan/products/tshirt-black-front
 *
 *   // With explicit transforms
 *   cloudinaryUrl('products/tshirt-black-front', { width: 400, height: 500, crop: 'fill' })
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
const BASE_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || 'harungtan'

interface CloudinaryOptions {
  /** Width in pixels */
  width?: number
  /** Height in pixels */
  height?: number
  /** Crop mode: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale' */
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale'
  /** Gravity for crop: 'auto' | 'face' | 'center' */
  gravity?: 'auto' | 'face' | 'center'
  /** Quality: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number (1-100) */
  quality?: string | number
  /** Format: 'auto' | 'webp' | 'avif' | 'png' | 'jpg' */
  format?: string
  /** DPR (device pixel ratio): 'auto' | number */
  dpr?: string | number
}

/**
 * Build a fully-qualified Cloudinary delivery URL.
 *
 * @param publicId  The image public ID (without the base folder prefix).
 *                  e.g. 'products/tshirt-black-front'
 * @param options   Optional transformation parameters.
 * @returns         Full Cloudinary URL string.
 */
export function cloudinaryUrl(publicId: string, options: CloudinaryOptions = {}): string {
  if (!CLOUD_NAME) {
    // Fallback: return the publicId as-is so local/dev still works with local images
    return publicId
  }

  const transforms: string[] = []

  // Always auto-format and auto-quality unless explicitly overridden
  transforms.push(`f_${options.format || 'auto'}`)
  transforms.push(`q_${options.quality || 'auto'}`)

  if (options.width) transforms.push(`w_${options.width}`)
  if (options.height) transforms.push(`h_${options.height}`)
  if (options.crop) transforms.push(`c_${options.crop}`)
  if (options.gravity) transforms.push(`g_${options.gravity}`)
  if (options.dpr) transforms.push(`dpr_${options.dpr}`)

  const transformStr = transforms.join(',')
  const folder = BASE_FOLDER ? `${BASE_FOLDER}/` : ''

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}/v1/${folder}${publicId}`
}

/**
 * Next.js Image loader for Cloudinary.
 * Use with the `loader` prop on next/image:
 *
 *   <Image loader={cloudinaryLoader} src="products/tshirt-front" ... />
 *
 * Or set globally in next.config.ts via `images.loader`.
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  return cloudinaryUrl(src, {
    width,
    quality: quality || 'auto',
    crop: 'limit',
    format: 'auto',
  })
}

/**
 * Generate a srcSet-ready array of URLs for responsive images.
 *
 * @param publicId  Image public ID
 * @param widths    Array of widths (default common breakpoints)
 * @returns         Array of { url, width } objects
 */
export function cloudinaryResponsive(
  publicId: string,
  widths: number[] = [320, 480, 640, 768, 1024, 1280]
): { url: string; width: number }[] {
  return widths.map((w) => ({
    url: cloudinaryUrl(publicId, { width: w, crop: 'limit' }),
    width: w,
  }))
}

/**
 * Product image helper — returns optimized URLs for product listing cards.
 */
export function productCardImage(publicId: string): string {
  return cloudinaryUrl(publicId, {
    width: 600,
    height: 800,
    crop: 'fill',
    gravity: 'auto',
  })
}

/**
 * Product image helper — returns optimized URL for product detail page.
 */
export function productDetailImage(publicId: string): string {
  return cloudinaryUrl(publicId, {
    width: 1200,
    height: 1600,
    crop: 'limit',
  })
}

/**
 * Thumbnail helper — small square crops for cart, order history, etc.
 */
export function thumbnailImage(publicId: string, size: number = 150): string {
  return cloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
  })
}

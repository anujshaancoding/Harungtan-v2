import type { Metadata } from 'next'
import { generateProductJsonLd, generateBreadcrumbJsonLd } from '@/lib/structured-data'
import SingleProductClient from './SingleProductClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'no-store',
    })

    if (res.ok) {
      const product = await res.json()
      return {
        title: `${product.name} | Harungtan`,
        description: product.description,
        openGraph: {
          title: `${product.name} | Harungtan`,
          description: product.description,
          images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        },
      }
    }
  } catch {
    // Fallback metadata
  }

  return {
    title: `${slug.replace(/-/g, ' ')} | Harungtan`,
    description: `Shop ${slug.replace(/-/g, ' ')} at Harungtan. Premium quality t-shirts with free shipping on orders above Rs. 999.`,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let productJsonLd = null
  let breadcrumbJsonLd = null

  try {
    const fetchUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${fetchUrl}/api/products/${slug}`, {
      cache: 'no-store',
    })

    if (res.ok) {
      const product = await res.json()
      productJsonLd = generateProductJsonLd(product)
      breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: 'Home', url: baseUrl },
        { name: 'Products', url: `${baseUrl}/products` },
        { name: product.name, url: `${baseUrl}/products/${slug}` },
      ])
    }
  } catch {
    // Fallback: no structured data if fetch fails
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <SingleProductClient slug={slug} />
    </>
  )
}

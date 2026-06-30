import type { Metadata } from 'next'
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from '@/lib/structured-data'
import HeroSection from '@/components/home/HeroSection'
import CategorySection from '@/components/home/CategorySection'
import EditorialSection from '@/components/home/EditorialSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BestsellerSection from '@/components/home/BestsellerSection'
import TestimonialSection from '@/components/home/TestimonialSection'
import InstagramFeed from '@/components/home/InstagramFeed'
import NewsletterSection from '@/components/home/NewsletterSection'
import RecentlyViewed from '@/components/products/RecentlyViewed'
import { AIRecommendations } from '@/components/products/AIRecommendations'

export const metadata: Metadata = {
  title: 'Harungtan — Premium T-Shirts for Men & Women | Made in India',
  description:
    'Shop premium quality t-shirts crafted for comfort and style. Round neck, V-neck, polo, henley, oversized & graphic tees. Free shipping over ₹999.',
  keywords: [
    'Harungtan',
    't-shirts',
    'premium tees',
    'men t-shirts',
    'women t-shirts',
    'round neck',
    'polo t-shirts',
    'oversized t-shirts',
    'graphic tees',
    'made in India',
    'cotton t-shirts',
  ],
  openGraph: {
    title: 'Harungtan — Premium T-Shirts for Men & Women',
    description:
      'Premium quality t-shirts crafted for comfort and style. Made in India, worn worldwide.',
    type: 'website',
    siteName: 'Harungtan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harungtan — Premium T-Shirts for Men & Women',
    description:
      'Premium quality t-shirts crafted for comfort and style. Made in India, worn worldwide.',
  },
}

export default function HomePage() {
  const organizationJsonLd = generateOrganizationJsonLd()
  const websiteJsonLd = generateWebsiteJsonLd()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroSection />
      <CategorySection />
      <EditorialSection />
      <FeaturedProducts />
      <BestsellerSection />
      <TestimonialSection />
      <InstagramFeed />
      <RecentlyViewed />
      <AIRecommendations />
      <NewsletterSection />
    </main>
  )
}

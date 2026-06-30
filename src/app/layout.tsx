import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Harungtan - Premium T-Shirts for Men & Women',
    template: '%s | Harungtan',
  },
  description:
    'Discover premium quality t-shirts at Harungtan. Shop our collection of round neck, v-neck, polo, oversized, and graphic tees for men and women. Made in India with 100% cotton. Free shipping on orders above ₹999.',
  keywords: [
    'Harungtan',
    't-shirts',
    'premium t-shirts',
    'men t-shirts',
    'women t-shirts',
    'round neck',
    'v-neck',
    'polo',
    'oversized',
    'graphic tees',
    'cotton t-shirts',
    'made in India',
    'online shopping',
  ],
  authors: [{ name: 'Harungtan' }],
  creator: 'Harungtan',
  publisher: 'Harungtan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Harungtan',
    title: 'Harungtan - Premium T-Shirts for Men & Women',
    description:
      'Discover premium quality t-shirts at Harungtan. Made in India with 100% cotton.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Harungtan - Premium T-Shirts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harungtan - Premium T-Shirts for Men & Women',
    description:
      'Discover premium quality t-shirts at Harungtan. Made in India with 100% cotton.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A1A1A" />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('harungtan-theme');
            if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          } catch(e) {}
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

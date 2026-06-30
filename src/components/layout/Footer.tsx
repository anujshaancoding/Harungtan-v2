'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, MapPin, ArrowRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const shopLinks = [
  { label: 'Men', href: '/products?gender=men' },
  { label: 'Women', href: '/products?gender=women' },
  { label: 'New Arrivals', href: '/products?newArrival=true' },
  { label: 'Bestsellers', href: '/products?bestseller=true' },
]

const helpLinks = [
  { label: 'Help & FAQ', href: '/help' },
  { label: 'About Us', href: '/about' },
  { label: 'Stories', href: '/stories' },
  { label: 'Guidelines', href: '/guidelines' },
  { label: 'Track Order', href: '/profile/orders' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Return Policy', href: '/return-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Logo
              size="lg"
              className="text-white"
              iconClassName="h-7 w-7"
              textClassName="text-2xl"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/40 max-w-sm">
              Premium quality clothing designed for the modern individual.
              Crafted with care, worn with confidence. Elevate your everyday
              style.
            </p>

            {/* Social Media */}
            <div className="mt-7 flex items-center gap-4">
              {[
                { icon: Instagram, href: 'https://instagram.com/harungtan', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com/harungtan', label: 'Facebook' },
                { icon: Twitter, href: 'https://twitter.com/harungtan', label: 'Twitter / X' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/40 transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
              <a
                href="https://pinterest.com/harungtan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/40 transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                aria-label="Pinterest"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/40 transition-colors duration-200 hover:text-white"
                  >
                    <ArrowRight size={10} className="opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-5">
              Help
            </h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/40 transition-colors duration-200 hover:text-white"
                  >
                    <ArrowRight size={10} className="opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/40 transition-colors duration-200 hover:text-white"
                  >
                    <ArrowRight size={10} className="opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-[11px] text-white/30 tracking-wide">
              &copy; {new Date().getFullYear()} Harungtan. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-white/30 mr-1">We accept:</span>
              {['Visa', 'Mastercard', 'UPI', 'Rupay'].map((method) => (
                <span
                  key={method}
                  className="border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/30 tracking-wide"
                >
                  {method}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-white/30 tracking-wide">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

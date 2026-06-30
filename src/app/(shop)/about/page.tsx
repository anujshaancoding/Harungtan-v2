import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Heart, Leaf, Award, MapPin, Users, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Harungtan',
  description:
    'Discover the story behind Harungtan. Born from the belief that every t-shirt tells a story. Premium quality, sustainably made clothing from India.',
}

const values = [
  {
    icon: Award,
    title: 'Uncompromising Quality',
    description:
      'Every piece is crafted from premium fabrics, rigorously tested for comfort, durability, and colorfastness. We believe great clothing should last.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Practices',
    description:
      'From eco-friendly dyes to reduced-waste patterns and recyclable packaging, sustainability is woven into everything we do.',
  },
  {
    icon: Heart,
    title: 'Ethical Production',
    description:
      'Fair wages, safe working conditions, and respect for every hand that touches our garments. Our workers are our greatest asset.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'We are building more than a brand. We are building a community of individuals who express themselves through what they wear.',
  },
  {
    icon: MapPin,
    title: 'Proudly Made in India',
    description:
      'Designed, developed, and manufactured in India. We celebrate Indian craftsmanship and contribute to the local textile ecosystem.',
  },
  {
    icon: Sparkles,
    title: 'Accessible Style',
    description:
      'Premium quality should not come with a premium price tag. We cut out the middlemen to bring you exceptional value.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="bg-[var(--foreground)] text-white">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-400">
            <Link href="/" className="hover-underline transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight size={14} strokeWidth={1.5} className="text-neutral-600" />
            <span className="font-medium text-white">About</span>
          </nav>

          <h1 className="heading-editorial text-4xl sm:text-6xl">
            Our Story
          </h1>
          <div className="divider-accent mt-6 mb-0" />
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
            Born from the belief that every t-shirt tells a story.
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="prose prose-neutral max-w-none prose-headings:heading-editorial prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5 prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed">
          <h2>The Beginning</h2>
          <p>
            Harungtan was born from a simple frustration: finding quality
            basics that look great, feel incredible, and do not break the bank
            was nearly impossible. Too often, we settled for fast fashion that
            fell apart after a few washes or overpaid for brand names that did
            not justify the price.
          </p>
          <p>
            We set out to change that. Starting from a small studio in India,
            Harungtan began as a mission to create the perfect t-shirt -- one
            that combines premium fabric, thoughtful design, and honest pricing.
            What started as a passion project quickly grew into something much
            bigger.
          </p>

          <h2>Our Mission</h2>
          <p>
            At Harungtan, our mission is simple: to empower people to express
            themselves through clothing that is as exceptional as they are.
            We believe that what you wear should make you feel confident,
            comfortable, and connected to something meaningful.
          </p>
          <p>
            We are not chasing trends. We are building timeless pieces that
            become staples in your wardrobe. Every color is carefully selected,
            every stitch is intentional, and every piece is designed to be worn
            again and again.
          </p>

          <h2>Quality Without Compromise</h2>
          <p>
            We obsess over the details so you do not have to. Our fabrics are
            sourced from the finest mills in India -- 100% combed cotton that
            is pre-shrunk, bio-washed, and enzyme-treated for a buttery-soft
            feel from day one. We test every batch for colorfastness, pilling
            resistance, and dimensional stability.
          </p>
          <p>
            Our production partners are carefully vetted and regularly audited.
            We work with a small network of trusted manufacturers who share our
            commitment to quality, fair labor practices, and environmental
            responsibility.
          </p>

          <h2>Sustainability at Our Core</h2>
          <p>
            We recognize the fashion industry&apos;s impact on the planet, and
            we are committed to being part of the solution. Our sustainability
            efforts include:
          </p>
          <ul>
            <li>Water-efficient dyeing processes that reduce water usage by up to 50%</li>
            <li>Eco-friendly, non-toxic reactive dyes</li>
            <li>Zero-waste pattern cutting techniques</li>
            <li>Recyclable packaging made from post-consumer materials</li>
            <li>Carbon-neutral shipping through offset partnerships</li>
            <li>A take-back program for worn Harungtan garments (coming soon)</li>
          </ul>
          <p>
            We are not perfect, and we do not claim to be. But every day, we
            are working to make better choices for the planet while delivering
            the quality you deserve.
          </p>

          <h2>Made in India, for Everyone</h2>
          <p>
            India has one of the richest textile traditions in the world, and
            we are proud to be a part of it. Harungtan is designed, developed,
            and manufactured entirely in India. By keeping our supply chain
            local, we create jobs, support communities, and reduce our carbon
            footprint.
          </p>
          <p>
            Every Harungtan piece carries the skill and dedication of Indian
            artisans and workers who bring our vision to life. When you wear
            Harungtan, you are wearing a piece of Indian craftsmanship.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="bg-[var(--muted)]">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="subheading text-center mb-3">Our Values</p>
          <h2 className="heading-editorial mb-12 text-center text-3xl text-[var(--foreground)]">
            What We Stand For
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="border border-[var(--border)] bg-white p-6 hover-lift transition-all"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center bg-[var(--foreground)] text-white">
                  <value.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="subheading mb-2">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder / Team Section */}
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="subheading text-center mb-3">The People</p>
        <h2 className="heading-editorial mb-12 text-center text-3xl text-[var(--foreground)]">
          The Team Behind Harungtan
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: 'Founder',
              role: 'CEO & Creative Director',
              description:
                'Visionary behind Harungtan with a passion for quality clothing and sustainable fashion.',
            },
            {
              name: 'Co-Founder',
              role: 'Head of Operations',
              description:
                'Ensures every order is fulfilled with care, from warehouse to your doorstep.',
            },
            {
              name: 'Design Lead',
              role: 'Head of Design',
              description:
                'Brings creative ideas to life, crafting designs that balance style and comfort.',
            },
          ].map((member) => (
            <div key={member.role} className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center bg-[var(--muted)]">
                <Users size={32} strokeWidth={1.5} className="text-[var(--muted-foreground)]" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
                {member.name}
              </h3>
              <p className="subheading mt-1">{member.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[var(--foreground)] text-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="heading-editorial text-3xl sm:text-4xl">
            Join the Harungtan Family
          </h2>
          <div className="divider-accent mx-auto mt-6 mb-0" />
          <p className="mx-auto mt-6 max-w-lg text-neutral-400">
            Discover clothing that is designed to last, made responsibly, and
            priced fairly. Your wardrobe upgrade starts here.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="btn-accent inline-flex items-center px-8 py-3 text-sm font-medium uppercase tracking-wider"
            >
              Shop Now
            </Link>
            <Link
              href="/help"
              className="btn-outline inline-flex items-center border-white/20 px-8 py-3 text-sm font-medium uppercase tracking-wider text-white hover:bg-white/10"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

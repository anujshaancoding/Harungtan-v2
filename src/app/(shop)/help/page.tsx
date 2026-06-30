'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  ChevronDown,
  Search,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  ShoppingBag,
  Mail,
  Phone,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface FAQ {
  question: string
  answer: string
}

interface FAQSection {
  title: string
  icon: React.ElementType
  faqs: FAQ[]
}

const faqSections: FAQSection[] = [
  {
    title: 'Orders',
    icon: Package,
    faqs: [
      {
        question: 'How do I place an order?',
        answer:
          'Browse our collection, select your preferred size and color, add items to your cart, and proceed to checkout. You can pay using credit/debit cards, UPI, net banking, wallets, or Cash on Delivery.',
      },
      {
        question: 'Can I modify my order after placing it?',
        answer:
          'You can modify your order (change size, color, or quantity) only before it has been dispatched. Please contact our support team immediately at support@harungtan.com or call us.',
      },
      {
        question: 'How do I cancel my order?',
        answer:
          'You can cancel your order from the My Orders section in your profile, as long as it has not been shipped yet. Once shipped, you can refuse delivery or initiate a return after receiving the item.',
      },
      {
        question: 'How can I track my order?',
        answer:
          'After your order is shipped, you will receive a confirmation email and SMS with a tracking number. You can also track your order from the My Orders section in your account.',
      },
      {
        question: 'What if I receive the wrong item?',
        answer:
          'If you receive an incorrect item, please contact us within 48 hours of delivery with photos of the item received. We will arrange a free return pickup and send the correct item or issue a full refund.',
      },
    ],
  },
  {
    title: 'Shipping',
    icon: Truck,
    faqs: [
      {
        question: 'How long does delivery take?',
        answer:
          'Standard delivery takes 3-7 business days depending on your location. Metro cities typically receive orders in 3-5 days, while tier 2/3 cities and remote areas may take 5-10 business days.',
      },
      {
        question: 'Is shipping free?',
        answer:
          'Yes! We offer free standard shipping on all prepaid orders above \u20B9999. For orders below \u20B9999, a flat shipping fee of \u20B979 applies.',
      },
      {
        question: 'Do you offer Cash on Delivery (COD)?',
        answer:
          'Yes, COD is available for orders up to \u20B95,000 at most serviceable pin codes across India. An additional COD handling fee of \u20B949 applies.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Currently, we ship only within India. We are working on expanding internationally. Please contact us at support@harungtan.com for special international requests.',
      },
      {
        question: 'What happens if I am not available for delivery?',
        answer:
          'Our shipping partners make up to 3 delivery attempts. If all attempts fail, the package is returned to our warehouse. Prepaid orders will be refunded, and COD orders will be cancelled.',
      },
    ],
  },
  {
    title: 'Returns',
    icon: RotateCcw,
    faqs: [
      {
        question: 'What is your return policy?',
        answer:
          'We offer a 7-day return window from the date of delivery. Items must be unused, unworn, with original tags and packaging intact. Visit our Return Policy page for complete details.',
      },
      {
        question: 'How do I initiate a return?',
        answer:
          'Log in to your account, go to My Orders, select the order, and click "Request Return." Choose your reason, select pickup or self-ship, and follow the instructions.',
      },
      {
        question: 'Are there any items that cannot be returned?',
        answer:
          'Yes. Innerwear, customized items, final sale/clearance items, gift cards, altered items, and free promotional gifts cannot be returned.',
      },
      {
        question: 'Can I exchange an item instead of returning it?',
        answer:
          'Yes, we offer exchanges for different sizes or colors, subject to availability. Select "Exchange" when initiating your return and specify the desired variant.',
      },
      {
        question: 'Who pays for return shipping?',
        answer:
          'Return shipping is free for defective, damaged, or incorrect items. For change-of-mind returns, a flat fee of \u20B999 is deducted from your refund.',
      },
    ],
  },
  {
    title: 'Payment',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept Visa, Mastercard, RuPay debit/credit cards, UPI (Google Pay, PhonePe, Paytm), net banking, wallets, and Cash on Delivery.',
      },
      {
        question: 'Is my payment information secure?',
        answer:
          'Absolutely. All payments are processed through PCI DSS-compliant, secure payment gateways. We never store your complete card details on our servers.',
      },
      {
        question: 'My payment was deducted but the order was not confirmed. What should I do?',
        answer:
          'This can happen due to a temporary gateway issue. The amount will be automatically refunded within 5-7 business days. If not, contact us with your transaction ID.',
      },
      {
        question: 'Can I use multiple payment methods for one order?',
        answer:
          'Currently, you can use one payment method per order. However, you can combine store credit or gift card balance with another payment method.',
      },
      {
        question: 'Do you offer EMI options?',
        answer:
          'EMI options may be available on select credit cards for orders above a certain value. Available EMI plans will be displayed at checkout if your card is eligible.',
      },
    ],
  },
  {
    title: 'Account',
    icon: User,
    faqs: [
      {
        question: 'How do I create an account?',
        answer:
          'Click "Sign Up" at the top of our website. You can register using your email address or sign up with Google for a faster process.',
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer:
          'Click "Forgot Password" on the login page, enter your registered email address, and follow the instructions in the reset email to create a new password.',
      },
      {
        question: 'Can I place an order without creating an account?',
        answer:
          'Currently, you need an account to place orders. This allows us to provide order tracking, easy returns, and a personalized shopping experience.',
      },
      {
        question: 'How do I update my profile information?',
        answer:
          'Log in to your account and visit the Profile section. Click "Edit" to update your name, phone number, or other details.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'You can request account deletion from Settings in your profile. This will permanently remove all your personal data, order history, and saved addresses.',
      },
    ],
  },
  {
    title: 'Products',
    icon: ShoppingBag,
    faqs: [
      {
        question: 'How do I find the right size?',
        answer:
          'Each product page includes a detailed size guide with measurements in inches and centimeters. We recommend measuring yourself and comparing with our size chart for the best fit.',
      },
      {
        question: 'What materials are your t-shirts made of?',
        answer:
          'We use premium quality fabrics including 100% combed cotton, cotton-polyester blends, and tri-blends. Material details are listed on each product page.',
      },
      {
        question: 'How should I care for my Harungtan clothing?',
        answer:
          'Wash in cold water with similar colors, use mild detergent, avoid bleach, and tumble dry on low or hang dry. Specific care instructions are on each product tag and product page.',
      },
      {
        question: 'Are the product colors accurate on the website?',
        answer:
          'We make every effort to display colors as accurately as possible. However, actual colors may vary slightly due to screen settings and lighting conditions in product photography.',
      },
      {
        question: 'Do you restock sold-out items?',
        answer:
          'Popular items are regularly restocked. You can click "Notify Me" on any sold-out product page to receive an email alert when it is back in stock.',
      },
    ],
  },
]

function FAQAccordion({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[var(--accent)]"
      >
        <span className={cn('text-sm', isOpen ? 'font-semibold text-[var(--foreground)]' : 'text-[var(--muted-foreground)]')}>
          {faq.question}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={cn(
            'shrink-0 ml-4 text-[var(--muted-foreground)] transition-transform duration-200',
            isOpen && 'rotate-180 text-[var(--accent)]'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        )}
      >
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{faq.answer}</p>
      </div>
    </div>
  )
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredSections = searchQuery.trim()
    ? faqSections
        .map((section) => ({
          ...section,
          faqs: section.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((section) => section.faqs.length > 0)
    : faqSections

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      setSent(true)
      setContactForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      // silently fail
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--border)]" />
          <span className="font-medium text-[var(--foreground)]">Help Center</span>
        </nav>

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="heading-editorial text-4xl text-[var(--foreground)] sm:text-5xl">
            Help Center
          </h1>
          <div className="divider-accent mx-auto mt-5 mb-0" />
          <p className="mt-5 text-[var(--muted-foreground)]">
            Find answers to your questions or reach out to our support team.
          </p>
        </header>

        {/* Search */}
        <div className="mx-auto mb-14 max-w-xl">
          <Input
            type="search"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputSize="lg"
          />
        </div>

        {/* FAQ Sections */}
        {filteredSections.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[var(--muted-foreground)]">
              No results found for &quot;{searchQuery}&quot;. Try a different
              search term or contact us below.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredSections.map((section) => (
              <div
                key={section.title}
                className="border border-[var(--border)] bg-white"
              >
                <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-4">
                  <section.icon size={20} strokeWidth={1.5} className="text-[var(--accent)]" />
                  <h2 className="subheading text-sm">
                    {section.title}
                  </h2>
                </div>
                <div className="px-6">
                  {section.faqs.map((faq, index) => {
                    const key = `${section.title}-${index}`
                    return (
                      <FAQAccordion
                        key={key}
                        faq={faq}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggleItem(key)}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-20 border-t border-[var(--border)] pt-16">
          <p className="subheading text-center mb-3">Support</p>
          <h2 className="heading-editorial mb-2 text-center text-3xl text-[var(--foreground)]">
            Still Need Help?
          </h2>
          <div className="divider-accent mx-auto mt-4 mb-0" />
          <p className="mb-10 mt-5 text-center text-[var(--muted-foreground)]">
            Our support team is here to assist you.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-[var(--muted)]">
                    <Mail size={20} strokeWidth={1.5} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">Email Us</p>
                    <a
                      href="mailto:support@harungtan.com"
                      className="text-sm text-[var(--muted-foreground)] hover-underline transition-colors hover:text-[var(--foreground)]"
                    >
                      support@harungtan.com
                    </a>
                  </div>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  We respond to all emails within 24 hours during business days.
                </p>
              </div>

              <div className="border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-[var(--muted)]">
                    <Phone size={20} strokeWidth={1.5} className="text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">Call Us</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      +91-9000-000000
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Available Monday to Saturday, 10:00 AM - 6:00 PM IST.
                </p>
              </div>

              <div className="bg-[var(--muted)] p-6">
                <p className="subheading mb-3">
                  Quick Links
                </p>
                <div className="space-y-2">
                  <Link
                    href="/return-policy"
                    className="block text-sm text-[var(--muted-foreground)] hover-underline transition-colors hover:text-[var(--foreground)]"
                  >
                    Return Policy
                  </Link>
                  <Link
                    href="/refund-policy"
                    className="block text-sm text-[var(--muted-foreground)] hover-underline transition-colors hover:text-[var(--foreground)]"
                  >
                    Refund Policy
                  </Link>
                  <Link
                    href="/shipping-policy"
                    className="block text-sm text-[var(--muted-foreground)] hover-underline transition-colors hover:text-[var(--foreground)]"
                  >
                    Shipping Policy
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="block text-sm text-[var(--muted-foreground)] hover-underline transition-colors hover:text-[var(--foreground)]"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="border border-[var(--border)] p-6">
              <h3 className="heading-editorial mb-5 text-xl text-[var(--foreground)]">
                Send Us a Message
              </h3>
              {sent ? (
                <div className="bg-green-50 p-6 text-center">
                  <p className="text-sm font-semibold text-green-700">
                    Message sent successfully!
                  </p>
                  <p className="mt-1 text-xs text-green-600">
                    We will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-4 text-sm text-green-700 underline hover:no-underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    placeholder="Your name"
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    required
                  />
                  <Input
                    label="Subject"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder="What is this about?"
                    required
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                      Message
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      placeholder="Describe your issue or question..."
                      rows={4}
                      required
                      className="w-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={Send}
                    loading={sending}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Return Policy | Harungtan',
  description:
    'Learn about Harungtan\'s 7-day return policy, conditions for returns, and step-by-step return process.',
}

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--border)]" />
          <span className="font-medium text-[var(--foreground)]">Return Policy</span>
        </nav>

        {/* Header */}
        <header className="mb-14">
          <p className="subheading mb-4">Customer Care</p>
          <h1 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Return Policy
          </h1>
          <div className="divider-accent mt-6" />
          <p className="mt-4 text-sm tracking-wide text-[var(--muted-foreground)]">
            Last updated: March 1, 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-lg prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-li:text-[var(--muted-foreground)] prose-a:text-[var(--foreground)] prose-a:underline-offset-4 prose-strong:text-[var(--foreground)] prose-ul:marker:text-[var(--accent)]">
          <p>
            At Harungtan, we want you to love every piece you purchase. If for
            any reason you are not completely satisfied with your order, we
            offer a hassle-free return process within our return window. Please
            read the following guidelines carefully.
          </p>

          <h2>1. Return Window</h2>
          <p>
            You may initiate a return within <strong>7 days</strong> of
            receiving your order. The return window begins on the date of
            delivery as recorded by our shipping partner. Returns requested
            after the 7-day window will not be accepted.
          </p>

          <h2>2. Conditions for Return</h2>
          <p>
            To be eligible for a return, the item(s) must meet all of the
            following conditions:
          </p>
          <ul>
            <li>
              <strong>Unused and unworn:</strong> The item must not have been
              worn, washed, altered, or damaged by the customer.
            </li>
            <li>
              <strong>Original tags attached:</strong> All original tags,
              labels, and brand packaging must be intact and attached to the
              garment.
            </li>
            <li>
              <strong>Original packaging:</strong> The item must be returned in
              its original packaging, including the Harungtan polybag or box.
            </li>
            <li>
              <strong>No stains, odors, or marks:</strong> Items with perfume,
              deodorant, makeup stains, pet hair, or any foreign substance will
              not be accepted.
            </li>
            <li>
              <strong>Complete set:</strong> If the order included multiple
              items in a set or bundle, all items must be returned together.
            </li>
          </ul>

          <h2>3. Return Process</h2>
          <p>Follow these simple steps to initiate a return:</p>
          <ol>
            <li>
              <strong>Log in to your account</strong> and navigate to{' '}
              <Link href="/profile/orders">My Orders</Link>.
            </li>
            <li>
              <strong>Select the order</strong> containing the item(s) you wish
              to return and click &quot;Request Return.&quot;
            </li>
            <li>
              <strong>Choose the reason for return</strong> and provide any
              additional details. Upload photos if the item is defective or
              damaged.
            </li>
            <li>
              <strong>Select your preferred return method:</strong>
              <ul>
                <li>
                  <strong>Pickup:</strong> Schedule a pickup from your address.
                  Our logistics partner will collect the package within 2-3
                  business days.
                </li>
                <li>
                  <strong>Self-ship:</strong> Drop off the package at the
                  nearest courier partner location. Shipping labels will be
                  provided via email.
                </li>
              </ul>
            </li>
            <li>
              <strong>Pack the item securely</strong> in its original packaging.
              Include the return authorization slip (sent to your email) inside
              the package.
            </li>
            <li>
              <strong>Hand over the package</strong> to the pickup agent or drop
              it off. You will receive a tracking number for the return
              shipment.
            </li>
          </ol>

          <h2>4. Non-Returnable Items</h2>
          <p>
            The following items are not eligible for return under any
            circumstances:
          </p>
          <ul>
            <li>Innerwear and undergarments (for hygiene reasons)</li>
            <li>Customized or personalized items</li>
            <li>Items purchased during final sale or clearance promotions marked as &quot;non-returnable&quot;</li>
            <li>Gift cards and vouchers</li>
            <li>Items that have been altered, tailored, or modified after delivery</li>
            <li>Free promotional items or gifts received with orders</li>
          </ul>

          <h2>5. Defective or Damaged Items</h2>
          <p>
            If you receive a defective, damaged, or incorrect item, please
            contact us within <strong>48 hours</strong> of delivery. We will
            arrange a free return pickup and provide a full replacement or
            refund. Please keep the original packaging and include photographs
            of the defect or damage when filing your request.
          </p>

          <h2>6. Exchange Policy</h2>
          <p>
            We currently offer exchanges for size and color variations,
            subject to availability. To request an exchange:
          </p>
          <ul>
            <li>Follow the standard return process and select &quot;Exchange&quot; as the reason</li>
            <li>Specify the desired size or color</li>
            <li>If the requested item is available, we will ship the replacement once we receive your return</li>
            <li>If the requested item is out of stock, you will receive a full refund</li>
          </ul>
          <p>
            Exchange shipments are processed within 2-3 business days after we
            receive and verify the returned item.
          </p>

          <h2>7. Return Shipping Costs</h2>
          <ul>
            <li>
              <strong>Defective/damaged/wrong items:</strong> Return shipping
              is completely free. Harungtan bears the full cost.
            </li>
            <li>
              <strong>Change of mind / size or color exchange:</strong> A flat
              return shipping fee of &#8377;99 will be deducted from your
              refund amount.
            </li>
          </ul>

          <h2>8. Refund After Return</h2>
          <p>
            Once your return is received and inspected, we will process your
            refund. Please refer to our{' '}
            <Link href="/refund-policy">Refund Policy</Link> for detailed
            information on refund timelines and methods.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about our return policy or need
            assistance with a return, please reach out to us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:returns@harungtan.com">returns@harungtan.com</a>
            </li>
            <li>
              <strong>Phone:</strong> +91-9000-000000 (Mon-Sat, 10 AM - 6 PM IST)
            </li>
            <li>
              <strong>Help Center:</strong>{' '}
              <Link href="/help">Visit our Help Center</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund Policy | Harungtan',
  description:
    'Understand Harungtan\'s refund process, timelines, and methods. Learn about cancellations and partial refunds.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--border)]" />
          <span className="font-medium text-[var(--foreground)]">Refund Policy</span>
        </nav>

        {/* Header */}
        <header className="mb-14">
          <p className="subheading mb-4">Customer Care</p>
          <h1 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Refund Policy
          </h1>
          <div className="divider-accent mt-6" />
          <p className="mt-4 text-sm tracking-wide text-[var(--muted-foreground)]">
            Last updated: March 1, 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-lg prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-li:text-[var(--muted-foreground)] prose-a:text-[var(--foreground)] prose-a:underline-offset-4 prose-strong:text-[var(--foreground)] prose-ul:marker:text-[var(--accent)]">
          <p>
            At Harungtan, we strive to ensure every customer is satisfied with
            their purchase. This Refund Policy outlines the terms and
            conditions under which refunds are processed for eligible returns
            and cancellations.
          </p>

          <h2>1. Refund Eligibility</h2>
          <p>Refunds are issued in the following cases:</p>
          <ul>
            <li>
              The item is returned within the 7-day return window and meets all
              conditions outlined in our{' '}
              <Link href="/return-policy">Return Policy</Link>.
            </li>
            <li>
              The item received is defective, damaged, or materially different
              from what was ordered.
            </li>
            <li>
              The order is cancelled before it has been shipped (see
              Cancellation Policy below).
            </li>
            <li>
              A product is out of stock after order confirmation and cannot be
              fulfilled.
            </li>
          </ul>

          <h2>2. Refund Timeline</h2>
          <p>
            Once your return is received at our warehouse and passes quality
            inspection, the refund will be initiated within{' '}
            <strong>2-3 business days</strong>. The time it takes for the
            refund to reflect in your account depends on the original payment
            method:
          </p>

          <div className="not-prose my-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-[1.5px] border-[var(--foreground)]">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--foreground)]">
                    Payment Method
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--foreground)]">
                    Refund Timeline
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted-foreground)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Credit / Debit Card</td>
                  <td className="py-3">5-7 business days</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">UPI</td>
                  <td className="py-3">3-5 business days</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Net Banking</td>
                  <td className="py-3">5-7 business days</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Wallet</td>
                  <td className="py-3">2-3 business days</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Cash on Delivery (COD)</td>
                  <td className="py-3">7-10 business days (via bank transfer)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Please note that these timelines are estimates and may vary
            depending on your bank or payment provider. If you do not receive
            your refund within the expected timeframe, please contact your bank
            first, then reach out to us.
          </p>

          <h2>3. Refund Method</h2>
          <p>
            Refunds are always processed to the <strong>original payment
            method</strong> used at the time of purchase. We do not issue
            refunds in cash, cheque, or to a different payment method unless
            the original method is no longer available. In exceptional cases:
          </p>
          <ul>
            <li>
              If the original payment method is invalid or expired, we will
              issue a Harungtan store credit of equivalent value.
            </li>
            <li>
              For COD orders, refunds are processed via NEFT/IMPS bank
              transfer. You will be asked to provide your bank account details
              (account number, IFSC code, account holder name).
            </li>
          </ul>

          <h2>4. Partial Refunds</h2>
          <p>
            In certain situations, partial refunds may be issued:
          </p>
          <ul>
            <li>
              <strong>Return shipping deduction:</strong> For change-of-mind
              returns, a flat fee of &#8377;99 is deducted from the refund
              amount to cover return shipping costs.
            </li>
            <li>
              <strong>Items showing signs of use:</strong> If a returned item
              does not meet our return conditions but is still in acceptable
              condition, we may issue a partial refund of up to 50% of the
              item value at our discretion.
            </li>
            <li>
              <strong>Promotional or discounted items:</strong> Refunds for
              items purchased using discount codes or promotional offers will
              reflect the actual amount paid, not the original price.
            </li>
          </ul>

          <h2>5. Cancellation Policy</h2>
          <p>
            You may cancel an order under the following conditions:
          </p>

          <h3>Before Shipping</h3>
          <ul>
            <li>
              Orders can be cancelled free of charge at any time before the
              order status changes to &quot;Shipped.&quot;
            </li>
            <li>
              To cancel, go to{' '}
              <Link href="/profile/orders">My Orders</Link> and click
              &quot;Cancel Order,&quot; or contact our support team.
            </li>
            <li>
              Full refund will be processed within 3-5 business days.
            </li>
          </ul>

          <h3>After Shipping</h3>
          <ul>
            <li>
              Once an order has been shipped, it cannot be cancelled.
            </li>
            <li>
              You may refuse delivery, in which case the order will be treated
              as a return. Standard return shipping charges may apply.
            </li>
            <li>
              Alternatively, you may accept delivery and then initiate a
              return within the 7-day return window.
            </li>
          </ul>

          <h2>6. Failed or Stuck Transactions</h2>
          <p>
            If your payment was debited but the order was not confirmed (due to
            a payment gateway error or network issue), the amount will be
            automatically refunded within <strong>5-7 business days</strong>.
            If the refund is not received, please contact us with your
            transaction ID, and we will investigate with our payment partner.
          </p>

          <h2>7. Refund for Gift Cards and Store Credit</h2>
          <p>
            Gift cards and store credit are non-refundable and cannot be
            exchanged for cash. If an order paid partially or fully with store
            credit is returned, the store credit portion will be restored to
            your Harungtan account.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            For refund-related inquiries, please contact our support team:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:refunds@harungtan.com">refunds@harungtan.com</a>
            </li>
            <li>
              <strong>Phone:</strong> +91-9000-000000 (Mon-Sat, 10 AM - 6 PM IST)
            </li>
            <li>
              <strong>Help Center:</strong>{' '}
              <Link href="/help">Visit our Help Center</Link>
            </li>
          </ul>
          <p>
            Please have your order ID ready when contacting us to help
            expedite the process.
          </p>
        </div>
      </div>
    </div>
  )
}

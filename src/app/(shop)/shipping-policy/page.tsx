import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Policy | Harungtan',
  description:
    'Learn about Harungtan\'s shipping timelines, delivery charges, free shipping offers, COD availability, and tracking.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--border)]" />
          <span className="font-medium text-[var(--foreground)]">Shipping Policy</span>
        </nav>

        {/* Header */}
        <header className="mb-14">
          <p className="subheading mb-4">Customer Care</p>
          <h1 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Shipping Policy
          </h1>
          <div className="divider-accent mt-6" />
          <p className="mt-4 text-sm tracking-wide text-[var(--muted-foreground)]">
            Last updated: March 1, 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-lg prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-li:text-[var(--muted-foreground)] prose-a:text-[var(--foreground)] prose-a:underline-offset-4 prose-strong:text-[var(--foreground)] prose-ul:marker:text-[var(--accent)]">
          <p>
            At Harungtan, we want your new clothing to reach you as quickly
            and safely as possible. This Shipping Policy outlines everything
            you need to know about our delivery process, timelines, and
            charges.
          </p>

          <h2>1. Delivery Timelines</h2>
          <p>
            We aim to dispatch all orders within <strong>1-2 business
            days</strong> of order confirmation. Estimated delivery times after
            dispatch are as follows:
          </p>

          <div className="not-prose my-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-[1.5px] border-[var(--foreground)]">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--foreground)]">
                    Region
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--foreground)]">
                    Estimated Delivery
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted-foreground)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Metro Cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad)</td>
                  <td className="py-3">3-5 business days</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Tier 2 Cities</td>
                  <td className="py-3">4-6 business days</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Tier 3 Cities and Rural Areas</td>
                  <td className="py-3">5-7 business days</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Remote / Northeast India</td>
                  <td className="py-3">7-10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Please note that these are estimated timelines and actual delivery
            may vary due to factors such as public holidays, natural disasters,
            courier delays, or remote locations. We do not ship on Sundays and
            national holidays.
          </p>

          <h2>2. Shipping Charges</h2>

          <h3>Free Shipping</h3>
          <p>
            Enjoy <strong>free standard shipping</strong> on all prepaid orders
            above <strong>&#8377;999</strong> across India.
          </p>

          <h3>Standard Shipping</h3>
          <p>
            For orders below &#8377;999, a flat shipping fee of{' '}
            <strong>&#8377;79</strong> applies.
          </p>

          <h3>Cash on Delivery (COD) Charges</h3>
          <p>
            An additional COD handling fee of <strong>&#8377;49</strong> is
            applicable on Cash on Delivery orders, regardless of the order
            value.
          </p>

          <div className="not-prose my-8 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-[1.5px] border-[var(--foreground)]">
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--foreground)]">
                    Order Value
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-widest text-[var(--foreground)]">
                    Prepaid Shipping
                  </th>
                  <th className="py-3 text-left text-xs font-medium uppercase tracking-widest text-[var(--foreground)]">
                    COD Shipping
                  </th>
                </tr>
              </thead>
              <tbody className="text-[var(--muted-foreground)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Above &#8377;999</td>
                  <td className="py-3 pr-4 font-medium text-[var(--accent)]">Free</td>
                  <td className="py-3">&#8377;49 (COD fee only)</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-3 pr-4">Below &#8377;999</td>
                  <td className="py-3 pr-4">&#8377;79</td>
                  <td className="py-3">&#8377;79 + &#8377;49 COD fee</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>3. Cash on Delivery (COD)</h2>
          <p>
            Cash on Delivery is available for orders up to{' '}
            <strong>&#8377;5,000</strong> at most serviceable pin codes across
            India. COD availability depends on your delivery location and may
            not be available in certain areas. You can check COD availability
            by entering your pin code at checkout.
          </p>
          <p>
            Please keep the exact amount ready at the time of delivery as our
            delivery partners may not carry change.
          </p>

          <h2>4. Order Tracking</h2>
          <p>
            Once your order has been dispatched, you will receive a shipping
            confirmation email and SMS with your tracking number and a link to
            track your shipment in real time. You can also track your order by:
          </p>
          <ul>
            <li>
              Logging in to your account and visiting{' '}
              <Link href="/profile/orders">My Orders</Link>
            </li>
            <li>
              Using the tracking number on our shipping partner&apos;s website
            </li>
            <li>
              Contacting our support team with your order ID
            </li>
          </ul>

          <h2>5. Shipping Partners</h2>
          <p>
            We work with India&apos;s leading logistics partners to ensure
            safe and timely delivery, including:
          </p>
          <ul>
            <li>Delhivery</li>
            <li>BlueDart</li>
            <li>DTDC</li>
            <li>Ecom Express</li>
            <li>India Post (for select remote locations)</li>
          </ul>
          <p>
            The shipping partner assigned to your order may vary based on your
            delivery location and order size.
          </p>

          <h2>6. Delivery Attempts</h2>
          <p>
            Our shipping partners will make up to <strong>3 delivery
            attempts</strong>. If the delivery is unsuccessful after 3
            attempts, the order will be returned to our warehouse:
          </p>
          <ul>
            <li>
              <strong>Prepaid orders:</strong> A full refund will be processed
              after the returned package is received at our warehouse.
            </li>
            <li>
              <strong>COD orders:</strong> The order will be cancelled, and no
              charges will apply.
            </li>
          </ul>
          <p>
            Please ensure that someone is available at the delivery address to
            receive the package. You can also contact the delivery partner
            directly to reschedule delivery.
          </p>

          <h2>7. Incorrect or Incomplete Address</h2>
          <p>
            It is the customer&apos;s responsibility to provide accurate and
            complete delivery information (including name, address, pin code,
            phone number, and any landmarks). Harungtan is not responsible for
            delays or failed deliveries due to incorrect or incomplete
            addresses.
          </p>
          <p>
            If you realize you have entered an incorrect address, please
            contact us immediately. We can update the address only if the order
            has not yet been dispatched.
          </p>

          <h2>8. Damaged or Lost Shipments</h2>
          <p>
            If your package arrives damaged or is lost in transit, please
            contact us within <strong>48 hours</strong> of the expected
            delivery date. We will work with our shipping partner to
            investigate and resolve the issue. In confirmed cases:
          </p>
          <ul>
            <li>Damaged packages will be replaced or fully refunded</li>
            <li>Lost packages will be fully refunded after investigation</li>
          </ul>

          <h2>9. International Shipping</h2>
          <p>
            Currently, Harungtan ships only within India. We are working on
            expanding to international markets. If you are located outside
            India and wish to place an order, please contact us at{' '}
            <a href="mailto:support@harungtan.com">support@harungtan.com</a>{' '}
            and we will do our best to assist you.
          </p>
          <p>
            International shipping will be subject to additional charges,
            customs duties, and import taxes, which are the responsibility of
            the buyer.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            For any shipping-related queries, please reach out to us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:shipping@harungtan.com">shipping@harungtan.com</a>
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

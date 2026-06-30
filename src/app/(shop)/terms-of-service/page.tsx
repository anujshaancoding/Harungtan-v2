import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Harungtan',
  description:
    'Read the terms and conditions governing your use of the Harungtan website and services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--border)]" />
          <span className="font-medium text-[var(--foreground)]">Terms of Service</span>
        </nav>

        {/* Header */}
        <header className="mb-14">
          <p className="subheading mb-4">Legal</p>
          <h1 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>
          <div className="divider-accent mt-6" />
          <p className="mt-4 text-sm tracking-wide text-[var(--muted-foreground)]">
            Last updated: March 1, 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-lg prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-li:text-[var(--muted-foreground)] prose-a:text-[var(--foreground)] prose-a:underline-offset-4 prose-strong:text-[var(--foreground)] prose-ul:marker:text-[var(--accent)]">
          <p>
            Welcome to Harungtan. These Terms of Service (&quot;Terms&quot;)
            govern your access to and use of the Harungtan website
            (www.harungtan.com), mobile applications, and all related services
            (collectively, the &quot;Service&quot;). By accessing or using our
            Service, you agree to be bound by these Terms. If you do not agree,
            please refrain from using our Service.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account, placing an order, or otherwise using our
            Service, you acknowledge that you have read, understood, and agree
            to be bound by these Terms, our{' '}
            <Link href="/privacy-policy">Privacy Policy</Link>, and all
            applicable laws and regulations. We reserve the right to modify
            these Terms at any time. Changes will be effective upon posting to
            our website. Your continued use of the Service constitutes
            acceptance of the modified Terms.
          </p>

          <h2>2. Account Registration</h2>
          <p>To make purchases on Harungtan, you may need to create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the confidentiality of your password and account credentials</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these Terms, contain false information, or engage in fraudulent
            activity.
          </p>

          <h2>3. Orders and Purchases</h2>
          <p>
            When you place an order through our Service, you are making an offer
            to purchase. All orders are subject to acceptance by Harungtan. We
            reserve the right to:
          </p>
          <ul>
            <li>Accept or decline any order at our sole discretion</li>
            <li>Cancel orders due to pricing errors, inventory issues, or suspected fraud</li>
            <li>Limit order quantities</li>
            <li>Require additional verification before processing orders</li>
          </ul>
          <p>
            An order confirmation email does not constitute acceptance of your
            order. Acceptance occurs when the item is shipped and you receive a
            shipping confirmation.
          </p>

          <h2>4. Pricing and Availability</h2>
          <ul>
            <li>
              All prices are listed in Indian Rupees (INR) and are inclusive of
              applicable taxes unless otherwise stated.
            </li>
            <li>
              Prices are subject to change without prior notice. The price
              applicable to your order is the price displayed at the time of
              placing the order.
            </li>
            <li>
              While we make every effort to ensure accuracy, pricing errors may
              occur. In such cases, we will notify you and offer you the option
              to proceed at the correct price or cancel the order.
            </li>
            <li>
              Product availability is not guaranteed and may vary without
              notice. We are not liable for products that become unavailable
              after you place an order.
            </li>
          </ul>

          <h2>5. Payment</h2>
          <p>We accept the following payment methods:</p>
          <ul>
            <li>Credit and debit cards (Visa, Mastercard, RuPay)</li>
            <li>UPI (Google Pay, PhonePe, Paytm, and others)</li>
            <li>Net banking</li>
            <li>Wallets</li>
            <li>Cash on Delivery (COD), where available</li>
          </ul>
          <p>
            All electronic payments are processed through secure, PCI
            DSS-compliant third-party payment gateways. Harungtan does not
            store your complete credit or debit card details. By providing
            payment information, you represent that you are authorized to use
            the payment method.
          </p>

          <h2>6. Shipping and Delivery</h2>
          <p>
            Shipping timelines and policies are detailed in our{' '}
            <Link href="/shipping-policy">Shipping Policy</Link>. Key points
            include:
          </p>
          <ul>
            <li>Estimated delivery times are indicative and not guaranteed</li>
            <li>
              Risk of loss and title for items passes to you upon delivery to
              the carrier
            </li>
            <li>
              We are not responsible for delays caused by carrier issues,
              customs, weather, or other events beyond our control
            </li>
            <li>
              Delivery to incorrect addresses provided by the customer is the
              customer&apos;s responsibility
            </li>
          </ul>

          <h2>7. Returns and Exchanges</h2>
          <p>
            Returns and exchanges are subject to our{' '}
            <Link href="/return-policy">Return Policy</Link> and{' '}
            <Link href="/refund-policy">Refund Policy</Link>. By making a
            purchase, you agree to the terms outlined in those policies.
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            All content on the Harungtan website, including but not limited to
            text, graphics, logos, images, product designs, photographs, audio,
            video, software, and the compilation thereof, is the exclusive
            property of Harungtan or its content suppliers and is protected by
            Indian and international copyright, trademark, and other
            intellectual property laws.
          </p>
          <p>You may not:</p>
          <ul>
            <li>Reproduce, distribute, or modify any content without our written consent</li>
            <li>Use our trademarks, logos, or brand name without authorization</li>
            <li>Scrape, data-mine, or systematically extract content from our website</li>
            <li>
              Use our content for commercial purposes without a licensing
              agreement
            </li>
          </ul>

          <h2>9. User Content</h2>
          <p>
            By submitting content to our website (including reviews, comments,
            photos, or feedback), you:
          </p>
          <ul>
            <li>
              Grant Harungtan a non-exclusive, royalty-free, perpetual,
              worldwide license to use, reproduce, modify, and display such
              content
            </li>
            <li>
              Represent that you own or have the right to submit the content
            </li>
            <li>
              Agree that your content does not violate any third-party rights
              or applicable laws
            </li>
          </ul>
          <p>
            We reserve the right to remove any user content that we deem
            inappropriate, offensive, or in violation of these Terms.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, Harungtan, its
            directors, employees, partners, agents, and affiliates shall not be
            liable for:
          </p>
          <ul>
            <li>
              Any indirect, incidental, special, consequential, or punitive
              damages arising from your use of the Service
            </li>
            <li>
              Loss of profits, data, goodwill, or other intangible losses
            </li>
            <li>
              Any unauthorized access to or alteration of your transmissions or
              data
            </li>
            <li>
              Any third-party content, products, or services accessed through
              our Service
            </li>
          </ul>
          <p>
            Our total liability for any claim arising from or related to the
            Service shall not exceed the amount you paid to Harungtan for the
            specific product or service giving rise to the claim.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Harungtan and its
            officers, directors, employees, and agents from any claims,
            liabilities, damages, losses, and expenses (including reasonable
            legal fees) arising from your use of the Service, violation of
            these Terms, or infringement of any third-party rights.
          </p>

          <h2>12. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of India. Any disputes arising from or related to these
            Terms or the Service shall be subject to the exclusive jurisdiction
            of the courts in India.
          </p>
          <p>
            Before initiating formal legal proceedings, both parties agree to
            attempt to resolve disputes through good-faith negotiation.
          </p>

          <h2>13. Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or
            unenforceable, the remaining provisions shall continue in full
            force and effect.
          </p>

          <h2>14. Contact Us</h2>
          <p>
            For questions or concerns regarding these Terms of Service, please
            contact us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@harungtan.com">legal@harungtan.com</a>
            </li>
            <li>
              <strong>Phone:</strong> +91-9000-000000
            </li>
            <li>
              <strong>Address:</strong> Harungtan, India
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

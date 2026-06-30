import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Harungtan',
  description:
    'Learn how Harungtan collects, uses, and protects your personal information. Read our comprehensive privacy policy.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--border)]" />
          <span className="font-medium text-[var(--foreground)]">Privacy Policy</span>
        </nav>

        {/* Header */}
        <header className="mb-14">
          <p className="subheading mb-4">Legal</p>
          <h1 className="heading-editorial text-3xl text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <div className="divider-accent mt-6" />
          <p className="mt-4 text-sm tracking-wide text-[var(--muted-foreground)]">
            Last updated: March 1, 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-lg prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-li:text-[var(--muted-foreground)] prose-a:text-[var(--foreground)] prose-a:underline-offset-4 prose-strong:text-[var(--foreground)] prose-ul:marker:text-[var(--accent)]">
          <p>
            At Harungtan (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we
            are committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website, make a purchase, or interact
            with our services. Please read this policy carefully. If you do not
            agree with the terms of this policy, please do not access our
            website.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>Personal Information</h3>
          <p>
            We may collect personally identifiable information that you
            voluntarily provide when you:
          </p>
          <ul>
            <li>Create an account or register on our website</li>
            <li>Place an order or make a purchase</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us via email, phone, or contact forms</li>
            <li>Participate in surveys, contests, or promotions</li>
            <li>Write product reviews or interact with our community features</li>
          </ul>
          <p>This information may include:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely through third-party payment processors)</li>
            <li>Date of birth (if voluntarily provided)</li>
            <li>Size and style preferences</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>
            When you visit our website, we may automatically collect certain
            information about your device and browsing activity, including:
          </p>
          <ul>
            <li>IP address and geographic location</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring URLs and exit pages</li>
            <li>Pages viewed and time spent on each page</li>
            <li>Click patterns and navigation paths</li>
            <li>Device identifiers</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders, including shipping and delivery</li>
            <li>Create and manage your account</li>
            <li>Send order confirmations, shipping updates, and delivery notifications</li>
            <li>Process returns, exchanges, and refunds</li>
            <li>Communicate with you about products, services, promotions, and events</li>
            <li>Personalize your shopping experience and recommend products</li>
            <li>Improve our website, products, and customer service</li>
            <li>Analyze trends, administer the site, and gather demographic information</li>
            <li>Prevent fraud and enhance the security of our platform</li>
            <li>Comply with legal obligations and enforce our terms of service</li>
          </ul>

          <h2>3. Data Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information with:
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Third-party companies that
              assist us in operating our website, processing payments, shipping
              orders, sending emails, and analyzing data. These providers have
              access to your information only to perform specific tasks on our
              behalf.
            </li>
            <li>
              <strong>Payment Processors:</strong> Secure payment gateways
              (such as Razorpay, Stripe, or similar) that handle transaction
              processing. We do not store your complete payment card details on
              our servers.
            </li>
            <li>
              <strong>Shipping Partners:</strong> Courier and logistics
              companies that require your address and contact details to deliver
              your orders.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required by law, court order, or governmental
              regulation, or if we believe disclosure is necessary to protect
              our rights, safety, or the safety of others.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger,
              acquisition, or sale of assets, your information may be
              transferred as part of the transaction.
            </li>
          </ul>

          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies, web beacons, and similar tracking technologies to
            enhance your browsing experience. Cookies are small data files
            stored on your device that help us:
          </p>
          <ul>
            <li>Remember your preferences and login information</li>
            <li>Understand how you interact with our website</li>
            <li>Deliver relevant advertisements and measure their effectiveness</li>
            <li>Analyze website traffic and performance</li>
            <li>Maintain your shopping cart across sessions</li>
          </ul>
          <p>
            You can control cookie settings through your browser preferences.
            Please note that disabling cookies may affect certain features of
            our website.
          </p>

          <h3>Types of Cookies We Use</h3>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Necessary for the website to
              function properly, including session management and security.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how
              visitors interact with our website through tools like Google
              Analytics.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your preferences
              such as language, region, and display settings.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver personalized
              advertisements and track campaign performance.
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            personal information, including:
          </p>
          <ul>
            <li>SSL/TLS encryption for all data transmission</li>
            <li>Secure payment processing through PCI DSS-compliant providers</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Encrypted storage of sensitive data</li>
          </ul>
          <p>
            While we strive to protect your personal information, no method of
            electronic transmission or storage is 100% secure. We cannot
            guarantee absolute security, but we are committed to maintaining
            the highest practical standards.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the following rights
            regarding your personal data:
          </p>
          <ul>
            <li>
              <strong>Access:</strong> Request a copy of the personal data we
              hold about you.
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate or
              incomplete data.
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal data,
              subject to legal obligations.
            </li>
            <li>
              <strong>Opt-Out:</strong> Unsubscribe from marketing
              communications at any time using the unsubscribe link in our
              emails or through your account settings.
            </li>
            <li>
              <strong>Data Portability:</strong> Request your data in a
              structured, machine-readable format.
            </li>
            <li>
              <strong>Withdraw Consent:</strong> Withdraw consent for data
              processing where consent was the legal basis.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the
            information provided below.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to
            fulfill the purposes outlined in this policy, comply with legal
            obligations, resolve disputes, and enforce our agreements. Order
            records are retained for a minimum of 7 years for tax and
            accounting purposes.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our website is not intended for children under the age of 13. We do
            not knowingly collect personal information from children. If we
            become aware that we have collected data from a child under 13, we
            will take steps to delete it promptly.
          </p>

          <h2>9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices or content of these external
            sites. We encourage you to review the privacy policies of any
            third-party websites you visit.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or applicable laws. We will notify you of
            significant changes by posting the updated policy on our website
            with a new &quot;Last Updated&quot; date. Your continued use of our
            website after changes are posted constitutes acceptance of the
            revised policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy
            Policy or our data practices, please contact us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@harungtan.com">privacy@harungtan.com</a>
            </li>
            <li>
              <strong>Phone:</strong> +91-9000-000000
            </li>
            <li>
              <strong>Address:</strong> Harungtan, India
            </li>
          </ul>
          <p>
            We will respond to your inquiry within 30 days of receipt.
          </p>
        </div>
      </div>
    </div>
  )
}

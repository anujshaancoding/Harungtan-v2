import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Community Guidelines | Harungtan',
  description:
    'Read Harungtan\'s community guidelines covering review policies, user conduct, content standards, and reporting processes.',
}

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Link href="/" className="hover-underline transition-colors hover:text-[var(--foreground)]">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={1.5} className="text-[var(--border)]" />
          <span className="font-medium text-[var(--foreground)]">Community Guidelines</span>
        </nav>

        {/* Header */}
        <header className="mb-14">
          <h1 className="heading-editorial text-4xl text-[var(--foreground)] sm:text-5xl">
            Community Guidelines
          </h1>
          <div className="divider-accent mt-6 mb-0" />
          <p className="mt-5 text-sm text-[var(--muted-foreground)]">
            Last updated: March 1, 2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral max-w-none prose-headings:heading-editorial prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-5 prose-h3:text-lg prose-p:text-[var(--muted-foreground)] prose-p:leading-relaxed prose-li:text-[var(--muted-foreground)] prose-a:text-[var(--foreground)] prose-a:underline-offset-4">
          <p>
            At Harungtan, we believe in fostering a welcoming, honest, and
            respectful community. Whether you are writing a product review,
            sharing a photo, or interacting with other members, we ask that
            you follow these guidelines to keep our community a positive space
            for everyone.
          </p>

          <h2>1. Review Guidelines</h2>
          <p>
            Product reviews are valuable to our community. They help fellow
            shoppers make informed decisions and help us improve our products.
            To ensure reviews are helpful and trustworthy, please follow these
            guidelines:
          </p>

          <h3>What Makes a Great Review</h3>
          <ul>
            <li>
              <strong>Be honest and specific:</strong> Share your genuine
              experience with the product. Mention details like fit, fabric
              quality, color accuracy, and comfort.
            </li>
            <li>
              <strong>Be constructive:</strong> If you had a negative
              experience, explain what went wrong and how it could be improved.
              Constructive feedback helps everyone.
            </li>
            <li>
              <strong>Include relevant details:</strong> Mention your body type,
              usual size, and how the garment fits (true to size, runs large,
              runs small).
            </li>
            <li>
              <strong>Add photos:</strong> Real photos of the product help
              others see how the item looks in person and build trust in the
              community.
            </li>
            <li>
              <strong>Stay on topic:</strong> Focus on the product itself.
              Shipping, customer service, or unrelated issues should be directed
              to our support team.
            </li>
          </ul>

          <h3>What Is Not Allowed in Reviews</h3>
          <ul>
            <li>Fake, misleading, or incentivized reviews (paid or in exchange for free products)</li>
            <li>Profanity, slurs, hate speech, or discriminatory language</li>
            <li>Personal information (phone numbers, addresses, full names of others)</li>
            <li>Promotional content, spam, or links to external websites</li>
            <li>Content that is sexually explicit, violent, or graphic</li>
            <li>Reviews for products you did not purchase from Harungtan</li>
            <li>Multiple reviews for the same product from the same account</li>
          </ul>

          <h2>2. User Conduct</h2>
          <p>
            As a member of the Harungtan community, we expect you to conduct
            yourself in a manner that is respectful, lawful, and aligned with
            our values:
          </p>
          <ul>
            <li>
              <strong>Respect others:</strong> Treat all community members with
              dignity and respect. Harassment, bullying, intimidation, or
              personal attacks will not be tolerated.
            </li>
            <li>
              <strong>No impersonation:</strong> Do not impersonate other
              users, Harungtan staff, or any other person or entity.
            </li>
            <li>
              <strong>Accurate information:</strong> Provide truthful
              information in your account, reviews, and communications.
            </li>
            <li>
              <strong>No manipulation:</strong> Do not attempt to manipulate
              ratings, reviews, or any other community features through fake
              accounts, coordinated efforts, or automated tools.
            </li>
            <li>
              <strong>Lawful use:</strong> Do not use our platform for any
              illegal or unauthorized purpose, including but not limited to
              fraud, intellectual property infringement, or distribution of
              prohibited content.
            </li>
            <li>
              <strong>Respect privacy:</strong> Do not share, collect, or
              publish personal information of other users without their explicit
              consent.
            </li>
          </ul>

          <h2>3. Content Policy</h2>
          <p>
            All user-generated content (reviews, photos, comments) submitted to
            Harungtan must comply with the following standards:
          </p>

          <h3>Acceptable Content</h3>
          <ul>
            <li>Genuine product reviews based on personal experience</li>
            <li>Photos of Harungtan products in real-life settings</li>
            <li>Constructive feedback and suggestions</li>
            <li>Questions about products, sizing, or styling</li>
          </ul>

          <h3>Prohibited Content</h3>
          <ul>
            <li>
              <strong>Hate speech:</strong> Content that promotes hatred,
              discrimination, or violence based on race, ethnicity, religion,
              gender, sexual orientation, disability, or any other protected
              characteristic.
            </li>
            <li>
              <strong>Harassment:</strong> Content that targets, threatens, or
              intimidates any individual.
            </li>
            <li>
              <strong>Misinformation:</strong> Deliberately false or misleading
              information about products, the brand, or other users.
            </li>
            <li>
              <strong>Spam:</strong> Repetitive, irrelevant, or unsolicited
              promotional content.
            </li>
            <li>
              <strong>Copyrighted material:</strong> Content that infringes on
              the intellectual property rights of others.
            </li>
            <li>
              <strong>Malicious content:</strong> Links to phishing sites,
              malware, or any content designed to harm other users or their
              devices.
            </li>
          </ul>

          <h2>4. Content Moderation</h2>
          <p>
            Harungtan reserves the right to moderate, edit, or remove any
            user-generated content that violates these guidelines. Our
            moderation team reviews submitted content to ensure compliance. We
            may:
          </p>
          <ul>
            <li>Approve, reject, or edit submissions before they are published</li>
            <li>Remove previously published content that is found to violate guidelines</li>
            <li>Issue warnings to users who violate guidelines</li>
            <li>Temporarily or permanently suspend accounts of repeat offenders</li>
          </ul>

          <h2>5. Reporting Process</h2>
          <p>
            If you encounter content or behavior that violates these
            guidelines, we encourage you to report it so we can take
            appropriate action:
          </p>

          <h3>How to Report</h3>
          <ol>
            <li>
              <strong>Flag the content:</strong> Click the &quot;Report&quot;
              button (flag icon) next to any review, comment, or user profile
              that you believe violates our guidelines.
            </li>
            <li>
              <strong>Select a reason:</strong> Choose the most relevant
              category for your report (spam, harassment, hate speech,
              misinformation, etc.).
            </li>
            <li>
              <strong>Provide details:</strong> Add any additional context that
              may help our moderation team understand the issue.
            </li>
            <li>
              <strong>Submit:</strong> Your report will be reviewed by our
              team within 24-48 hours.
            </li>
          </ol>

          <h3>What Happens After You Report</h3>
          <ul>
            <li>
              Our moderation team will review the reported content against these
              guidelines.
            </li>
            <li>
              If a violation is confirmed, the content will be removed and the
              user may receive a warning or account suspension.
            </li>
            <li>
              For serious violations (threats, illegal content), we may report
              the matter to appropriate authorities.
            </li>
            <li>
              Reports are confidential. The reported user will not be informed
              of who submitted the report.
            </li>
          </ul>

          <h3>Alternative Reporting Methods</h3>
          <p>
            You can also report violations directly to our support team:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:community@harungtan.com">community@harungtan.com</a>
            </li>
            <li>
              <strong>Help Center:</strong>{' '}
              <Link href="/help">Submit a support request</Link>
            </li>
          </ul>

          <h2>6. Consequences of Violations</h2>
          <p>
            Violations of these community guidelines may result in the
            following actions, depending on the severity and frequency:
          </p>
          <ul>
            <li>
              <strong>First offense:</strong> Warning and content removal.
            </li>
            <li>
              <strong>Second offense:</strong> Temporary suspension of community
              features (ability to review, comment, or upload content).
            </li>
            <li>
              <strong>Severe or repeated offenses:</strong> Permanent account
              suspension and ban from the Harungtan platform.
            </li>
          </ul>
          <p>
            Harungtan reserves the right to take immediate action, including
            permanent suspension, for severe violations such as threats,
            illegal activity, or hate speech, without prior warning.
          </p>

          <h2>7. Updates to These Guidelines</h2>
          <p>
            We may update these Community Guidelines from time to time to
            address new situations or improve clarity. Changes will be posted
            on this page with an updated date. We encourage you to review these
            guidelines periodically.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions about these guidelines or need assistance,
            please contact us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:community@harungtan.com">community@harungtan.com</a>
            </li>
            <li>
              <strong>Help Center:</strong>{' '}
              <Link href="/help">Visit our Help Center</Link>
            </li>
          </ul>
          <p>
            Thank you for being part of the Harungtan community. Together, we
            create a space where honesty, respect, and great style go hand in
            hand.
          </p>
        </div>
      </div>
    </div>
  )
}

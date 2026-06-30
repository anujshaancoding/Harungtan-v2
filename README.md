# HARUNGTAN

**Premium T-Shirts for Men & Women | Made in India**

A modern, production-ready e-commerce website for the Harungtan clothing brand, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Full E-commerce Flow**: Browse, Filter, Product Details, Cart, Checkout, Payment
- **Authentication**: Email/password signup & login, Google OAuth, forgot/reset password
- **Product Catalog**: 24+ products with filtering by category, gender, size, color, price
- **Shopping Cart**: Persistent cart with zustand, quantity controls, real-time totals
- **Wishlist**: Save favorite items across sessions
- **Stripe Payments**: Secure checkout with Stripe integration
- **User Profiles**: Order history, saved addresses, wishlist, account settings
- **SEO Optimized**: Meta tags, Open Graph, JSON-LD structured data, sitemap, robots.txt
- **Responsive Design**: Mobile-first, works on all devices
- **Legal Pages**: Privacy Policy, Terms of Service, Return/Refund/Shipping policies
- **Help Center**: FAQ, contact form, size guide

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | React framework with App Router, SSR/SSG |
| TypeScript | Type safety |
| Tailwind CSS 4 | Utility-first styling |
| Prisma 6 | Database ORM |
| SQLite / PostgreSQL | Database |
| NextAuth.js v5 | Authentication |
| Stripe | Payment processing |
| Zustand | Client-side state management |
| Framer Motion | Animations |
| React Hook Form + Zod | Form handling & validation |
| Jest + Playwright | Testing |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd harungtan

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Seed the database
npm run seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@harungtan.com | admin123 |
| Customer | customer@example.com | customer123 |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Signup, Forgot/Reset Password
│   ├── (shop)/          # Products, Cart, Checkout
│   ├── api/             # 18 API routes
│   ├── profile/         # User profile pages
│   ├── about/           # About page
│   ├── help/            # Help center & FAQ
│   ├── privacy-policy/  # Legal pages
│   └── ...
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Header, Footer, Cart Sidebar
│   ├── home/            # Home page sections
│   └── products/        # Product components
├── lib/                 # Auth, Prisma, Stripe, Store, Utils
├── types/               # TypeScript types
└── middleware.ts        # Auth middleware
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database
npm run test         # Run unit tests
npm run test:e2e     # Run e2e tests
npm run db:studio    # Open Prisma Studio
```

## Deployment (VPS)

```bash
# Using Docker
docker-compose up -d

# Or manual
npm run build
npm start
```

See [docs/TECHNICAL_DOCUMENTATION.md](docs/TECHNICAL_DOCUMENTATION.md) for full deployment guide.

## Documentation

- [Business Plan](docs/BUSINESS_PLAN.md)
- [1-Year Roadmap](docs/ONE_YEAR_ROADMAP.md)
- [Marketing Strategy](docs/MARKETING_STRATEGY.md)
- [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)
- [Startup Guide](docs/STARTUP_GUIDE.md)
- [Brand Guidelines](docs/BRAND_GUIDELINES.md)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string |
| `NEXTAUTH_URL` | Your app URL |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |

## License

All rights reserved. (c) 2024 Harungtan.

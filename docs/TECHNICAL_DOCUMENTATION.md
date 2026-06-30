# Harungtan - Technical Documentation

**Version:** 2.0
**Date:** March 2026

---

## Table of Contents

1. [Project Architecture Overview](#1-project-architecture-overview)
2. [Tech Stack and Rationale](#2-tech-stack-and-rationale)
3. [Database Schema](#3-database-schema)
4. [API Documentation](#4-api-documentation)
5. [Authentication Flow](#5-authentication-flow)
6. [Payment Integration (Stripe)](#6-payment-integration-stripe)
7. [Deployment Guide](#7-deployment-guide)
8. [Environment Variables](#8-environment-variables)
9. [Development Setup](#9-development-setup)
10. [Folder Structure](#10-folder-structure)

---

## 1. Project Architecture Overview

Harungtan is a full-stack e-commerce application built as a monolithic Next.js application with server-side rendering, API routes, and a SQLite database (via Prisma ORM). The architecture prioritizes simplicity, speed, and cost-efficiency for a D2C startup.

### Architecture Diagram

```
+-----------------------------------------------------+
|                    Client (Browser)                  |
|  +--------------+  +--------------+  +------------+ |
|  | React 19     |  | Zustand      |  | Framer     | |
|  | Components   |  | (Cart/       |  | Motion     | |
|  |              |  |  Wishlist)   |  | (Animations)| |
|  +------+-------+  +------+-------+  +------------+ |
|         |                 |                          |
|         v                 v                          |
|  +-----------------------------+                     |
|  | Next.js 16 (App Router)     |                     |
|  | - Server Components (SSR)   |                     |
|  | - Client Components (CSR)   |                     |
|  | - API Routes                |                     |
|  +----------+-----------------+                      |
+--------------+---------------------------------------+
               |
               v
+-----------------------------------------------------+
|                    Server (VPS)                      |
|                                                      |
|  +------------------+  +------------------------+   |
|  | Next.js Server   |  | NextAuth.js v5         |   |
|  | (Node.js 20)     |--| (JWT Sessions)         |   |
|  |                  |  | - Credentials Provider |   |
|  |                  |  | - Google OAuth Provider|   |
|  +--------+---------+  +------------------------+   |
|           |                                          |
|           v                                          |
|  +------------------+  +------------------------+   |
|  | Prisma ORM       |  | Stripe SDK             |   |
|  | (Query Builder)   |--| (Payment Processing)  |   |
|  +--------+---------+  +------------------------+   |
|           |                                          |
|           v                                          |
|  +------------------+                                |
|  | SQLite Database   |                               |
|  | (prisma/dev.db)   |                               |
|  +------------------+                                |
|                                                      |
|  +----------------------------------------------+   |
|  | Docker Container (Production)                 |   |
|  | - Node.js 20 Alpine                          |   |
|  | - Standalone Next.js output                  |   |
|  | - Port 3000                                  |   |
|  +----------------------------------------------+   |
+-----------------------------------------------------+
```

### Key Architectural Decisions

1. **Monolithic Architecture:** Single Next.js app handles frontend, backend (API routes), and serves static assets. This reduces complexity, deployment overhead, and cost for a startup.

2. **SQLite Database:** Zero-configuration, file-based database. No separate database server required. Suitable for early-stage traffic (up to ~1,000 concurrent users). Can migrate to PostgreSQL when scaling demands it.

3. **Server Components (Default):** Most pages use React Server Components for faster initial page loads and better SEO. Client Components are used only for interactive elements (cart, forms, animations).

4. **Client-Side State (Zustand):** Cart and wishlist state are managed client-side with Zustand and persisted to localStorage. This enables instant add-to-cart without network requests and works offline.

5. **Stripe Checkout (Hosted):** Uses Stripe Checkout Sessions (hosted page) rather than embedded payment forms. This provides PCI compliance out of the box and reduces implementation complexity.

---

## 2. Tech Stack and Rationale

### Core Stack

| Technology | Version | Purpose | Why This Choice |
|-----------|---------|---------|-----------------|
| **Next.js** | 16.1.6 | Full-stack React framework | App Router, SSR, API routes, image optimization, built-in SEO |
| **React** | 19.2.3 | UI library | Server Components, latest features, ecosystem |
| **TypeScript** | 5.x | Type safety | Catch errors at build time, better DX, self-documenting code |
| **Prisma** | 6.19.2 | ORM / Database access | Type-safe queries, auto-generated client, easy migrations |
| **SQLite** | (via Prisma) | Database | Zero-config, file-based, free, sufficient for early stage |
| **NextAuth.js** | 5.0 (beta) | Authentication | Built for Next.js, multiple providers, session management |
| **Stripe** | 20.4.1 | Payment processing | Global, reliable, excellent DX, India support |
| **Tailwind CSS** | 4.x | Styling | Utility-first, no CSS bloat, fast development |

### Frontend Libraries

| Library | Purpose |
|---------|---------|
| **Zustand** (5.0) | Lightweight state management for cart and wishlist. Persisted to localStorage via middleware. |
| **Framer Motion** (12.x) | Page transitions, component animations, hover effects |
| **React Hook Form** (7.x) + **Zod** (4.x) | Form handling with schema-based validation |
| **Lucide React** (0.577) | SVG icon library, tree-shakeable (only imports used icons) |
| **React Hot Toast** (2.6) | Lightweight toast notifications |
| **Swiper** (12.x) | Image carousels and product image sliders |
| **Sharp** (0.34) | Server-side image optimization (used by Next.js Image component) |
| **Slugify** (1.6) | URL-safe slug generation for products |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** (9.x) + eslint-config-next | Code linting with Next.js-specific rules |
| **Jest** (30.x) + Testing Library | Unit and component testing |
| **Playwright** (1.58) | Browser-based end-to-end testing |
| **Docker** + Docker Compose | Containerized production deployment |
| **tsx** | TypeScript execution for scripts (database seeding) |

### Why Not Shopify/WooCommerce?

Building a custom platform instead of using Shopify gives Harungtan:
- **Zero platform fees:** Shopify charges Rs.2,000-25,000/month + 2% transaction fees. Our custom platform costs Rs.500-1,000/month for hosting.
- **Complete data ownership:** All customer data stays in our database.
- **Unlimited customization:** No theme limitations, no app marketplace lock-in.
- **Better performance:** Optimized for our specific use case, not a general-purpose platform.
- **Learning and control:** Full understanding of the tech stack enables faster iteration.

---

## 3. Database Schema

### Entity Relationship Overview

The database contains 12 models organized around Users, Products, and Orders.

**Core Models:**
- **User** -- Customer accounts with authentication, profiles, and relationships to orders, reviews, cart, wishlist, and addresses
- **Account** -- OAuth provider accounts (Google) linked to users via PrismaAdapter
- **Session** -- User sessions (used by NextAuth adapter, though JWT strategy means these are rarely populated)
- **VerificationToken** -- Password reset tokens (1-hour expiry)

**Product Models:**
- **Product** -- Product catalog with pricing, inventory, categorization, and denormalized rating data. The `images`, `sizes`, and `colors` fields are stored as JSON strings in SQLite and parsed to arrays in application code.

**Commerce Models:**
- **Order** -- Customer orders with monetary totals (subtotal, shipping, tax, discount, total), payment info (Stripe session ID, status, method), and address snapshots
- **OrderItem** -- Individual line items within an order (product, quantity, price at time of purchase, size, color)
- **CartItem** -- Server-side cart storage. Unique constraint on `(userId, productId, size, color)` means the same product in different size/color combinations creates separate cart entries.
- **WishlistItem** -- Saved products. Unique constraint on `(userId, productId)` prevents duplicates.

**User Profile Models:**
- **Address** -- Saved shipping/billing addresses. Supports a default address flag (setting a new default automatically unsets others).
- **Review** -- Product reviews with 1-5 star rating. One review per user per product enforced in application code.

**Communication Models:**
- **Newsletter** -- Email subscriber list with active/inactive status. Uses upsert to re-subscribe inactive entries.
- **ContactMessage** -- Contact form submissions with status tracking.

### Key Schema Design Details

**JSON-Stored Arrays in Product:**
The `images`, `sizes`, and `colors` fields are stored as JSON strings because SQLite does not support array types. The `serializeProduct()` function in `src/types/index.ts` handles parsing:

```typescript
// Raw from database: product.images = '["url1","url2"]'
// After serialization: product.images = ["url1", "url2"]
function serializeProduct(product: ProductRaw): Product {
  return {
    ...product,
    images: JSON.parse(product.images),
    sizes: JSON.parse(product.sizes),
    colors: JSON.parse(product.colors),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}
```

**Denormalized Rating:**
Product stores `rating` (float, e.g., 4.5) and `reviewCount` (integer) directly. When a new review is submitted, these are recalculated:

```
newReviewCount = oldReviewCount + 1
newRating = (oldRating * oldReviewCount + newRatingValue) / newReviewCount
```

This avoids expensive JOIN/aggregate queries on every product listing page.

**CUID for IDs:**
All models use `@default(cuid())` for primary keys. CUIDs are collision-resistant, URL-safe, and harder to enumerate than auto-increment integers.

**Cascade Deletes:**
- Deleting a User cascades to: Account, CartItem, WishlistItem, Address
- Deleting a Product cascades to: Review, WishlistItem, CartItem
- Deleting an Order cascades to: OrderItem

---

## 4. API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://harungtan.com/api`

### Response Format
All endpoints return JSON. Successful responses contain the requested data directly. Error responses follow this format:
```json
{ "error": "Human-readable error message" }
```

### Authentication
Endpoints marked "Auth Required" need a valid NextAuth session cookie. The session is validated server-side using the `auth()` function. Unauthorized requests receive `401`.

---

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation:**
- `name`: required, non-empty
- `email`: required, valid email format (regex validated)
- `password`: required, minimum 8 characters
- Email is lowercased before storage
- Password is hashed with bcrypt (10 salt rounds)

**Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "clxxxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-03-11T10:00:00.000Z"
  }
}
```

**Errors:** `400` missing/invalid fields, `409` email exists, `500` server error.

---

#### POST `/api/auth/forgot-password`
Request a password reset token. Returns success even if email does not exist (prevents email enumeration).

**Request:** `{ "email": "john@example.com" }`

**Response (200):**
```json
{ "message": "If an account with that email exists, a password reset link has been sent." }
```

**Internal behavior:** Deletes existing tokens for user, generates 32-byte hex token, stores in VerificationToken with 1-hour expiry. Currently logs token to console (email sending to be implemented).

---

#### POST `/api/auth/reset-password`
Reset password using a valid, non-expired token.

**Request:** `{ "token": "hex_token_string", "password": "newPassword123" }`

**Response (200):** `{ "message": "Password has been reset successfully" }`

**Errors:** `400` missing fields, short password, invalid/expired token.

---

#### NextAuth Endpoints
`GET/POST /api/auth/[...nextauth]` -- Managed by NextAuth.js v5. Provides:
- `GET /api/auth/session` -- Current session data
- `POST /api/auth/signin/credentials` -- Email/password login
- `GET /api/auth/signin/google` -- Google OAuth flow initiation
- `POST /api/auth/signout` -- Sign out (clears JWT cookie)

---

### Product Endpoints

#### GET `/api/products`
Paginated product listings with comprehensive filtering and sorting.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `category` | string | -- | Filter by category name |
| `gender` | string | -- | "men", "women", or "unisex" |
| `minPrice` | number | -- | Minimum price (inclusive) |
| `maxPrice` | number | -- | Maximum price (inclusive) |
| `sizes` | string | -- | Comma-separated: "S,M,L" (OR logic within sizes) |
| `colors` | string | -- | Comma-separated: "Black,White" (OR logic within colors) |
| `sort` | string | "newest" | "newest", "price-asc", "price-desc", "rating", "bestseller" |
| `search` | string | -- | Searches name, description, and category fields |
| `featured` | "true" | -- | Featured products only |
| `bestseller` | "true" | -- | Bestseller products only |
| `newArrival` | "true" | -- | New arrival products only |
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 12 | Items per page |

**Filter Logic:**
- Size and color filters use `contains` on JSON strings (e.g., checking if `sizes` string contains "M")
- When both sizes and colors are specified, they are combined with AND logic (must match at least one size AND at least one color)
- Search is combined with AND logic (must match search AND other filters)
- Only `active: true` products are returned

**Response (200):**
```json
{
  "products": [
    {
      "id": "clxxxx...",
      "name": "Classic Oversized Tee",
      "slug": "classic-oversized-tee",
      "description": "Premium 200 GSM bio-washed cotton...",
      "price": 699,
      "comparePrice": 999,
      "category": "t-shirts",
      "subcategory": "oversized",
      "gender": "men",
      "images": "[\"https://example.com/img1.jpg\", \"https://example.com/img2.jpg\"]",
      "sizes": "[\"S\", \"M\", \"L\", \"XL\"]",
      "colors": "[\"Black\", \"White\", \"Navy\"]",
      "material": "100% Cotton, 200 GSM, Bio-washed",
      "careInfo": "Machine wash cold, tumble dry low",
      "featured": true,
      "bestseller": false,
      "newArrival": true,
      "stock": 50,
      "rating": 4.5,
      "reviewCount": 12,
      "active": true,
      "createdAt": "2026-03-01T00:00:00.000Z",
      "updatedAt": "2026-03-10T00:00:00.000Z"
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 4
}
```

**Important:** `images`, `sizes`, and `colors` are JSON strings from SQLite. Parse with `JSON.parse()` on the client.

---

#### GET `/api/products/[slug]`
Fetch a single product by URL slug, including all reviews with user info.

**Response (200):** Full product object with nested `reviews` array. Each review includes:
```json
{
  "reviews": [
    {
      "id": "clxxxx...",
      "rating": 5,
      "title": "Amazing quality!",
      "comment": "Best t-shirt I've bought online.",
      "verified": true,
      "createdAt": "2026-03-05T00:00:00.000Z",
      "user": { "name": "Priya S.", "image": null }
    }
  ]
}
```

**Error:** `404` if product not found or inactive.

---

#### GET `/api/products/[slug]/reviews`
Paginated reviews for a product.

**Query Params:** `page` (default 1), `limit` (default 10)

**Response (200):**
```json
{
  "reviews": [...],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

---

#### POST `/api/products/[slug]/reviews` -- Auth Required
Submit a review. One review per user per product (enforced with database query check).

**Request:**
```json
{
  "rating": 5,
  "title": "Great quality!",
  "comment": "Loved the fabric and fit."
}
```

**Validation:** `rating` required (integer, 1-5). `title` and `comment` are optional.

**Side Effect:** Updates product's `rating` and `reviewCount` using weighted average formula.

**Response (201):** Created review with user info.

**Errors:** `401` not authenticated, `400` invalid rating, `404` product not found, `409` already reviewed.

---

#### GET `/api/search`
Quick product search. Returns max 10 results sorted by rating (descending).

**Query:** `?q=oversized` (required)

Searches across `name`, `description`, and `category` fields using `contains`.

**Response (200):**
```json
{
  "products": [
    {
      "id": "...", "name": "...", "slug": "...",
      "price": 699, "comparePrice": 999,
      "images": "[...]", "category": "...",
      "gender": "...", "rating": 4.5
    }
  ]
}
```

Returns `{ "products": [] }` if query is empty.

---

### Order Endpoints

#### GET `/api/orders` -- Auth Required
List the authenticated user's orders with full item details, paginated.

**Query Params:** `page` (default 1), `limit` (default 10)

**Response (200):** Paginated orders, each with nested `items` including `product.name`, `product.slug`, and `product.images`.

---

#### POST `/api/orders` -- Auth Required
Create an order directly (without Stripe payment flow).

**Request:**
```json
{
  "items": [
    { "productId": "clxxxx...", "quantity": 2, "size": "L", "color": "Black" }
  ],
  "shippingAddress": {
    "name": "John Doe", "phone": "9876543210",
    "street": "123 Main St", "city": "Mumbai",
    "state": "Maharashtra", "zipCode": "400001"
  },
  "billingAddress": null,
  "notes": "Please gift wrap"
}
```

**Business Logic:**
1. Validates all products exist, are active, and have sufficient stock
2. Calculates subtotal from current product prices
3. Shipping: free if subtotal >= Rs.999, otherwise Rs.99
4. Tax: 18% GST on subtotal
5. Total = subtotal + shipping + tax
6. Creates order with items in a single Prisma transaction
7. Decrements product stock for each item

**Response (201):** Full order object with items and product details.

---

#### GET `/api/orders/[id]` -- Auth Required
Fetch a specific order. Returns `403` if the authenticated user is not the order owner.

---

### Checkout Endpoints (Stripe)

#### POST `/api/checkout` -- Auth Required
Create a Stripe Checkout Session for payment.

**Request:**
```json
{
  "items": [
    { "productId": "clxxxx...", "quantity": 1, "size": "M", "color": "White" }
  ],
  "shippingAddress": {
    "name": "John", "street": "123 Main St",
    "city": "Mumbai", "state": "Maharashtra", "zipCode": "400001"
  }
}
```

**Process:**
1. Validates auth, items, and address
2. Fetches product details, builds Stripe line items (currency: INR, amounts in paise)
3. Adds Rs.99 shipping line item if subtotal < Rs.999
4. Stores `userId`, `shippingAddress`, and `items` in Stripe session metadata
5. Sets success/cancel URLs

**Response (200):**
```json
{
  "sessionId": "cs_test_xxxx...",
  "url": "https://checkout.stripe.com/pay/cs_test_xxxx..."
}
```

Client should redirect to the returned `url`.

---

#### POST `/api/checkout/verify` -- Auth Required
Verify a completed Stripe payment and create the corresponding order. This endpoint is idempotent -- calling it multiple times with the same session ID returns the existing order.

**Request:** `{ "sessionId": "cs_test_xxxx..." }`

**Process:**
1. Retrieves Stripe Checkout Session
2. Checks `payment_status === 'paid'`
3. Checks if order already exists for this payment (prevents duplicates)
4. Parses items and address from session metadata
5. Creates order with `status: 'confirmed'`, `paymentStatus: 'paid'`, `paymentMethod: 'stripe'`
6. Decrements product stock

**Response (200):** Created (or existing) order object.

---

### Wishlist Endpoints -- All Auth Required

#### GET `/api/wishlist`
Returns array of wishlist items with full product details, sorted by creation date (newest first).

#### POST `/api/wishlist`
Add a product to wishlist. Body: `{ "productId": "..." }`
- Returns `404` if product not found/inactive
- Returns `409` if already in wishlist
- Returns `201` with wishlist item and product details

#### DELETE `/api/wishlist`
Remove from wishlist. Body: `{ "productId": "..." }`
- Returns `404` if not in wishlist
- Returns `200` with success message

---

### User Profile Endpoints -- All Auth Required

#### GET `/api/users/profile`
Returns: id, name, email, image, phone, role, createdAt

#### PUT `/api/users/profile`
Update profile fields. All fields optional:
```json
{ "name": "New Name", "phone": "9876543210", "image": "https://..." }
```

---

### Address Endpoints -- All Auth Required

#### GET `/api/users/addresses`
List saved addresses, sorted by `isDefault` descending.

#### POST `/api/users/addresses`
Create address. **Required:** name, phone, street, city, state, zipCode. **Optional:** country (defaults to "India"), isDefault.

Setting `isDefault: true` automatically sets all other addresses to `isDefault: false`.

#### PUT `/api/users/addresses/[id]`
Update address. Owner-only (returns `403` if not owner). All fields optional.

#### DELETE `/api/users/addresses/[id]`
Delete address. Owner-only.

---

### Public Endpoints (No Auth Required)

#### POST `/api/newsletter`
Subscribe to newsletter. Body: `{ "email": "..." }`

Uses Prisma `upsert` -- if email exists but is inactive, re-activates it.

#### POST `/api/contact`
Submit contact form. Body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Order inquiry",
  "message": "I have a question about my order..."
}
```

All fields required. Message minimum 10 characters. Email validated with regex.

---

## 5. Authentication Flow

### Overview

Authentication uses NextAuth.js v5 with two providers:
1. **Credentials Provider:** Email + password (bcrypt hashed, 10 salt rounds)
2. **Google OAuth Provider:** Sign in with Google (requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`)

**Session Strategy:** JWT (stateless). No server-side session storage. The JWT contains `{ id, email, name }` and is stored in an HttpOnly cookie named `next-auth.session-token`.

### Credentials Login Flow

```
1. User submits email + password
2. NextAuth CredentialsProvider.authorize() is called
3. Looks up user by email in database
4. Compares password with bcrypt hash
5. If valid: returns user object -> JWT generated -> cookie set
6. If invalid: throws error -> user sees error message
```

### Google OAuth Flow

```
1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. Google redirects back with authorization code
4. NextAuth exchanges code for tokens
5. PrismaAdapter creates/links Account record
6. JWT generated -> cookie set
```

### Session Access

In any API route or server component:
```typescript
import { auth } from '@/lib/auth'

const session = await auth()
// session?.user?.id -- the authenticated user's database ID
// session?.user?.email
// session?.user?.name
```

### JWT Callbacks

The `jwt` callback adds `user.id` to the token on sign-in. The `session` callback copies `token.id` to `session.user.id`, making the user's database ID available in the session.

### Protected Routes (Middleware)

`src/middleware.ts` intercepts requests to:
- `/profile/*`
- `/checkout/*`

Unauthenticated users are redirected to `/login?callbackUrl=/original-path`. After login, they are redirected back to their intended destination.

---

## 6. Payment Integration (Stripe)

### Configuration

**File:** `src/lib/stripe.ts`

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100)  // Rs.699 -> 69900 paise
}

export function formatAmountFromStripe(amount: number): number {
  return amount / 100  // 69900 paise -> Rs.699
}
```

### Complete Payment Flow

```
Step 1: Customer clicks "Pay Now" on checkout page
        |
Step 2: Client sends POST /api/checkout
        { items: [...], shippingAddress: {...} }
        |
Step 3: Server creates Stripe Checkout Session
        - Converts prices to paise (INR smallest unit)
        - Creates line items for each product
        - Adds Rs.99 shipping if subtotal < Rs.999
        - Stores userId, items, address in metadata
        - Sets success_url and cancel_url
        |
Step 4: Server returns { sessionId, url }
        Client redirects to Stripe hosted checkout page
        |
Step 5: Customer enters card details on Stripe's page
        (PCI-compliant, card data never touches our server)
        |
Step 6: On successful payment, Stripe redirects to:
        /checkout/success?session_id={CHECKOUT_SESSION_ID}
        |
Step 7: Success page calls POST /api/checkout/verify
        { sessionId: "cs_..." }
        |
Step 8: Server retrieves Stripe session
        Verifies payment_status === 'paid'
        Checks for duplicate order (idempotent)
        Creates Order in database from metadata
        Decrements product stock
        |
Step 9: Customer sees order confirmation
        Cart is cleared on client side
```

### Metadata Storage

Stripe session metadata stores (max 500 chars per value):
- `userId`: Database ID of the authenticated user
- `shippingAddress`: JSON-serialized address object
- `items`: JSON-serialized array of `{ productId, quantity, size, color }`

### Test Mode

Use Stripe test keys (`pk_test_`, `sk_test_`) during development:
- Standard test card: `4242 4242 4242 4242`
- 3D Secure test card (India): `4000 0035 6000 0008`
- Any future expiration date
- Any 3-digit CVC

---

## 7. Deployment Guide

### Prerequisites
- VPS with minimum 1GB RAM, 1 vCPU (recommended: DigitalOcean $12/month, Hetzner EUR5/month)
- Docker and Docker Compose installed
- Domain name with DNS A record pointing to server IP
- SSL certificate (automated via Nginx + Let's Encrypt)

### Step 1: Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update and install Docker
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y

# Create application directory
mkdir -p /opt/harungtan
```

### Step 2: Deploy Application

```bash
cd /opt/harungtan

# Clone or upload repository
git clone <repo-url> .

# Create production environment file
cat > .env << 'EOF'
DATABASE_URL=file:./prod.db
NEXTAUTH_URL=https://harungtan.com
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
NEXT_PUBLIC_APP_URL=https://harungtan.com
EOF

# Build and start
docker compose up -d --build

# Initialize database
docker compose exec web npx prisma db push
docker compose exec web npx tsx prisma/seed.ts  # optional
```

### Step 3: Nginx Reverse Proxy with SSL

```bash
# Install Nginx and Certbot
apt install nginx certbot python3-certbot-nginx -y

# Create Nginx configuration
cat > /etc/nginx/sites-available/harungtan << 'EOF'
server {
    listen 80;
    server_name harungtan.com www.harungtan.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable and reload
ln -s /etc/nginx/sites-available/harungtan /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Get SSL certificate (auto-configures Nginx)
certbot --nginx -d harungtan.com -d www.harungtan.com
```

### Step 4: Verify

- Visit `https://harungtan.com` -- homepage should load
- Test registration, login, product browsing, cart, checkout
- Check logs: `docker compose logs -f web`

### Docker Build Details

The `Dockerfile` uses a multi-stage build for minimal image size:

1. **deps stage:** `node:20-alpine`, installs production dependencies only (`npm ci --only=production`)
2. **builder stage:** Copies source + deps, runs `prisma generate` and `npm run build`
3. **runner stage:** Clean Alpine image with:
   - Non-root user (`nextjs:nodejs`, UID/GID 1001) for security
   - Only standalone Next.js output (no source code)
   - Prisma client and schema for database access
   - Final image size: ~150MB

### Updating Production

```bash
cd /opt/harungtan
git pull origin main
docker compose up -d --build
docker compose exec web npx prisma db push  # if schema changed
```

### Database Backups

```bash
# Manual backup
docker cp harungtan-web-1:/app/prisma/prod.db ./backups/prod-$(date +%Y%m%d).db

# Automated daily backup (add to crontab)
0 2 * * * docker cp harungtan-web-1:/app/prisma/prod.db /opt/backups/prod-$(date +\%Y\%m\%d).db
```

### Scaling Considerations

When traffic grows beyond SQLite's capabilities:
1. Switch Prisma provider from `sqlite` to `postgresql` in `schema.prisma`
2. Update `DATABASE_URL` to PostgreSQL connection string
3. Run `npx prisma db push` to create PostgreSQL schema
4. Migrate data from SQLite to PostgreSQL using export/import

---

## 8. Environment Variables

| Variable | Required | Client-Exposed | Description |
|----------|----------|---------------|-------------|
| `DATABASE_URL` | Yes | No | Database path. SQLite: `file:./dev.db`. PostgreSQL: `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Yes | No | Canonical URL of the app: `http://localhost:3000` (dev) or `https://harungtan.com` (prod) |
| `NEXTAUTH_SECRET` | Yes | No | Random string for JWT signing. Generate: `openssl rand -base64 32`. Must be 32+ characters. |
| `GOOGLE_CLIENT_ID` | Optional | No | Google Cloud Console OAuth 2.0 Client ID. Required for "Sign in with Google". |
| `GOOGLE_CLIENT_SECRET` | Optional | No | Corresponding Google OAuth client secret. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | **Yes** | Stripe publishable key. Starts with `pk_test_` (dev) or `pk_live_` (prod). |
| `STRIPE_SECRET_KEY` | Yes | No | Stripe secret key. Starts with `sk_test_` or `sk_live_`. Never expose client-side. |
| `STRIPE_WEBHOOK_SECRET` | Yes | No | Stripe webhook endpoint signing secret. Starts with `whsec_`. |
| `NEXT_PUBLIC_APP_URL` | Yes | **Yes** | Public-facing URL used in Stripe redirect URLs and meta tags. |

**Security notes:**
- Variables prefixed with `NEXT_PUBLIC_` are embedded in the client-side JavaScript bundle and visible to users.
- Never prefix `STRIPE_SECRET_KEY`, `NEXTAUTH_SECRET`, or `GOOGLE_CLIENT_SECRET` with `NEXT_PUBLIC_`.
- Use separate Stripe keys for development (test mode) and production (live mode).

---

## 9. Development Setup

### Prerequisites
- **Node.js** 20.x or later (includes npm 10.x+)
- **Git**

### Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd harungtan
npm install

# 2. Configure environment
# Create .env file in project root:
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-at-least-32-characters-long"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxx"
STRIPE_SECRET_KEY="sk_test_xxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxx"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 3. Initialize database
npm run db:generate     # Generate Prisma client from schema
npm run db:push         # Create SQLite database with tables
npm run seed            # Populate with sample products, users, reviews

# 4. Start development
npm run dev             # http://localhost:3000 with hot reload
```

### Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with hot module replacement |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint across all source files |
| `npm run db:generate` | Generate Prisma client from `schema.prisma` |
| `npm run db:push` | Push schema to database (creates/updates tables) |
| `npm run db:studio` | Open Prisma Studio at `localhost:5555` (visual DB browser) |
| `npm run seed` | Run database seed script (`prisma/seed.ts`) |
| `npm run test` | Run Jest unit tests |
| `npm run test:watch` | Run Jest in watch mode (re-runs on file changes) |
| `npm run test:e2e` | Run Playwright end-to-end tests |

### Stripe Test Cards

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0035 6000 0008` | 3D Secure required (India) |
| `4000 0000 0000 0002` | Card declined |
| Any future date | Expiration |
| Any 3 digits | CVC |

### Prisma Studio

`npm run db:studio` opens a visual database browser at `http://localhost:5555`. Useful for:
- Viewing and editing records directly
- Checking relationships between models
- Debugging data issues
- Quick data entry during development

---

## 10. Folder Structure

```
harungtan/
|-- prisma/
|   |-- schema.prisma          # Database schema (12 models)
|   |-- seed.ts                # Seed script (sample products, users, reviews)
|   +-- dev.db                 # SQLite database file (gitignored)
|
|-- public/                    # Static assets served at root URL
|
|-- src/
|   |-- app/                   # Next.js App Router (pages + API)
|   |   |-- layout.tsx         # Root layout: HTML shell, fonts, global metadata
|   |   |-- page.tsx           # Homepage with hero, categories, featured products
|   |   |-- providers.tsx      # Client providers: NextAuth SessionProvider, Toaster
|   |   |-- loading.tsx        # Global loading spinner
|   |   |-- error.tsx          # Global error boundary
|   |   |-- not-found.tsx      # Custom 404 page
|   |   |-- sitemap.ts         # Dynamic XML sitemap (all products)
|   |   |-- robots.ts          # Robots.txt configuration
|   |   |
|   |   |-- (auth)/            # Auth route group (parentheses = no URL segment)
|   |   |   |-- layout.tsx     # Centered card layout for auth pages
|   |   |   |-- login/page.tsx
|   |   |   |-- signup/page.tsx
|   |   |   |-- forgot-password/page.tsx
|   |   |   +-- reset-password/page.tsx
|   |   |
|   |   |-- (shop)/            # Shop route group
|   |   |   |-- layout.tsx     # Full layout with header + footer
|   |   |   |-- products/
|   |   |   |   |-- page.tsx              # Product listing (SSR with filters)
|   |   |   |   |-- ProductsPageClient.tsx # Client-side filter interactions
|   |   |   |   +-- [slug]/
|   |   |   |       |-- page.tsx              # Product detail page (SSR)
|   |   |   |       +-- SingleProductClient.tsx # Add to cart, size/color selection
|   |   |   |-- cart/page.tsx              # Shopping cart
|   |   |   +-- checkout/
|   |   |       |-- page.tsx               # Checkout with address form
|   |   |       +-- success/page.tsx       # Post-payment confirmation
|   |   |
|   |   |-- profile/           # User profile (protected by middleware)
|   |   |   |-- layout.tsx     # Profile sidebar navigation
|   |   |   |-- page.tsx       # Profile overview / edit
|   |   |   |-- orders/page.tsx    # Order history
|   |   |   |-- wishlist/page.tsx  # Saved items
|   |   |   +-- settings/page.tsx  # Account settings
|   |   |
|   |   |-- api/               # Backend API routes
|   |   |   |-- auth/
|   |   |   |   |-- [...nextauth]/route.ts  # NextAuth catch-all handler
|   |   |   |   |-- register/route.ts       # POST: user registration
|   |   |   |   |-- forgot-password/route.ts # POST: request reset token
|   |   |   |   +-- reset-password/route.ts  # POST: reset password
|   |   |   |-- products/
|   |   |   |   |-- route.ts               # GET: list/filter products
|   |   |   |   +-- [slug]/
|   |   |   |       |-- route.ts           # GET: single product + reviews
|   |   |   |       +-- reviews/route.ts   # GET: paginated reviews, POST: create
|   |   |   |-- orders/
|   |   |   |   |-- route.ts               # GET: list orders, POST: create
|   |   |   |   +-- [id]/route.ts          # GET: single order
|   |   |   |-- checkout/
|   |   |   |   |-- route.ts               # POST: create Stripe session
|   |   |   |   +-- verify/route.ts        # POST: verify payment + create order
|   |   |   |-- users/
|   |   |   |   |-- profile/route.ts       # GET + PUT: user profile
|   |   |   |   +-- addresses/
|   |   |   |       |-- route.ts           # GET + POST: address list/create
|   |   |   |       +-- [id]/route.ts      # PUT + DELETE: address update/delete
|   |   |   |-- wishlist/route.ts          # GET + POST + DELETE
|   |   |   |-- search/route.ts            # GET: product search
|   |   |   |-- newsletter/route.ts        # POST: email subscription
|   |   |   +-- contact/route.ts           # POST: contact form
|   |   |
|   |   |-- about/page.tsx                 # About Harungtan
|   |   |-- help/page.tsx                  # Help center / FAQ
|   |   |-- guidelines/page.tsx            # Community guidelines
|   |   |-- privacy-policy/page.tsx
|   |   |-- terms-of-service/page.tsx
|   |   |-- return-policy/page.tsx
|   |   |-- refund-policy/page.tsx
|   |   +-- shipping-policy/page.tsx
|   |
|   |-- components/
|   |   |-- ui/                # Reusable UI primitives (design system)
|   |   |   |-- Button.tsx     # Primary, secondary, ghost variants
|   |   |   |-- Input.tsx      # Form input with label and error state
|   |   |   |-- Select.tsx     # Dropdown select
|   |   |   |-- Badge.tsx      # Status badges (new, sale, sold out)
|   |   |   |-- Modal.tsx      # Dialog overlay
|   |   |   |-- Spinner.tsx    # Loading spinner
|   |   |   |-- Rating.tsx     # Star rating display
|   |   |   |-- Pagination.tsx # Page navigation
|   |   |   |-- Breadcrumb.tsx # Navigation breadcrumbs
|   |   |   |-- Skeleton.tsx   # Content loading placeholder
|   |   |   |-- Toast.tsx      # Notification toasts
|   |   |   +-- EmptyState.tsx # Empty state with icon and message
|   |   |
|   |   |-- layout/            # Structural layout components
|   |   |   |-- Header.tsx     # Navigation bar with logo, search, cart, user
|   |   |   |-- Footer.tsx     # Footer with links, newsletter, social
|   |   |   |-- MobileMenu.tsx # Slide-out mobile navigation
|   |   |   |-- CartSidebar.tsx # Slide-out cart panel
|   |   |   +-- AnnouncementBar.tsx # Top banner (free shipping, sales)
|   |   |
|   |   |-- home/              # Homepage section components
|   |   |   |-- HeroSection.tsx        # Full-width hero banner
|   |   |   |-- CategorySection.tsx    # Category grid navigation
|   |   |   |-- FeaturedProducts.tsx   # Featured product carousel
|   |   |   |-- NewArrivals.tsx        # New arrivals grid
|   |   |   |-- BestsellerSection.tsx  # Bestseller products
|   |   |   |-- WhyChooseUs.tsx        # USP cards
|   |   |   |-- TestimonialSection.tsx # Customer testimonials
|   |   |   +-- NewsletterSection.tsx  # Email signup CTA
|   |   |
|   |   +-- products/          # Product-specific components
|   |       |-- ProductCard.tsx     # Product card for grids (image, name, price, rating)
|   |       |-- ProductGrid.tsx     # Responsive product grid layout
|   |       |-- ProductFilters.tsx  # Filter sidebar (category, price, size, color)
|   |       |-- ProductDetails.tsx  # Full PDP content (images, details, add-to-cart)
|   |       |-- ProductReviews.tsx  # Review list with submission form
|   |       +-- SizeGuide.tsx       # Size guide modal with measurement table
|   |
|   |-- lib/                   # Shared utilities and configuration
|   |   |-- auth.ts            # NextAuth.js configuration (providers, callbacks, adapter)
|   |   |-- prisma.ts          # Prisma client singleton (prevents multiple instances in dev)
|   |   |-- stripe.ts          # Stripe client initialization + amount conversion helpers
|   |   |-- store.ts           # Zustand stores: useCartStore (persisted), useWishlistStore (persisted)
|   |   |-- utils.ts           # General utility functions
|   |   +-- structured-data.ts # JSON-LD structured data generators (Product, Organization, WebSite)
|   |
|   |-- types/
|   |   +-- index.ts           # TypeScript interfaces (Product, Order, Review, Address, FilterParams)
|   |                          # + serializeProduct() helper for JSON field parsing
|   |
|   +-- middleware.ts          # Next.js middleware: protects /profile/* and /checkout/*
|
|-- __tests__/                 # Test suite
|-- docs/                      # Business and technical documentation
|-- Dockerfile                 # Multi-stage production Docker build
|-- docker-compose.yml         # Docker Compose: web service + volume for DB persistence
|-- package.json               # Dependencies, scripts, Prisma seed config
|-- tsconfig.json              # TypeScript compiler configuration
|-- next.config.ts             # Next.js: image optimization, compression, package optimization
|-- eslint.config.mjs          # ESLint flat config with Next.js rules
|-- jest.config.ts             # Jest: ts-jest transformer, jsdom environment, path aliases
|-- jest.setup.ts              # Jest setup: testing-library/jest-dom matchers
|-- playwright.config.ts       # Playwright: browser configs, base URL, timeouts
+-- postcss.config.mjs         # PostCSS: Tailwind CSS plugin
```

### Conventions

- **`(group)/`** -- Next.js route groups. Organize routes without affecting URLs. `(auth)/login` maps to `/login`, not `/auth/login`.
- **`[param]/`** -- Dynamic route segments. `products/[slug]` matches any `/products/<value>`.
- **`route.ts`** -- API route files. Export named functions matching HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **`page.tsx`** -- Page components rendered for the matching route.
- **`layout.tsx`** -- Layout components that wrap child pages and persist across navigations within the group.

---

*This documentation should be updated whenever significant changes are made to the architecture, API endpoints, database schema, or deployment process. Last updated: March 2026.*

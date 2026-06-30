# Cloudinary Setup Guide for Harungtan

## What is Cloudinary?

Cloudinary is an image and video CDN (Content Delivery Network) that automatically optimizes, transforms, and delivers media files. For Harungtan, it means:

- **Faster page loads** — images are served from edge servers closest to the user
- **Automatic format conversion** — serves WebP/AVIF to supported browsers, falls back to JPEG/PNG
- **Automatic quality optimization** — reduces file size without visible quality loss
- **On-the-fly resizing** — no need to manually create thumbnails; URLs control the output size
- **Free tier** — 25 credits/month (~25 GB bandwidth OR ~25K transformations), more than enough for a starting store

---

## Step 1: Create a Cloudinary Account

1. Go to **https://cloudinary.com/users/register_free**
2. Fill in your name, email, and password (or sign up with Google/GitHub)
3. When prompted for a **cloud name**, choose something memorable (e.g., `harungtan`). This becomes part of every image URL.
4. After sign-up, you land on the **Dashboard**. Note your **Cloud Name** — you'll need it in Step 3.

> **Tip:** The free plan includes 25 credits/month. 1 credit ≈ 1 GB of managed storage, 1 GB of bandwidth, or 1,000 transformations. This is plenty for a new store with up to ~500 products.

---

## Step 2: Create a Folder Structure

Good folder organization makes it easy to manage hundreds of product images.

1. In the Cloudinary console, go to **Media Library** (left sidebar).
2. Click **Create Folder** and name it `harungtan` (this is the base folder).
3. Inside `harungtan`, create subfolders:

```
harungtan/
├── products/       ← product images (e.g., round-neck-black-front.jpg)
├── banners/        ← homepage hero banners, promotional images
├── categories/     ← category header images
├── blog/           ← blog post cover images
└── misc/           ← logo, favicon, og-image, etc.
```

---

## Step 3: Add Environment Variables

Add these to your `.env.local` file (never commit this file):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_FOLDER="harungtan"
```

Replace `your-cloud-name` with the Cloud Name from your Cloudinary dashboard.

---

## Step 4: Upload Product Images

### Option A: Upload via Cloudinary Console (Recommended for initial setup)

1. Go to **Media Library** → **harungtan/products/**
2. Click **Upload** (top right) and drag-drop your images
3. Cloudinary auto-generates a **Public ID** based on the filename
   - Example: uploading `round-neck-black-front.jpg` → public ID becomes `harungtan/products/round-neck-black-front`

### Option B: Upload via Cloudinary API (For automation / bulk uploads)

Use the unsigned upload preset for client-side uploads or the API key for server-side:

```bash
# Server-side upload example (cURL)
curl https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@./product-photo.jpg" \
  -F "folder=harungtan/products" \
  -F "upload_preset=YOUR_UNSIGNED_PRESET"
```

To create an **unsigned upload preset**:
1. Go to **Settings** → **Upload** → **Upload presets**
2. Click **Add upload preset**
3. Set signing mode to **Unsigned**
4. Set default folder to `harungtan/products`
5. Save and note the preset name

### Naming Convention for Product Images

Use consistent naming so the codebase can predictably build URLs:

```
{product-slug}-{view}.{ext}

Examples:
  round-neck-black-front.jpg
  round-neck-black-back.jpg
  round-neck-black-detail.jpg
  oversized-white-front.jpg
  oversized-white-model.jpg
```

---

## Step 5: Use Cloudinary Images in the Website

The project includes a utility at `src/lib/cloudinary.ts` with helper functions.

### Basic Usage

```tsx
import { cloudinaryUrl } from '@/lib/cloudinary'

// Auto-optimized (format + quality)
<img src={cloudinaryUrl('products/round-neck-black-front')} alt="..." />

// With specific dimensions
<img src={cloudinaryUrl('products/round-neck-black-front', {
  width: 600,
  height: 800,
  crop: 'fill'
})} alt="..." />
```

### With Next.js Image Component

```tsx
import Image from 'next/image'
import { cloudinaryLoader } from '@/lib/cloudinary'

<Image
  loader={cloudinaryLoader}
  src="products/round-neck-black-front"
  alt="Round Neck Black T-Shirt"
  width={600}
  height={800}
/>
```

### Pre-built Helpers

```tsx
import {
  productCardImage,    // 600×800 fill — for product listing cards
  productDetailImage,  // 1200×1600 limit — for product detail pages
  thumbnailImage,      // 150×150 fill — for cart/order items
} from '@/lib/cloudinary'

// Product card
<img src={productCardImage('products/round-neck-black-front')} alt="..." />

// Product detail page
<img src={productDetailImage('products/round-neck-black-front')} alt="..." />

// Cart thumbnail
<img src={thumbnailImage('products/round-neck-black-front')} alt="..." />

// Custom size thumbnail
<img src={thumbnailImage('products/round-neck-black-front', 200)} alt="..." />
```

### Responsive Images

```tsx
import { cloudinaryResponsive } from '@/lib/cloudinary'

const sources = cloudinaryResponsive('products/round-neck-black-front')
// Returns: [{ url: '...w_320...', width: 320 }, { url: '...w_480...', width: 480 }, ...]

<img
  src={sources[3].url}
  srcSet={sources.map(s => `${s.url} ${s.width}w`).join(', ')}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  alt="..."
/>
```

---

## Step 6: Store Image URLs in the Database

When adding products to the database (via seed script or admin panel), store the **Cloudinary public ID** (not the full URL) in the `images` field:

```json
{
  "images": "[\"products/round-neck-black-front\", \"products/round-neck-black-back\"]"
}
```

Then in the frontend, pass these IDs through the Cloudinary helpers to generate optimized URLs. This approach means:
- You can change image dimensions/quality without updating the database
- Switching CDN providers later only requires changing the URL builder
- The same image ID generates different URLs for cards vs. detail pages vs. thumbnails

---

## Step 7: Migrate Existing Images

If you already have local images in `/public/`:

1. **Upload them** to Cloudinary under `harungtan/products/`
2. **Update the database** — change image paths from `/images/product-1.jpg` to `products/product-1` (the Cloudinary public ID)
3. **Update the seed script** (`prisma/seed.ts`) to use Cloudinary public IDs

You can keep local fallback images in `/public/` during the transition. The `cloudinaryUrl()` function returns the raw `publicId` when `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is not set, so local dev without Cloudinary still works.

---

## URL Anatomy

Understanding how Cloudinary URLs work helps with debugging:

```
https://res.cloudinary.com/CLOUD_NAME/image/upload/TRANSFORMS/VERSION/PUBLIC_ID
                          ↑                        ↑           ↑       ↑
                     your cloud name         f_auto,q_auto   v1    harungtan/products/slug
```

### Common Transformations

| Transform | Meaning | Example |
|-----------|---------|---------|
| `f_auto` | Auto-detect best format (WebP/AVIF/JPEG) | Always use this |
| `q_auto` | Auto-optimize quality | Always use this |
| `w_600` | Width 600px | Product cards |
| `h_800` | Height 800px | Product cards |
| `c_fill` | Crop to exact dimensions | Cards, thumbnails |
| `c_limit` | Scale down but don't upscale or crop | Detail pages |
| `g_auto` | Smart gravity (focus on subject) | Product photos |
| `g_face` | Focus on faces | Model photos |
| `dpr_2.0` | 2x resolution for retina | High-DPI screens |
| `e_sharpen` | Sharpen image | After heavy resize |

### Example URLs

```
# Auto-optimized, 600px wide product card
https://res.cloudinary.com/harungtan/image/upload/f_auto,q_auto,w_600,h_800,c_fill,g_auto/v1/harungtan/products/round-neck-black-front

# Full-size detail view
https://res.cloudinary.com/harungtan/image/upload/f_auto,q_auto,w_1200,c_limit/v1/harungtan/products/round-neck-black-front

# 150px square thumbnail
https://res.cloudinary.com/harungtan/image/upload/f_auto,q_auto,w_150,h_150,c_fill,g_auto/v1/harungtan/products/round-neck-black-front
```

---

## Free Tier Limits & Tips

| Resource | Free Tier Limit |
|----------|----------------|
| Storage | 25 GB |
| Bandwidth | 25 GB/month |
| Transformations | 25,000/month |
| Video | 25 credits/month (shared pool) |

### Tips to Stay Within Free Limits

1. **Always use `f_auto,q_auto`** — reduces bandwidth by 40-60% compared to unoptimized images
2. **Use consistent sizes** — Cloudinary caches transformed images; using the same dimensions across cards means the transform is computed once
3. **Don't over-transform** — stick to the pre-built helpers (`productCardImage`, `thumbnailImage`, etc.) rather than creating unique sizes per page
4. **Lazy load below-the-fold images** — reduces bandwidth by not loading images users never scroll to (Next.js Image does this by default)
5. **Use `loading="eager"` only for hero/above-fold images** — everything else should lazy-load

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set in `.env.local` |
| 404 on image URL | Verify the public ID exists in Media Library; check folder path |
| Images look blurry | Increase width/height or use `dpr_2.0` for retina displays |
| Slow first load | First request for a new transformation is slow (Cloudinary generates it); subsequent requests are cached at edge |
| Build warning about remote patterns | Ensure `res.cloudinary.com` is in `next.config.ts` remotePatterns |

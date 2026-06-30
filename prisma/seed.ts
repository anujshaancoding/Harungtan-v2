import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper to generate picsum image URLs (consistent per seed)
const img = (seed: string, w = 600, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

const products = [
  // ─── Men's Round Neck ──────────────────────────────────────
  {
    name: 'Classic Cotton Round Neck Tee',
    slug: 'classic-cotton-round-neck-tee-black',
    description:
      'Our signature round neck t-shirt crafted from 100% premium combed cotton. Features a classic fit with reinforced stitching for lasting durability. The perfect everyday essential that pairs with anything in your wardrobe.',
    price: 599,
    comparePrice: 999,
    category: 'round-neck',
    gender: 'men',
    images: JSON.stringify([
      img('rn-classic-1'),
      img('rn-classic-2'),
      img('rn-classic-3'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Black', 'White', 'Navy']),
    material: '100% Combed Cotton, 180 GSM',
    careInfo:
      'Machine wash cold. Tumble dry low. Do not bleach. Iron on low heat.',
    featured: true,
    bestseller: true,
    newArrival: false,
    stock: 150,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    name: 'Essential Round Neck Tee',
    slug: 'essential-round-neck-tee-white',
    description:
      'A wardrobe must-have. This essential round neck tee is made from breathable cotton that keeps you comfortable all day. Minimal design, maximum impact.',
    price: 499,
    comparePrice: 799,
    category: 'round-neck',
    gender: 'men',
    images: JSON.stringify([
      img('rn-essential-1'),
      img('rn-essential-2'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['White', 'Grey', 'Olive']),
    material: '100% Cotton, 160 GSM',
    careInfo: 'Machine wash cold. Tumble dry low. Do not bleach.',
    featured: true,
    bestseller: false,
    newArrival: true,
    stock: 200,
    rating: 4.3,
    reviewCount: 85,
  },

  // ─── Men's V-Neck ─────────────────────────────────────────
  {
    name: 'Premium V-Neck Slim Fit',
    slug: 'premium-v-neck-slim-fit',
    description:
      'Elevate your casual style with this premium V-neck tee. Crafted with a slim fit silhouette that flatters your form. Made from ultra-soft Supima cotton for a luxurious feel against your skin.',
    price: 799,
    comparePrice: 1299,
    category: 'v-neck',
    gender: 'men',
    images: JSON.stringify([
      img('vn-premium-1'),
      img('vn-premium-2'),
      img('vn-premium-3'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Black', 'Navy', 'Maroon']),
    material: 'Supima Cotton, 200 GSM',
    careInfo: 'Machine wash cold. Hang dry recommended. Iron on medium.',
    featured: true,
    bestseller: true,
    newArrival: false,
    stock: 100,
    rating: 4.7,
    reviewCount: 96,
  },
  {
    name: 'Casual V-Neck Daily Wear',
    slug: 'casual-v-neck-daily-wear',
    description:
      'Your go-to daily V-neck that combines comfort with style. Relaxed fit with just the right neckline depth. Perfect for layering or wearing solo.',
    price: 549,
    comparePrice: 899,
    category: 'v-neck',
    gender: 'men',
    images: JSON.stringify([
      img('vn-casual-1'),
      img('vn-casual-2'),
    ]),
    sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Grey', 'Blue', 'Green']),
    material: 'Cotton Blend, 170 GSM',
    careInfo: 'Machine wash cold. Tumble dry low.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 120,
    rating: 4.2,
    reviewCount: 54,
  },

  // ─── Men's Polo ───────────────────────────────────────────
  {
    name: 'Classic Polo Tee',
    slug: 'classic-polo-tee',
    description:
      'The quintessential polo shirt redefined. Features a ribbed collar, two-button placket, and side vents for ease of movement. Crafted from pique cotton for that textured look.',
    price: 999,
    comparePrice: 1599,
    category: 'polo',
    gender: 'men',
    images: JSON.stringify([
      img('polo-classic-1'),
      img('polo-classic-2'),
      img('polo-classic-3'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Black', 'White', 'Navy', 'Red']),
    material: 'Pique Cotton, 220 GSM',
    careInfo: 'Machine wash cold. Do not bleach. Iron on medium heat.',
    featured: true,
    bestseller: true,
    newArrival: false,
    stock: 80,
    rating: 4.6,
    reviewCount: 112,
  },
  {
    name: 'Sport Polo Performance Tee',
    slug: 'sport-polo-performance-tee',
    description:
      'Designed for the active lifestyle. This performance polo features moisture-wicking technology and stretch fabric that moves with you. From the golf course to the office.',
    price: 1199,
    comparePrice: 1899,
    category: 'polo',
    gender: 'men',
    images: JSON.stringify([
      img('polo-sport-1'),
      img('polo-sport-2'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Navy', 'Teal', 'Black']),
    material: 'Poly-Cotton Blend, Moisture Wicking, 200 GSM',
    careInfo: 'Machine wash cold. Do not iron on print.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 60,
    rating: 4.4,
    reviewCount: 38,
  },

  // ─── Men's Henley ─────────────────────────────────────────
  {
    name: 'Heritage Henley Tee',
    slug: 'heritage-henley-tee',
    description:
      'A timeless henley with modern construction. Features a three-button placket and slightly longer length. Made from garment-dyed cotton for a lived-in softness from day one.',
    price: 899,
    comparePrice: 1399,
    category: 'henley',
    gender: 'men',
    images: JSON.stringify([
      img('henley-heritage-1'),
      img('henley-heritage-2'),
      img('henley-heritage-3'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Olive', 'Maroon', 'Navy']),
    material: 'Garment-Dyed Cotton, 190 GSM',
    careInfo: 'Machine wash cold with similar colors. Hang dry.',
    featured: true,
    bestseller: false,
    newArrival: false,
    stock: 90,
    rating: 4.5,
    reviewCount: 67,
  },

  // ─── Men's Oversized ──────────────────────────────────────
  {
    name: 'Streetwear Oversized Drop Shoulder',
    slug: 'streetwear-oversized-drop-shoulder',
    description:
      'Make a statement with this oversized drop-shoulder tee. Cut from heavyweight cotton with a boxy fit that is the definition of street style. Pair with joggers or wide-leg pants.',
    price: 899,
    comparePrice: 1499,
    category: 'oversized',
    gender: 'men',
    images: JSON.stringify([
      img('os-street-1'),
      img('os-street-2'),
      img('os-street-3'),
    ]),
    sizes: JSON.stringify(['M', 'L', 'XL', 'XXL', '3XL']),
    colors: JSON.stringify(['Black', 'Beige', 'Lavender']),
    material: '100% Cotton, 240 GSM Heavyweight',
    careInfo: 'Machine wash cold. Tumble dry low. Iron inside out.',
    featured: true,
    bestseller: true,
    newArrival: true,
    stock: 110,
    rating: 4.8,
    reviewCount: 145,
  },
  {
    name: 'Urban Oversized Boxy Fit',
    slug: 'urban-oversized-boxy-fit',
    description:
      'The ultimate oversized tee for the modern urban lifestyle. Heavyweight fabric with a relaxed boxy silhouette. Designed to drape perfectly for that effortless cool look.',
    price: 799,
    comparePrice: 1299,
    category: 'oversized',
    gender: 'men',
    images: JSON.stringify([
      img('os-urban-1'),
      img('os-urban-2'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['White', 'Black', 'Mustard']),
    material: '100% Cotton, 220 GSM',
    careInfo: 'Machine wash cold. Do not bleach.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 130,
    rating: 4.3,
    reviewCount: 72,
  },

  // ─── Men's Graphic ────────────────────────────────────────
  {
    name: 'Minimal Abstract Graphic Tee',
    slug: 'minimal-abstract-graphic-tee',
    description:
      'Art meets fashion. This graphic tee features a subtle abstract print on the chest. Made from soft cotton with a regular fit for all-day comfort.',
    price: 749,
    comparePrice: 1199,
    category: 'graphic-tees',
    gender: 'men',
    images: JSON.stringify([
      img('gt-abstract-1'),
      img('gt-abstract-2'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Black', 'White']),
    material: '100% Cotton, 180 GSM, Screen Printed',
    careInfo: 'Machine wash inside out. Do not iron on print.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 85,
    rating: 4.1,
    reviewCount: 41,
  },
  {
    name: 'Typography Art Graphic Tee',
    slug: 'typography-art-graphic-tee',
    description:
      "Express yourself with this bold typography tee. Features a curated typographic design that speaks volumes. Premium print quality that won't fade or crack.",
    price: 699,
    comparePrice: 1099,
    category: 'graphic-tees',
    gender: 'men',
    images: JSON.stringify([
      img('gt-typo-1'),
      img('gt-typo-2'),
      img('gt-typo-3'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Black', 'Navy', 'Grey']),
    material: '100% Cotton, 180 GSM, DTG Printed',
    careInfo: 'Wash inside out. Cold water only. No bleach.',
    featured: true,
    bestseller: false,
    newArrival: false,
    stock: 95,
    rating: 4.4,
    reviewCount: 59,
  },

  // ─── Men's Acid Wash ──────────────────────────────────────
  {
    name: 'Vintage Acid Wash Tee',
    slug: 'vintage-acid-wash-tee',
    description:
      'Channel retro vibes with this acid wash tee. Each piece is uniquely treated for a one-of-a-kind vintage look. Heavyweight construction for a premium feel.',
    price: 999,
    comparePrice: 1599,
    category: 'acid-wash',
    gender: 'men',
    images: JSON.stringify([
      img('aw-vintage-1'),
      img('aw-vintage-2'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Grey', 'Blue', 'Black']),
    material: '100% Cotton, 200 GSM, Acid Washed',
    careInfo: 'Hand wash recommended. Cold water. Hang dry in shade.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 45,
    rating: 4.6,
    reviewCount: 33,
  },

  // ─── Women's Round Neck ───────────────────────────────────
  {
    name: "Soft Touch Women's Round Neck",
    slug: 'soft-touch-womens-round-neck',
    description:
      'Ultra-soft round neck tee designed for the modern woman. Features a flattering fit with a slightly shorter length that pairs perfectly with high-waisted bottoms.',
    price: 599,
    comparePrice: 999,
    category: 'round-neck',
    gender: 'women',
    images: JSON.stringify([
      img('wrn-soft-1'),
      img('wrn-soft-2'),
      img('wrn-soft-3'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['White', 'Pink', 'Lavender']),
    material: 'Micro Modal Cotton, 160 GSM',
    careInfo: 'Machine wash cold. Gentle cycle. Lay flat to dry.',
    featured: true,
    bestseller: true,
    newArrival: false,
    stock: 140,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    name: "Relaxed Fit Women's Basic Tee",
    slug: 'relaxed-fit-womens-basic-tee',
    description:
      'The essential basic tee every woman needs. Relaxed fit with dropped shoulders for that effortlessly chic look. Incredibly soft fabric that gets better with every wash.',
    price: 549,
    comparePrice: 899,
    category: 'round-neck',
    gender: 'women',
    images: JSON.stringify([
      img('wrn-relaxed-1'),
      img('wrn-relaxed-2'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Black', 'Beige', 'Olive']),
    material: '100% Cotton, 150 GSM',
    careInfo: 'Machine wash cold. Tumble dry low.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 160,
    rating: 4.4,
    reviewCount: 89,
  },

  // ─── Women's V-Neck ───────────────────────────────────────
  {
    name: "Elegant V-Neck Women's Tee",
    slug: 'elegant-v-neck-womens-tee',
    description:
      'Feminine and sophisticated. This V-neck tee features a flattering neckline and tapered waist for a silhouette that complements your figure. Perfect for casual to smart-casual occasions.',
    price: 699,
    comparePrice: 1099,
    category: 'v-neck',
    gender: 'women',
    images: JSON.stringify([
      img('wvn-elegant-1'),
      img('wvn-elegant-2'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Black', 'White', 'Teal']),
    material: 'Supima Cotton, 170 GSM',
    careInfo: 'Machine wash cold. Hang dry recommended.',
    featured: true,
    bestseller: false,
    newArrival: true,
    stock: 100,
    rating: 4.5,
    reviewCount: 73,
  },

  // ─── Women's Crop Top ─────────────────────────────────────
  {
    name: 'Essential Crop Top',
    slug: 'essential-crop-top',
    description:
      'The go-to crop top for any occasion. Features a comfortable length that hits right at the waist. Made from stretchy cotton blend that moves with you.',
    price: 499,
    comparePrice: 799,
    category: 'crop-top',
    gender: 'women',
    images: JSON.stringify([
      img('wct-essential-1'),
      img('wct-essential-2'),
      img('wct-essential-3'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
    colors: JSON.stringify(['Black', 'White', 'Pink', 'Lavender']),
    material: 'Cotton-Spandex Blend, 180 GSM',
    careInfo: 'Machine wash cold. Do not bleach. Low heat iron.',
    featured: true,
    bestseller: true,
    newArrival: false,
    stock: 120,
    rating: 4.6,
    reviewCount: 134,
  },
  {
    name: 'Boxy Crop Tee',
    slug: 'boxy-crop-tee',
    description:
      'Trendy boxy crop tee with a modern silhouette. Oversized through the body with a cropped length. The perfect blend of comfort and street style.',
    price: 599,
    comparePrice: 999,
    category: 'crop-top',
    gender: 'women',
    images: JSON.stringify([
      img('wct-boxy-1'),
      img('wct-boxy-2'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Beige', 'Mustard', 'Grey']),
    material: '100% Cotton, 200 GSM',
    careInfo: 'Machine wash cold. Tumble dry low.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 90,
    rating: 4.3,
    reviewCount: 47,
  },

  // ─── Women's Oversized ────────────────────────────────────
  {
    name: 'Oversized Boyfriend Tee',
    slug: 'oversized-boyfriend-tee',
    description:
      'The iconic boyfriend tee reinvented. Extra relaxed fit with dropped shoulders and longer length. Looks amazing tucked in, tied at the waist, or worn loose.',
    price: 799,
    comparePrice: 1299,
    category: 'oversized',
    gender: 'women',
    images: JSON.stringify([
      img('wos-boyfriend-1'),
      img('wos-boyfriend-2'),
      img('wos-boyfriend-3'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Black', 'White', 'Olive', 'Lavender']),
    material: '100% Cotton, 220 GSM',
    careInfo: 'Machine wash cold. Hang dry.',
    featured: true,
    bestseller: true,
    newArrival: true,
    stock: 115,
    rating: 4.8,
    reviewCount: 167,
  },

  // ─── Women's Graphic ──────────────────────────────────────
  {
    name: "Floral Graphic Women's Tee",
    slug: 'floral-graphic-womens-tee',
    description:
      'Delicate floral artwork meets everyday comfort. This graphic tee features an exclusive botanical print that adds a touch of elegance to your casual wardrobe.',
    price: 699,
    comparePrice: 1099,
    category: 'graphic-tees',
    gender: 'women',
    images: JSON.stringify([
      img('wgt-floral-1'),
      img('wgt-floral-2'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['White', 'Black', 'Pink']),
    material: '100% Cotton, 170 GSM, Screen Printed',
    careInfo: 'Wash inside out. Cold water. Do not iron on print.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 75,
    rating: 4.5,
    reviewCount: 52,
  },

  // ─── Unisex ───────────────────────────────────────────────
  {
    name: 'Unisex Plain Premium Tee',
    slug: 'unisex-plain-premium-tee',
    description:
      'One tee for everyone. This unisex premium tee features a relaxed fit that looks great on all body types. Made from the finest combed cotton for unmatched softness.',
    price: 649,
    comparePrice: 999,
    category: 'plain',
    gender: 'unisex',
    images: JSON.stringify([
      img('uni-plain-1'),
      img('uni-plain-2'),
      img('uni-plain-3'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']),
    colors: JSON.stringify([
      'Black',
      'White',
      'Navy',
      'Grey',
      'Olive',
      'Beige',
    ]),
    material: '100% Combed Cotton, 180 GSM',
    careInfo: 'Machine wash cold. Tumble dry low.',
    featured: true,
    bestseller: true,
    newArrival: false,
    stock: 250,
    rating: 4.6,
    reviewCount: 203,
  },

  // ─── Men's Printed ────────────────────────────────────────
  {
    name: 'Geometric Print Tee',
    slug: 'geometric-print-tee',
    description:
      'Bold geometric patterns that turn heads. All-over print design with vibrant colors that stay vivid wash after wash. A statement piece for the fashion-forward.',
    price: 799,
    comparePrice: 1299,
    category: 'printed',
    gender: 'men',
    images: JSON.stringify([
      img('mp-geo-1'),
      img('mp-geo-2'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Black', 'White']),
    material: '100% Cotton, 180 GSM, Sublimation Printed',
    careInfo: 'Machine wash cold inside out. No bleach. Low heat iron.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 65,
    rating: 4.2,
    reviewCount: 28,
  },

  // ─── Women's Polo ─────────────────────────────────────────
  {
    name: "Women's Classic Polo",
    slug: 'womens-classic-polo',
    description:
      'Timeless polo designed for women. Features a tailored fit with a feminine silhouette. The ribbed collar and cuffs add structure while remaining comfortable.',
    price: 999,
    comparePrice: 1499,
    category: 'polo',
    gender: 'women',
    images: JSON.stringify([
      img('wp-classic-1'),
      img('wp-classic-2'),
      img('wp-classic-3'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['White', 'Black', 'Pink', 'Navy']),
    material: 'Pique Cotton, 200 GSM',
    careInfo: 'Machine wash cold. Do not bleach. Iron on medium.',
    featured: true,
    bestseller: false,
    newArrival: false,
    stock: 70,
    rating: 4.5,
    reviewCount: 45,
  },

  // ─── Men's Striped Henley ─────────────────────────────────
  {
    name: 'Striped Henley Tee',
    slug: 'striped-henley-tee',
    description:
      'Classic stripes meet the henley neckline. This tee features horizontal stripes in complementary colors with a buttoned henley placket. Nautical vibes, everyday wear.',
    price: 849,
    comparePrice: 1399,
    category: 'henley',
    gender: 'men',
    images: JSON.stringify([
      img('mh-striped-1'),
      img('mh-striped-2'),
    ]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Navy', 'Red', 'Green']),
    material: '100% Cotton, 180 GSM, Yarn Dyed Stripes',
    careInfo: 'Machine wash cold with similar colors.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 55,
    rating: 4.3,
    reviewCount: 31,
  },

  // ─── Women's Pastel Oversized ─────────────────────────────
  {
    name: "Pastel Oversized Women's Tee",
    slug: 'pastel-oversized-womens-tee',
    description:
      'Dreamy pastels in an oversized silhouette. This tee is all about soft colors and softer fabric. Perfect for creating a laid-back, feminine look.',
    price: 749,
    comparePrice: 1199,
    category: 'oversized',
    gender: 'women',
    images: JSON.stringify([
      img('wos-pastel-1'),
      img('wos-pastel-2'),
    ]),
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Pink', 'Lavender', 'Beige']),
    material: '100% Cotton, 200 GSM, Garment Dyed',
    careInfo: 'Machine wash cold. Hang dry in shade.',
    featured: false,
    bestseller: false,
    newArrival: true,
    stock: 80,
    rating: 4.6,
    reviewCount: 62,
  },
]

// ─── Reviewer Names ──────────────────────────────────────────
const reviewerNames = [
  'Aarav Sharma',
  'Priya Patel',
  'Rohan Gupta',
  'Ananya Singh',
  'Vikram Reddy',
  'Meera Joshi',
  'Arjun Kumar',
  'Sneha Nair',
  'Rahul Verma',
  'Kavya Iyer',
  'Aditya Deshmukh',
  'Ishita Malhotra',
]

const reviewPool = [
  {
    rating: 5,
    title: 'Amazing quality!',
    comment:
      "Best t-shirt I've ever owned. The fabric is so soft and comfortable. Definitely ordering more colors!",
  },
  {
    rating: 4,
    title: 'Great fit',
    comment:
      'Fits perfectly true to size. The color is exactly as shown on the website. Very happy with my purchase.',
  },
  {
    rating: 5,
    title: 'Worth every penny',
    comment:
      'Premium quality at an affordable price. The stitching is solid and it holds up well after 10+ washes.',
  },
  {
    rating: 4,
    title: 'Love the design',
    comment:
      'Simple yet elegant design. Goes well with everything in my wardrobe. The fabric is breathable for Indian summers.',
  },
  {
    rating: 5,
    title: 'Perfect daily wear',
    comment:
      "I bought 3 of these in different colors. They're my go-to t-shirts now. Highly recommended for everyday use!",
  },
  {
    rating: 3,
    title: 'Good but could be better',
    comment:
      'Quality is decent but the sizing runs slightly large. I would suggest ordering one size down. Fabric is nice though.',
  },
  {
    rating: 5,
    title: 'Exceeded expectations',
    comment:
      "Was skeptical at first but this tee is genuinely premium. The cotton is thick and doesn't shrink after washing.",
  },
  {
    rating: 4,
    title: 'Comfortable all day',
    comment:
      'Wore this for a full day of work and it stayed comfortable. No itching, good ventilation. Will buy more.',
  },
  {
    rating: 5,
    title: 'Best brand for basics',
    comment:
      'Finally found a brand that does basics right. The fit, fabric, and finish are all top-notch. 10/10 would recommend.',
  },
  {
    rating: 4,
    title: 'Fast delivery, great product',
    comment:
      'Arrived in 3 days. The packaging was nice and the t-shirt quality is really good for this price point.',
  },
  {
    rating: 5,
    title: 'Gifted to my friend, he loved it',
    comment:
      'Bought this as a birthday gift. The quality impressed everyone. The recipient has already ordered 2 more for himself!',
  },
  {
    rating: 4,
    title: 'Solid color, no fading',
    comment:
      "Washed it 5 times now and the color hasn't faded at all. Impressive quality for the price. Very satisfied customer.",
  },
]

async function main() {
  console.log('Seeding database...\n')

  // ─── Users ──────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@harungtan.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@harungtan.com',
      password: adminPassword,
      role: 'admin',
    },
  })

  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Test Customer',
      email: 'customer@example.com',
      password: customerPassword,
      phone: '+91 9876543210',
      role: 'customer',
    },
  })

  // Create reviewer accounts
  const reviewerPassword = await bcrypt.hash('reviewer123', 10)
  const reviewers = []
  for (const name of reviewerNames) {
    const email = name.toLowerCase().replace(/\s+/g, '.') + '@example.com'
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, password: reviewerPassword, role: 'customer' },
    })
    reviewers.push(user)
  }
  console.log(`  Created ${2 + reviewers.length} user accounts`)

  // ─── Products ───────────────────────────────────────────────
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }
  console.log(`  Seeded ${products.length} products with images`)

  // ─── Reviews ────────────────────────────────────────────────
  const allProducts = await prisma.product.findMany()
  await prisma.review.deleteMany()

  let reviewCount = 0
  for (let p = 0; p < allProducts.length; p++) {
    const product = allProducts[p]
    const numReviews = 2 + (p % 3) // 2-4 reviews per product
    for (let i = 0; i < numReviews; i++) {
      const reviewer =
        i === 0 ? customer : reviewers[(p + i) % reviewers.length]
      const review = reviewPool[(p * 3 + i) % reviewPool.length]
      await prisma.review.create({
        data: {
          userId: reviewer.id,
          productId: product.id,
          ...review,
          verified: (p + i) % 3 !== 0,
        },
      })
      reviewCount++
    }
  }
  console.log(`  Seeded ${reviewCount} reviews`)

  // ─── Customer Addresses ─────────────────────────────────────
  const existingAddresses = await prisma.address.count({
    where: { userId: customer.id },
  })
  if (existingAddresses === 0) {
    await prisma.address.createMany({
      data: [
        {
          userId: customer.id,
          name: 'Test Customer',
          phone: '+91 9876543210',
          street: '123 Fashion Street, Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400058',
          country: 'India',
          isDefault: true,
        },
        {
          userId: customer.id,
          name: 'Test Customer',
          phone: '+91 9876543210',
          street: '456 Tech Park, Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560034',
          country: 'India',
          isDefault: false,
        },
      ],
    })
  }
  console.log('  Seeded 2 customer addresses')

  // ─── Sample Orders ──────────────────────────────────────────
  const existingOrders = await prisma.order.count({
    where: { userId: customer.id },
  })
  if (existingOrders === 0) {
    const op = allProducts // shorthand

    // Order 1 — Delivered
    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'delivered',
        subtotal: 1997,
        shipping: 0,
        tax: 360,
        discount: 0,
        total: 2357,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        paymentId: 'pi_test_delivered_001',
        trackingNumber: 'HRG2026031001',
        shippingAddress: JSON.stringify({
          name: 'Test Customer',
          phone: '+91 9876543210',
          street: '123 Fashion Street, Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400058',
          country: 'India',
        }),
        items: {
          create: [
            {
              productId: op[0].id,
              quantity: 2,
              price: op[0].price,
              size: 'L',
              color: 'Black',
            },
            {
              productId: op[2].id,
              quantity: 1,
              price: op[2].price,
              size: 'M',
              color: 'Navy',
            },
          ],
        },
      },
    })

    // Order 2 — Shipped
    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'shipped',
        subtotal: 1698,
        shipping: 0,
        tax: 306,
        discount: 170,
        total: 1834,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        paymentId: 'pi_test_shipped_002',
        trackingNumber: 'HRG2026030802',
        shippingAddress: JSON.stringify({
          name: 'Test Customer',
          phone: '+91 9876543210',
          street: '456 Tech Park, Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560034',
          country: 'India',
        }),
        items: {
          create: [
            {
              productId: op[4].id,
              quantity: 1,
              price: op[4].price,
              size: 'L',
              color: 'Black',
            },
            {
              productId: op[7].id,
              quantity: 1,
              price: op[7].price,
              size: 'XL',
              color: 'Beige',
            },
          ],
        },
      },
    })

    // Order 3 — Processing
    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'processing',
        subtotal: 899,
        shipping: 99,
        tax: 162,
        discount: 0,
        total: 1160,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        paymentId: 'pi_test_processing_003',
        shippingAddress: JSON.stringify({
          name: 'Test Customer',
          phone: '+91 9876543210',
          street: '123 Fashion Street, Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400058',
          country: 'India',
        }),
        items: {
          create: [
            {
              productId: op[6].id,
              quantity: 1,
              price: op[6].price,
              size: 'M',
              color: 'Olive',
            },
          ],
        },
      },
    })
    console.log('  Seeded 3 sample orders')
  }

  // ─── Newsletter Subscribers ─────────────────────────────────
  const newsletterEmails = [
    'fashionlover@gmail.com',
    'style.guru@outlook.com',
    'trendsetter99@yahoo.com',
    'shopaholic.india@gmail.com',
    'minimal.vibes@proton.me',
  ]
  for (const email of newsletterEmails) {
    await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: { email },
    })
  }
  console.log('  Seeded 5 newsletter subscribers')

  // ─── Contact Messages ───────────────────────────────────────
  const existingMessages = await prisma.contactMessage.count()
  if (existingMessages === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: 'Ravi Shankar',
          email: 'ravi.shankar@gmail.com',
          subject: 'Bulk order inquiry',
          message:
            'Hi, I am interested in placing a bulk order of 50 t-shirts for our company event. Could you provide a quote for custom printing as well? We need them in 3 sizes — M, L, XL.',
          status: 'new',
        },
        {
          name: 'Deepa Menon',
          email: 'deepa.m@outlook.com',
          subject: 'Exchange request',
          message:
            'I received my order (HRG2026031001) yesterday but the size L is too loose. Can I exchange it for a size M? The quality is excellent by the way!',
          status: 'replied',
        },
        {
          name: 'Karthik R',
          email: 'karthik.r@yahoo.com',
          subject: 'Collaboration proposal',
          message:
            'I am a fashion influencer with 50K followers on Instagram. I would love to collaborate with Harungtan. Let me know if you are open to sending some samples for review.',
          status: 'new',
        },
      ],
    })
    console.log('  Seeded 3 contact messages')
  }

  // ─── Hero Banners ──────────────────────────────────────────
  const heroBanners = [
    {
      title: 'Wear What\nDefines You',
      subtitle: 'Spring/Summer 2026',
      description: 'Premium cotton essentials crafted for those who refuse to blend in. Designed in India, made to last.',
      mediaUrl: 'https://picsum.photos/seed/hero-editorial/1920/1080',
      mediaType: 'image',
      ctaText: 'Shop New Arrivals',
      ctaLink: '/products?newArrival=true',
      ctaText2: 'Explore All',
      ctaLink2: '/products',
      sortOrder: 0,
      active: true,
    },
    {
      title: 'Bold Moves\nOnly',
      subtitle: 'New Collection',
      description: 'Statement pieces that speak louder than words. Premium fabrics, unmatched comfort.',
      mediaUrl: 'https://picsum.photos/seed/hero-bold/1920/1080',
      mediaType: 'image',
      ctaText: 'Shop Collection',
      ctaLink: '/products?featured=true',
      ctaText2: null,
      ctaLink2: null,
      sortOrder: 1,
      active: true,
    },
    {
      title: 'Comfort\nRedefined',
      subtitle: 'Essentials',
      description: 'Everyday basics that feel anything but basic. 100% organic cotton, ethically made.',
      mediaUrl: 'https://picsum.photos/seed/hero-comfort/1920/1080',
      mediaType: 'image',
      ctaText: 'Shop Bestsellers',
      ctaLink: '/products?bestseller=true',
      ctaText2: null,
      ctaLink2: null,
      sortOrder: 2,
      active: true,
    },
  ]
  await prisma.heroBanner.deleteMany()
  for (const banner of heroBanners) {
    await prisma.heroBanner.create({ data: banner })
  }
  console.log(`  Seeded ${heroBanners.length} hero banners`)

  // ─── Site Images (Categories & Newsletter) ─────────────────
  const siteImages = [
    { section: 'category', key: 'round-neck', label: 'Round Neck', imageUrl: img('cat-roundneck', 800, 1000), link: '/products?category=round-neck', sortOrder: 0 },
    { section: 'category', key: 'v-neck', label: 'V-Neck', imageUrl: img('cat-vneck', 600, 800), link: '/products?category=v-neck', sortOrder: 1 },
    { section: 'category', key: 'polo', label: 'Polo', imageUrl: img('cat-polo', 600, 800), link: '/products?category=polo', sortOrder: 2 },
    { section: 'category', key: 'henley', label: 'Henley', imageUrl: img('cat-henley', 800, 1000), link: '/products?category=henley', sortOrder: 3 },
    { section: 'category', key: 'oversized', label: 'Oversized', imageUrl: img('cat-oversized', 800, 1000), link: '/products?category=oversized', sortOrder: 4 },
    { section: 'category', key: 'graphic-tees', label: 'Graphic Tees', imageUrl: img('cat-graphic', 600, 800), link: '/products?category=graphic-tees', sortOrder: 5 },
    { section: 'newsletter', key: 'newsletter-bg', label: 'Newsletter Background', imageUrl: img('newsletter-harungtan', 1200, 800), sortOrder: 0 },
    // Editorial
    { section: 'editorial', key: 'editorial-main', label: 'Editorial / Craftsmanship', imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=960&h=1200&fit=crop&q=80', sortOrder: 0 },
    // Lifestyle Banner
    { section: 'lifestyle', key: 'lifestyle-banner', label: 'Lifestyle Banner', imageUrl: img('harungtan-lifestyle', 1920, 1080), sortOrder: 0 },
    // Why Choose Us
    { section: 'why-choose-us', key: 'premium-cotton', label: 'Premium Cotton', imageUrl: img('harungtan-cotton', 800, 800), sortOrder: 0 },
    { section: 'why-choose-us', key: 'perfect-fit', label: 'Perfect Fit', imageUrl: img('harungtan-fit', 800, 800), sortOrder: 1 },
    { section: 'why-choose-us', key: 'built-to-last', label: 'Built to Last', imageUrl: img('harungtan-durability', 800, 800), sortOrder: 2 },
    // Instagram Feed
    { section: 'instagram', key: 'ig-1', label: 'Instagram 1', imageUrl: img('harungtan-ig-1', 600, 600), sortOrder: 0 },
    { section: 'instagram', key: 'ig-2', label: 'Instagram 2', imageUrl: img('harungtan-ig-2', 600, 600), sortOrder: 1 },
    { section: 'instagram', key: 'ig-3', label: 'Instagram 3', imageUrl: img('harungtan-ig-3', 600, 600), sortOrder: 2 },
    { section: 'instagram', key: 'ig-4', label: 'Instagram 4', imageUrl: img('harungtan-ig-4', 600, 600), sortOrder: 3 },
    { section: 'instagram', key: 'ig-5', label: 'Instagram 5', imageUrl: img('harungtan-ig-5', 600, 600), sortOrder: 4 },
    { section: 'instagram', key: 'ig-6', label: 'Instagram 6', imageUrl: img('harungtan-ig-6', 600, 600), sortOrder: 5 },
  ]
  await prisma.siteImage.deleteMany()
  for (const si of siteImages) {
    await prisma.siteImage.create({ data: si })
  }
  console.log(`  Seeded ${siteImages.length} site images`)

  console.log('\nDatabase seeding complete!')
  console.log('─────────────────────────────')
  console.log('Test accounts:')
  console.log('  Admin:    admin@harungtan.com / admin123')
  console.log('  Customer: customer@example.com / customer123')
  console.log('─────────────────────────────')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

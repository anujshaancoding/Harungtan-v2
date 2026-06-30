import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'
import { z } from 'zod'

const importProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive().max(999999),
  comparePrice: z.number().positive().max(999999).nullable().optional(),
  category: z.string().min(1),
  gender: z.string().min(1),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  material: z.string().nullable().optional(),
  stock: z.number().int().min(0).max(999999).default(0),
  featured: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { products } = await request.json()

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'No products to import' }, { status: 400 })
    }

    let imported = 0
    const errors: Array<{ index: number; name: string; error: string }> = []

    for (let i = 0; i < products.length; i++) {
      const p = products[i]
      const parsed = importProductSchema.safeParse(p)

      if (!parsed.success) {
        errors.push({
          index: i,
          name: p.name || `Product ${i + 1}`,
          error: parsed.error.issues.map((e) => e.message).join(', '),
        })
        continue
      }

      try {
        const data = parsed.data
        let slug = slugify(data.name, { lower: true, strict: true })

        const existing = await prisma.product.findUnique({ where: { slug } })
        if (existing) {
          slug = `${slug}-${Date.now().toString(36)}`
        }

        await prisma.product.create({
          data: {
            name: data.name,
            slug,
            description: data.description,
            price: data.price,
            comparePrice: data.comparePrice || null,
            category: data.category,
            gender: data.gender,
            sizes: JSON.stringify(data.sizes),
            colors: JSON.stringify(data.colors),
            images: JSON.stringify(data.images),
            material: data.material || null,
            stock: data.stock,
            featured: data.featured,
            active: true,
          },
        })
        imported++
      } catch (err) {
        errors.push({
          index: i,
          name: p.name || `Product ${i + 1}`,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({ imported, total: products.length, errors })
  } catch {
    return NextResponse.json({ error: 'Failed to import products' }, { status: 500 })
  }
}

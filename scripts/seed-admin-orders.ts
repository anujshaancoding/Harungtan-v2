import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Find admin user
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@harungtan.com' },
  })
  if (!admin) {
    console.error('Admin user not found! Run the main seed first.')
    process.exit(1)
  }

  // Get some products to use in orders
  const products = await prisma.product.findMany({ take: 10 })
  if (products.length < 5) {
    console.error('Not enough products. Run the main seed first.')
    process.exit(1)
  }

  // Check if admin already has orders
  const existing = await prisma.order.count({ where: { userId: admin.id } })
  if (existing > 0) {
    console.log(`Admin already has ${existing} orders. Skipping.`)
    return
  }

  const address1 = JSON.stringify({
    name: 'Admin',
    phone: '+91 9000000001',
    street: '12 MG Road, Fort',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
  })

  const address2 = JSON.stringify({
    name: 'Admin',
    phone: '+91 9000000001',
    street: '88 Brigade Road',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    country: 'India',
  })

  const p = products

  // Order 1 — PENDING (just placed, awaiting payment confirmation)
  await prisma.order.create({
    data: {
      userId: admin.id,
      status: 'pending',
      subtotal: 1198,
      shipping: 99,
      tax: 216,
      discount: 0,
      total: 1513,
      paymentStatus: 'pending',
      paymentMethod: 'stripe',
      shippingAddress: address1,
      statusHistory: JSON.stringify([
        { status: 'pending', timestamp: '2026-03-14T10:30:00Z' },
      ]),
      createdAt: new Date('2026-03-14T10:30:00Z'),
      items: {
        create: [
          {
            productId: p[0].id,
            quantity: 1,
            price: p[0].price,
            size: 'M',
            color: 'Black',
          },
          {
            productId: p[1].id,
            quantity: 1,
            price: p[1].price,
            size: 'L',
            color: 'White',
          },
        ],
      },
    },
  })
  console.log('  ✓ Order 1 — PENDING')

  // Order 2 — PROCESSING (paid, being packed)
  await prisma.order.create({
    data: {
      userId: admin.id,
      status: 'processing',
      subtotal: 899,
      shipping: 0,
      tax: 162,
      discount: 0,
      total: 1061,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      paymentId: 'pi_admin_processing_001',
      shippingAddress: address2,
      statusHistory: JSON.stringify([
        { status: 'pending', timestamp: '2026-03-12T14:00:00Z' },
        { status: 'processing', timestamp: '2026-03-12T16:45:00Z' },
      ]),
      createdAt: new Date('2026-03-12T14:00:00Z'),
      items: {
        create: [
          {
            productId: p[3].id,
            quantity: 1,
            price: p[3].price,
            size: 'XL',
            color: 'Navy',
          },
        ],
      },
    },
  })
  console.log('  ✓ Order 2 — PROCESSING')

  // Order 3 — SHIPPED (on the way)
  await prisma.order.create({
    data: {
      userId: admin.id,
      status: 'shipped',
      subtotal: 1797,
      shipping: 0,
      tax: 323,
      discount: 180,
      total: 1940,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      paymentId: 'pi_admin_shipped_002',
      trackingNumber: 'HRG2026030501',
      shippingAddress: address1,
      estimatedDelivery: new Date('2026-03-16T18:00:00Z'),
      statusHistory: JSON.stringify([
        { status: 'pending', timestamp: '2026-03-08T09:00:00Z' },
        { status: 'processing', timestamp: '2026-03-08T11:30:00Z' },
        { status: 'shipped', timestamp: '2026-03-10T08:15:00Z' },
      ]),
      createdAt: new Date('2026-03-08T09:00:00Z'),
      items: {
        create: [
          {
            productId: p[5].id,
            quantity: 2,
            price: p[5].price,
            size: 'M',
            color: 'White',
          },
          {
            productId: p[2].id,
            quantity: 1,
            price: p[2].price,
            size: 'L',
            color: 'Black',
          },
        ],
      },
    },
  })
  console.log('  ✓ Order 3 — SHIPPED')

  // Order 4 — DELIVERED (completed)
  await prisma.order.create({
    data: {
      userId: admin.id,
      status: 'delivered',
      subtotal: 2696,
      shipping: 0,
      tax: 485,
      discount: 270,
      total: 2911,
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      paymentId: 'pi_admin_delivered_003',
      trackingNumber: 'HRG2026022501',
      shippingAddress: address2,
      statusHistory: JSON.stringify([
        { status: 'pending', timestamp: '2026-02-25T11:00:00Z' },
        { status: 'processing', timestamp: '2026-02-25T14:00:00Z' },
        { status: 'shipped', timestamp: '2026-02-27T09:00:00Z' },
        { status: 'delivered', timestamp: '2026-03-02T16:30:00Z' },
      ]),
      createdAt: new Date('2026-02-25T11:00:00Z'),
      items: {
        create: [
          {
            productId: p[4].id,
            quantity: 1,
            price: p[4].price,
            size: 'L',
            color: 'Charcoal',
          },
          {
            productId: p[7].id,
            quantity: 2,
            price: p[7].price,
            size: 'M',
            color: 'Beige',
          },
        ],
      },
    },
  })
  console.log('  ✓ Order 4 — DELIVERED')

  // Order 5 — CANCELLED
  await prisma.order.create({
    data: {
      userId: admin.id,
      status: 'cancelled',
      subtotal: 599,
      shipping: 99,
      tax: 108,
      discount: 0,
      total: 806,
      paymentStatus: 'refunded',
      paymentMethod: 'stripe',
      paymentId: 'pi_admin_cancelled_004',
      shippingAddress: address1,
      notes: 'Customer requested cancellation — wrong size selected.',
      statusHistory: JSON.stringify([
        { status: 'pending', timestamp: '2026-03-06T20:00:00Z' },
        { status: 'cancelled', timestamp: '2026-03-07T08:00:00Z' },
      ]),
      createdAt: new Date('2026-03-06T20:00:00Z'),
      items: {
        create: [
          {
            productId: p[8].id,
            quantity: 1,
            price: p[8].price,
            size: 'S',
            color: 'Pink',
          },
        ],
      },
    },
  })
  console.log('  ✓ Order 5 — CANCELLED')

  console.log('\nDone! 5 admin orders created at different stages.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

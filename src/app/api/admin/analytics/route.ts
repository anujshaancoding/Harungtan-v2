import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const range = request.nextUrl.searchParams.get('range') || '30d'
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch all orders in range
    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      include: {
        items: {
          include: { product: { select: { name: true, slug: true, images: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Daily revenue
    const dailyRevenue: Record<string, number> = {}
    const dailyOrders: Record<string, number> = {}

    orders.forEach((order) => {
      const day = order.createdAt.toISOString().split('T')[0]
      dailyRevenue[day] = (dailyRevenue[day] || 0) + order.total
      dailyOrders[day] = (dailyOrders[day] || 0) + 1
    })

    const revenueData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue),
      orders: dailyOrders[date] || 0,
    }))

    // Top products
    const productSales: Record<string, { name: string; slug: string; quantity: number; revenue: number }> = {}
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.productId
        if (!productSales[key]) {
          productSales[key] = {
            name: item.product.name,
            slug: item.product.slug,
            quantity: 0,
            revenue: 0,
          }
        }
        productSales[key].quantity += item.quantity
        productSales[key].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Summary stats
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const totalOrders = orders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const totalCustomers = new Set(orders.map((o) => o.userId)).size

    // Status breakdown
    const statusBreakdown: Record<string, number> = {}
    orders.forEach((o) => {
      statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1
    })

    return NextResponse.json({
      summary: {
        totalRevenue: Math.round(totalRevenue),
        totalOrders,
        avgOrderValue: Math.round(avgOrderValue),
        totalCustomers,
      },
      revenueData,
      topProducts,
      statusBreakdown,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

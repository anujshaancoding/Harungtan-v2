import { prisma } from '@/lib/prisma'

export async function getRecommendations(userId?: string, limit = 8): Promise<string[]> {
  try {
    if (userId) {
      // Collaborative filtering: find products viewed by similar users
      const userViews = await prisma.productView.findMany({
        where: { userId },
        select: { productId: true },
        take: 20,
        orderBy: { createdAt: 'desc' },
      })

      const viewedProductIds = userViews.map((v) => v.productId)

      if (viewedProductIds.length > 0) {
        // Find other users who viewed the same products
        const similarUsers = await prisma.productView.findMany({
          where: {
            productId: { in: viewedProductIds },
            userId: { not: userId },
          },
          select: { userId: true },
          distinct: ['userId'],
          take: 50,
        })

        const similarUserIds = similarUsers
          .map((u) => u.userId)
          .filter((id): id is string => id !== null)

        if (similarUserIds.length > 0) {
          // Get products those users also viewed
          const recommended = await prisma.productView.findMany({
            where: {
              userId: { in: similarUserIds },
              productId: { notIn: viewedProductIds },
            },
            select: { productId: true },
            distinct: ['productId'],
            take: limit,
          })

          if (recommended.length >= 3) {
            return recommended.map((r) => r.productId)
          }
        }
      }
    }

    // Fallback: trending products (most viewed in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const trending = await prisma.productView.groupBy({
      by: ['productId'],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: limit,
    })

    if (trending.length > 0) {
      return trending.map((t) => t.productId)
    }

    // Final fallback: bestsellers
    const bestsellers = await prisma.product.findMany({
      where: { active: true, bestseller: true },
      select: { id: true },
      take: limit,
      orderBy: { rating: 'desc' },
    })

    return bestsellers.map((p) => p.id)
  } catch {
    return []
  }
}

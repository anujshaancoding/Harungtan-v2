import prisma from '@/lib/prisma'
import { Package, FileText, ShoppingCart, Users } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [productCount, postCount, orderCount, userCount, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.post.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
    ])
  return { productCount, postCount, orderCount, userCount, recentOrders }
}

export default async function AdminDashboard() {
  const { productCount, postCount, orderCount, userCount, recentOrders } =
    await getStats()

  const stats = [
    {
      label: 'Products',
      value: productCount,
      icon: Package,
      href: '/admin/products',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Stories',
      value: postCount,
      icon: FileText,
      href: '/admin/stories',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Orders',
      value: orderCount,
      icon: ShoppingCart,
      href: '#',
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Customers',
      value: userCount,
      icon: Users,
      href: '#',
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Welcome back. Here&apos;s an overview of your store.
      </p>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon size={22} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--foreground)]">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Recent Orders
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-center text-sm text-[var(--muted-foreground)]">
              No orders yet.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Order ID</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Customer</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="px-4 py-3 font-medium text-[var(--muted-foreground)] text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--muted)]/50">
                    <td className="px-4 py-3 font-mono text-xs">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize bg-yellow-50 text-yellow-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import PageTransition from '@/components/PageTransition'
import BackToTop from '@/components/BackToTop'
import ChatSupport from '@/components/ChatSupport'
import ShopCompanion from '@/components/ShopCompanion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CompareDrawer } from '@/components/products/ProductComparison'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen pt-28">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <MobileBottomNav />
      <ShopCompanion />
      <ChatSupport />
      <BackToTop />
      <ThemeToggle />
      <CompareDrawer />
      {/* Spacer for mobile bottom nav */}
      <div className="h-16 lg:hidden" />
    </>
  )
}

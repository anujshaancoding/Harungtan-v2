'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import SmoothScroll from '@/components/SmoothScroll'
import PageLoader from '@/components/PageLoader'
import { CartToastListener } from '@/components/CartToast'
import CookieConsent from '@/components/CookieConsent'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import OfflineIndicator from '@/components/OfflineIndicator'
import { ThemeProvider } from '@/lib/theme'
import FocusManager from '@/components/FocusManager'
import SessionExpiredHandler from '@/components/SessionExpiredHandler'
import { ExitIntentPopup } from '@/components/ExitIntentPopup'
import { SocialProofNotification } from '@/components/SocialProofNotification'
import { AbandonedCartBanner } from '@/components/AbandonedCartBanner'
import { FlashSaleBanner } from '@/components/FlashSaleBanner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionExpiredHandler />
      <ThemeProvider>
        <FocusManager />
        <PageLoader />
        <OfflineIndicator />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <CartToastListener />
        <CookieConsent />
        <PWAInstallPrompt />
        <ExitIntentPopup />
        <SocialProofNotification />
        <AbandonedCartBanner />
        <FlashSaleBanner />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--foreground)',
              color: 'var(--primary-foreground)',
              borderRadius: '0px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#059669',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#DC2626',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  )
}

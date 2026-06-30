import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isProfilePage = req.nextUrl.pathname.startsWith('/profile')
  const isCheckoutPage = req.nextUrl.pathname.startsWith('/checkout')
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

  if ((isProfilePage || isCheckoutPage) && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminPage) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.nextUrl.origin)
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    const role = req.auth?.user?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.nextUrl.origin))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*', '/admin/:path*'],
}

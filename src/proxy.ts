import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((request) => {
  const isLoggedIn = Boolean(request.auth)
  const isLoginPage = request.nextUrl.pathname === '/login'

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
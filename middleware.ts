import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
  const isApiAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')
  const isPublicAsset = request.nextUrl.pathname.startsWith('/_next') || 
                       request.nextUrl.pathname.startsWith('/favicon.ico') ||
                       request.nextUrl.pathname.startsWith('/uploads')

  // Allow API auth routes and public assets to pass through
  if (isApiAuthRoute || isPublicAsset) {
    return NextResponse.next()
  }

  // Check for authentication token in cookies or headers
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow all other routes to pass through
  // Authentication will be handled on the client side
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
} 
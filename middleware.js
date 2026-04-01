import { NextResponse } from 'next/server'

export function middleware(request) {
  const hasAuthCookie = request.cookies.getAll().some(c =>
    c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  if (request.nextUrl.pathname.startsWith('/admin') && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

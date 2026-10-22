import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('coco_session')?.value
  const backendUrl = process.env.COCO_API_URL?.replace(/\/+$/, '')
  let valid = false
  if (token && backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      })
      valid = response.ok
    } catch { valid = false }
  }
  if (valid) return NextResponse.next()

  const response = NextResponse.redirect(new URL('/login', request.url))
  response.cookies.set('coco_session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}

export const config = { matcher: ['/dashboard/:path*', '/history/:path*', '/trends/:path*', '/analysis/:path*', '/profile/:path*', '/settings/:path*', '/reminders/:path*', '/synchronization/:path*'] }

import { NextResponse } from 'next/server'

const backendUrl = process.env.COCO_API_URL?.replace(/\/+$/, '')

export async function authenticate(request: Request, endpoint: 'login' | 'register') {
  if (!backendUrl) return NextResponse.json({ message: 'La API no está configurada.' }, { status: 503 })
  let payload: unknown
  try { payload = await request.json() } catch { return NextResponse.json({ message: 'Solicitud inválida.' }, { status: 400 }) }
  try {
    const response = await fetch(`${backendUrl}/api/auth/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload), cache: 'no-store',
    })
    const result = await response.json().catch(() => ({})) as { token?: string; user?: unknown; message?: string }
    if (!response.ok || !result.token) {
      return NextResponse.json({ message: result.message ?? (response.status === 401 ? 'Correo o contraseña incorrectos.' : 'No se pudo autenticar.') }, { status: response.status || 502 })
    }
    const reply = NextResponse.json({ user: result.user })
    reply.cookies.set('coco_session', result.token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60,
    })
    return reply
  } catch {
    return NextResponse.json({ message: 'No fue posible conectar con COCO.' }, { status: 502 })
  }
}

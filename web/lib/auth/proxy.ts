import { NextResponse } from 'next/server'

const backendUrl = process.env.COCO_API_URL?.replace(/\/+$/, '')

export async function authenticate(request: Request, endpoint: 'login' | 'register') {
  if (!backendUrl) return NextResponse.json({ message: 'COCO no está disponible por ahora. Inténtalo de nuevo en unos minutos.' }, { status: 503 })
  let payload: unknown
  try { payload = await request.json() } catch { return NextResponse.json({ message: 'No pudimos leer lo que enviaste. Revisa los datos e inténtalo de nuevo.' }, { status: 400 }) }
  try {
    const response = await fetch(`${backendUrl}/api/auth/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload), cache: 'no-store',
    })
    const result = await response.json().catch(() => ({})) as { token?: string; user?: unknown; message?: string }
    if (!response.ok || !result.token) {
      return NextResponse.json({ message: response.status === 401 ? 'El correo o la contraseña no son correctos.' : response.status === 409 ? 'Ese correo ya tiene una cuenta. Prueba iniciar sesión.' : 'No pudimos completar lo que pediste. Inténtalo de nuevo.' }, { status: response.status || 502 })
    }
    const reply = NextResponse.json({ user: result.user })
    reply.cookies.set('coco_session', result.token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60,
    })
    return reply
  } catch {
    return NextResponse.json({ message: 'No pudimos conectar con COCO. Revisa tu internet e inténtalo de nuevo.' }, { status: 502 })
  }
}

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const backendUrl = process.env.COCO_API_URL?.replace(/\/+$/, '')

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const token = (await cookies()).get('coco_session')?.value
  if (!token) return NextResponse.json({ message: 'Sesión no disponible.' }, { status: 401 })
  if (!backendUrl) return NextResponse.json({ message: 'La API no está configurada.' }, { status: 503 })
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ message: 'Origen no permitido.' }, { status: 403 })
  }
  const { path } = await context.params
  if (!path.length || path.some((segment) => !/^[a-zA-Z0-9_-]+$/.test(segment))) {
    return NextResponse.json({ message: 'Ruta inválida.' }, { status: 400 })
  }
  try {
    const upstream = await fetch(`${backendUrl}/api/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`, {
      method: request.method,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', ...(request.headers.get('content-type') ? { 'Content-Type': request.headers.get('content-type')! } : {}) },
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(), cache: 'no-store',
    })
    return new Response(await upstream.text(), { status: upstream.status, headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' } })
  } catch {
    return NextResponse.json({ message: 'No fue posible conectar con COCO.' }, { status: 502 })
  }
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const DELETE = proxy

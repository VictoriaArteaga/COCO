'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true)
    const form = new FormData(event.currentTarget)
    const body = Object.fromEntries(form.entries())
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json()
      if (!response.ok) { setError(data.message ?? 'No se pudo completar la solicitud.'); return }
      router.replace('/dashboard'); router.refresh()
    } catch { setError('No fue posible conectar con COCO.') }
    finally { setBusy(false) }
  }
  return <form className="space-y-4" onSubmit={submit}>
    {mode === 'register' && <label className="block text-sm">Nombre visible<input name="displayName" autoComplete="name" required maxLength={100} className="input mt-1 w-full" /></label>}
    <label className="block text-sm">Correo electrónico<input name="email" type="email" autoComplete="email" required maxLength={255} className="input mt-1 w-full" /></label>
    <label className="block text-sm">Contraseña<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'register' ? 8 : undefined} className="input mt-1 w-full" /></label>
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button className="btn-primary w-full" disabled={busy}>{busy ? 'Procesando…' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</button>
    <p className="text-center text-sm text-text-secondary">{mode === 'login' ? <>¿No tienes cuenta? <Link className="text-green-dark underline" href="/register">Regístrate</Link></> : <>¿Ya tienes cuenta? <Link className="text-green-dark underline" href="/login">Inicia sesión</Link></>}</p>
  </form>
}

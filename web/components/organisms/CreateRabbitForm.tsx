'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreateRabbitForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    const name = new FormData(event.currentTarget).get('name')
    try {
      const response = await fetch('/api/backend/rabbits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      if (!response.ok) { const body = await response.json().catch(() => ({})); setError(body.message ?? 'No se pudo guardar el conejo.'); return }
      event.currentTarget.reset(); router.refresh()
    } catch { setError('No fue posible conectar con COCO.') }
    finally { setBusy(false) }
  }
  return <section className="card space-y-3"><h2 className="text-lg font-semibold">Asocia tu primer conejo</h2><p className="text-sm text-text-secondary">El conejo quedará asociado automáticamente a tu cuenta.</p><form onSubmit={submit} className="flex flex-wrap gap-2"><input name="name" required minLength={1} maxLength={100} placeholder="Nombre del conejo" className="min-w-0 flex-1 rounded border border-green-light p-2" /><button className="btn-primary" disabled={busy}>{busy ? 'Guardando…' : 'Crear conejo'}</button></form>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}</section>
}

'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { Icon } from '@/components/atoms/Icon'

/** Cambia el nombre del conejo (PUT /rabbits/{id}). Muestra un botón y, al pulsarlo, un campo con guardar/cancelar. */
export function RenameRabbitForm({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const { t } = usePrefs()
  const p = t.profile
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = String(new FormData(event.currentTarget).get('name') ?? '').trim()
    if (!next) { setError(p.renameError); return }
    setBusy(true); setError('')
    try {
      const response = await fetch(`/api/backend/rabbits/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: next }) })
      if (!response.ok) { const body = await response.json().catch(() => ({})); setError(body.message ?? p.renameError); return }
      setEditing(false); router.refresh()
    } catch { setError(t.auth.connectError) }
    finally { setBusy(false) }
  }

  if (!editing) {
    return (
      <button type="button" onClick={() => setEditing(true)} className="btn-secondary !min-h-[40px] !px-3 !py-1.5 text-sm">
        <Icon name="settings" size={16} />{p.rename}
      </button>
    )
  }
  return (
    <form onSubmit={submit} className="flex w-full flex-wrap items-start gap-2">
      <div className="min-w-[12rem] flex-1">
        <label className="sr-only" htmlFor={`rename-${id}`}>{p.renameLabel}</label>
        <input id={`rename-${id}`} name="name" defaultValue={name} maxLength={100} autoFocus
          aria-invalid={error ? true : undefined} className="input w-full" />
        {error && <p role="alert" className="auth-error mt-1 text-xs font-semibold">{error}</p>}
      </div>
      <button className="btn-primary !min-h-[44px]" disabled={busy}>{busy ? p.saving : p.save}</button>
      <button type="button" className="btn-secondary" onClick={() => { setEditing(false); setError('') }}>{p.cancel}</button>
    </form>
  )
}

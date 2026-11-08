'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'

export function CreateRabbitForm({ title, text }: { title?: string; text?: string } = {}) {
  const router = useRouter()
  const { t } = usePrefs()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    const name = new FormData(event.currentTarget).get('name')
    try {
      const response = await fetch('/api/backend/rabbits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      if (!response.ok) { const body = await response.json().catch(() => ({})); setError(body.message ?? t.createRabbit.saveError); return }
      event.currentTarget.reset(); router.refresh()
    } catch { setError(t.auth.connectError) }
    finally { setBusy(false) }
  }
  return <section className="card space-y-3"><h2 className="text-lg font-semibold">{title ?? t.createRabbit.title}</h2><p className="text-sm text-text-secondary">{text ?? t.createRabbit.text}</p><form onSubmit={submit} className="flex flex-wrap gap-2"><input name="name" required minLength={1} maxLength={100} placeholder={t.createRabbit.placeholder} className="min-w-0 flex-1 rounded border border-line p-2" /><button className="btn-primary" disabled={busy}>{busy ? t.createRabbit.saving : t.createRabbit.create}</button></form>{error && <p role="alert" className="text-sm font-medium text-state-alert">{error}</p>}</section>
}

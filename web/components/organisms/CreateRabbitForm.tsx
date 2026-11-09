'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { friendlyError } from '@/lib/api/friendlyError'
import { Icon, IconTile } from '@/components/atoms/Icon'

interface Props {
  title?: string
  text?: string
  /** Variante del perfil: tarjeta con borde punteado, icono y botón amarillo. */
  dashed?: boolean
  /** Texto del botón en la variante punteada. */
  button?: string
}

export function CreateRabbitForm({ title, text, dashed, button }: Props = {}) {
  const router = useRouter()
  const { t } = usePrefs()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    const name = new FormData(event.currentTarget).get('name')
    try {
      const response = await fetch('/api/backend/rabbits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      if (!response.ok) { setError(friendlyError(response.status, t, t.createRabbit.saveError)); return }
      event.currentTarget.reset(); router.refresh()
    } catch { setError(t.auth.connectError) }
    finally { setBusy(false) }
  }

  if (dashed) {
    return (
      <section className="rounded-[18px] border-2 border-dashed border-green-dark bg-card/50 p-5 sm:p-6" aria-labelledby="add-rabbit">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 flex-[1_1_16rem] items-center gap-3.5">
            <IconTile name="userPlus" color="#7D4D31" size={48} />
            <div>
              <h2 id="add-rabbit" className="font-display text-xl font-semibold text-green-dark">{title ?? t.createRabbit.title}</h2>
              <p className="text-[15px] text-text-secondary">{text ?? t.createRabbit.text}</p>
            </div>
          </div>
          <form onSubmit={submit} className="flex flex-[1_1_16rem] flex-wrap gap-2">
            <label className="sr-only" htmlFor="new-rabbit-name">{t.createRabbit.placeholder}</label>
            <input id="new-rabbit-name" name="name" required minLength={1} maxLength={100} placeholder={t.createRabbit.placeholder} className="input min-w-0 flex-1 rounded-xl" />
            <button className="btn-accent font-display" disabled={busy}><Icon name="plus" size={18} />{busy ? t.createRabbit.saving : button ?? t.createRabbit.create}</button>
          </form>
        </div>
        {error && <p role="alert" className="mt-3 text-sm font-semibold text-state-alert">{error}</p>}
      </section>
    )
  }

  return <section className="card space-y-3"><h2 className="text-lg font-semibold">{title ?? t.createRabbit.title}</h2><p className="text-sm text-text-secondary">{text ?? t.createRabbit.text}</p><form onSubmit={submit} className="flex flex-wrap gap-2"><input name="name" required minLength={1} maxLength={100} placeholder={t.createRabbit.placeholder} className="min-w-0 flex-1 rounded border border-line p-2" /><button className="btn-primary" disabled={busy}>{busy ? t.createRabbit.saving : t.createRabbit.create}</button></form>{error && <p role="alert" className="text-sm font-medium text-state-alert">{error}</p>}</section>
}

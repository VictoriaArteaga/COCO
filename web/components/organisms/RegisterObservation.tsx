'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { cn } from '@/lib/utils/cn'
import { HABIT_ICON, Icon, IconTile } from '@/components/atoms/Icon'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { friendlyError } from '@/lib/api/friendlyError'

const TYPES: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

interface Props {
  rabbitId: string
  /** Variable elegida al abrir (por ejemplo, la de la tarjeta que se pulsó). */
  type?: HabitType
  /** primary = botón amarillo del encabezado; secondary = botón corto de una tarjeta. */
  variant?: 'primary' | 'secondary'
}

/**
 * Botón + cuadro para registrar una observación desde la web (origen WEB).
 * Envía el registro al backend con el mismo formato que usa el repositorio de la web y recarga el panel al guardar.
 */
export function RegisterObservation({ rabbitId, type: initialType = 'FOOD', variant = 'primary' }: Props) {
  const router = useRouter()
  const { t } = usePrefs()
  const r = t.record
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<HabitType>(initialType)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const firstField = useRef<HTMLInputElement>(null)
  const isNote = type === 'BEHAVIOR'

  // Esc cierra el cuadro y el foco vuelve al botón que lo abrió.
  useEffect(() => {
    if (!open) return
    firstField.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function show() { setType(initialType); setAmount(''); setNote(''); setError(''); setOpen(true) }
  function close() { setOpen(false); opener.current?.focus() }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const value = isNote ? null : Number(amount.replace(',', '.'))
    if (!isNote && (!amount.trim() || !Number.isFinite(value) || (value as number) < 0)) { setError(r.invalidAmount); return }
    if (isNote && !note.trim()) { setError(r.needNote); return }
    setBusy(true)
    try {
      const response = await fetch('/api/backend/habits', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientRecordId: crypto.randomUUID(), rabbitId, habitType: type, value, note: isNote ? note.trim() : null,
          recordedAt: new Date().toISOString(), source: 'WEB',
        }),
      })
      if (!response.ok) { setError(friendlyError(response.status, t, r.saveError)); return }
      setOpen(false); router.refresh()
    } catch { setError(t.auth.connectError) }
    finally { setBusy(false) }
  }

  return (
    <>
      <button
        ref={opener} type="button" onClick={show}
        className={variant === 'primary' ? 'btn-accent font-display' : 'btn-secondary !min-h-[42px] !px-3.5 font-display text-sm'}
      >
        <Icon name="plus" size={18} />{variant === 'primary' ? r.button : r.short}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]" role="presentation" onClick={close}>
          <section role="dialog" aria-modal="true" aria-labelledby="record-title" className="card w-full max-w-lg space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <h2 id="record-title" className="font-display text-2xl font-semibold text-green-dark">{r.title}</h2>
              <button type="button" aria-label={t.common.close} onClick={close} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-text-secondary hover:border-ink hover:text-ink"><Icon name="close" size={18} /></button>
            </div>

            <form onSubmit={submit} className="space-y-5" noValidate>
              <fieldset>
                <legend className="mb-2 text-sm font-bold">{r.variable}</legend>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((key) => {
                    const on = key === type
                    return (
                      <button key={key} type="button" aria-pressed={on} onClick={() => { setType(key); setError('') }}
                        className={cn('flex min-h-[44px] items-center gap-2 rounded-xl border-2 px-3 text-sm font-bold transition-colors', on ? 'border-ink bg-card' : 'border-line bg-surface hover:border-mute')}>
                        <IconTile name={HABIT_ICON[key]} color={HABIT_TYPE_INFO[key].color} size={26} />
                        {t.habits[key]}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {isNote ? (
                <label className="block text-sm font-bold">{r.note}
                  <input ref={firstField} value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder={r.notePh} className="input mt-1.5 w-full rounded-xl font-normal" />
                </label>
              ) : (
                <label className="block text-sm font-bold">{r.amount} ({t.units[HABIT_TYPE_INFO[type].unit] ?? HABIT_TYPE_INFO[type].unit})
                  <input ref={firstField} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0" className="input mt-1.5 w-full rounded-xl font-normal tabular-nums" />
                </label>
              )}

              {error && <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-state-alert"><Icon name="alert" size={16} />{error}</p>}

              <div className="flex flex-wrap justify-end gap-3">
                <button type="button" onClick={close} className="btn-secondary">{r.cancel}</button>
                <button className="btn-accent font-display" disabled={busy}>{busy ? r.saving : r.save}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}

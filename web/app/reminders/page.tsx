'use client'

import { useEffect, useMemo, useState } from 'react'
import { MOCK_REMINDERS, type Reminder } from '@/lib/mock/reminders'
import { habitRepository } from '@/services/repositories'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { PageHeader } from '@/components/organisms/PageHeader'
import { HABIT_ICON, Icon, IconTile, type IconName } from '@/components/atoms/Icon'
import { cn } from '@/lib/utils/cn'

const TYPES: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']
const STORAGE_KEY = 'coco-reminders'
const REMINDER_ICON: Record<string, IconName> = { food: 'food', water: 'water', evening: 'list' }
const REMINDER_COLOR: Record<string, string> = { food: HABIT_TYPE_INFO.FOOD.color, water: HABIT_TYPE_INFO.WATER.color, evening: '#0FA68A' }

/** Interruptor accesible (role="switch"). */
function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange}
      className={cn(
        'relative inline-block h-8 w-14 flex-shrink-0 rounded-full border-2 p-0 transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green',
        checked ? 'border-green bg-green' : 'border-line bg-surface',
      )}
    >
      <span aria-hidden="true" className={cn('absolute left-0.5 top-0.5 block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200', checked ? 'translate-x-6' : 'translate-x-0')} />
    </button>
  )
}

const localDay = (value: string | Date) => new Date(value).toLocaleDateString('en-CA')

export default function RemindersPage() {
  const { t } = usePrefs()
  const r = t.reminders
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS)
  const [today, setToday] = useState<HabitRecord[]>([])

  // Los avisos se recuerdan en este navegador.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<Reminder>[]
        setReminders(MOCK_REMINDERS.map((base) => ({ ...base, ...parsed.find((item) => item.id === base.id) })))
      }
    } catch { /* sin almacenamiento: se usan los valores por defecto */ }
  }, [])
  const update = (id: string, patch: Partial<Reminder>) => setReminders((current) => {
    const next = current.map((item) => item.id === id ? { ...item, ...patch } : item)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next.map(({ id: key, enabled, time }) => ({ id: key, enabled, time })))) } catch { /* ignora */ }
    return next
  })

  // Qué variables ya se registraron hoy (datos reales).
  useEffect(() => {
    Promise.all([habitRepository.getRabbit(), habitRepository.listRecords()])
      .then(([rabbit, all]) => setToday(all.filter((rec) => rec.rabbitId === rabbit.id && localDay(rec.recordedAt) === localDay(new Date()))))
      .catch(() => setToday([]))
  }, [])

  const doneTypes = useMemo(() => new Set(today.map((rec) => rec.habitType)), [today])
  const doneCount = TYPES.filter((type) => doneTypes.has(type)).length

  // Próximo aviso activo (el siguiente por hora; si ya pasaron todos, el primero de mañana).
  const next = useMemo(() => {
    const active = reminders.filter((item) => item.enabled && item.time).sort((a, b) => a.time.localeCompare(b.time))
    if (!active.length) return null
    const now = new Date(); const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    return active.find((item) => item.time >= hhmm) ?? active[0]
  }, [reminders])

  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={r.title} sub={r.sub} icon="bell" />

    <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6">
      {/* Rutina de hoy */}
      <section className="card" aria-labelledby="today">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="today" className="font-display text-xl font-semibold text-green-dark">{r.todayTitle}</h2>
            <p className="text-sm text-text-secondary">{r.todaySub}</p>
          </div>
          <span className="badge bg-green-light text-green-dark"><Icon name="check" size={14} />{r.doneOf(doneCount)}</span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuemin={0} aria-valuemax={5} aria-valuenow={doneCount} aria-label={r.doneOf(doneCount)}>
          <div className="h-full rounded-full bg-green transition-[width] duration-700" style={{ width: `${(doneCount / 5) * 100}%` }} />
        </div>
        {doneCount === 5 && <p className="mt-3 text-sm font-bold text-green-dark">{r.allDone}</p>}
        <ul className="mt-5 grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 xl:grid-cols-3">
          {TYPES.map((type) => {
            const done = doneTypes.has(type)
            return (
              <li key={type} className={cn('flex items-center gap-3 rounded-xl border p-3', done ? 'border-green bg-green-light' : 'border-line bg-surface')}>
                <IconTile name={HABIT_ICON[type]} color={HABIT_TYPE_INFO[type].color} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-text">{t.habits[type]}</p>
                  <p className={cn('flex items-center gap-1 text-xs font-bold', done ? 'text-green-dark' : 'text-text-secondary')}>
                    <Icon name={done ? 'check' : 'clock'} size={13} />{done ? r.done : r.pending}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Próximo aviso */}
      <section className="card flex flex-col justify-center gap-3 text-center" aria-labelledby="next">
        <span className="auth-badge mx-auto flex h-16 w-16 items-center justify-center rounded-full"><Icon name="bell" size={30} /></span>
        <h2 id="next" className="text-sm font-bold text-text-secondary">{r.next}</h2>
        {next ? (
          <>
            <p className="font-display text-5xl font-semibold tabular-nums text-green-dark">{next.time}</p>
            <p className="font-bold text-text">{(r.items[next.id] ?? next).title}</p>
            <p className="text-sm text-text-secondary">{(r.items[next.id] ?? next).detail}</p>
          </>
        ) : <p className="font-display text-xl font-semibold text-text-secondary">{r.noNext}</p>}
      </section>
    </div>

    {/* Lista de avisos */}
    <section className="card" aria-labelledby="alerts">
      <h2 id="alerts" className="font-display text-xl font-semibold text-green-dark">{r.listTitle}</h2>
      <p className="mb-4 text-sm text-text-secondary">{r.listSub}</p>
      <ul className="space-y-3">
        {reminders.map((item) => {
          const text = r.items[item.id] ?? { title: item.title, detail: item.detail }
          return (
            <li key={item.id} className={cn('flex flex-wrap items-center gap-4 rounded-xl border p-4 transition-colors', item.enabled ? 'border-green bg-green-light/40' : 'border-line bg-surface')}>
              <IconTile name={REMINDER_ICON[item.id] ?? 'bell'} color={item.enabled ? (REMINDER_COLOR[item.id] ?? '#0FA68A') : '#4A6862'} size={48} />
              <div className="min-w-0 flex-1 basis-48">
                <h3 className="font-display text-lg font-semibold text-text">{text.title}</h3>
                <p className="text-sm text-text-secondary">{text.detail}</p>
              </div>
              <label className="text-xs font-bold text-text-secondary">
                {r.timeLabel}
                <input type="time" value={item.time} onChange={(e) => update(item.id, { time: e.target.value })} className="input mt-1 block w-32 font-bold tabular-nums" />
              </label>
              <div className="flex items-center gap-3">
                <span className="w-16 text-sm font-bold text-text-secondary">{item.enabled ? r.on : r.off}</span>
                <Switch checked={item.enabled} onChange={() => update(item.id, { enabled: !item.enabled })} label={`${item.enabled ? r.disable : r.enable} ${text.title}`} />
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 flex items-start gap-2 text-sm text-text-secondary"><Icon name="info" size={18} className="mt-0.5 flex-shrink-0" />{r.note}</p>
    </section>
  </div>
}

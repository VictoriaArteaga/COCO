'use client'

import { useEffect, useState } from 'react'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { habitRepository } from '@/services/repositories'
import { TrendChart } from '@/components/organisms/TrendChart'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { PageHeader } from '@/components/organisms/PageHeader'
import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/utils/cn'

const types: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

export default function TrendsPage() {
  const { t } = usePrefs()
  const tr = t.trends
  const [selected, setSelected] = useState<HabitType[]>(types)
  const [period, setPeriod] = useState('7')
  const [from, setFrom] = useState(() => { const date = new Date(); date.setDate(date.getDate() - 6); return date.toISOString().slice(0, 10) })
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10))
  const [records, setRecords] = useState<HabitRecord[]>([])
  useEffect(() => { habitRepository.listRecords().then(setRecords) }, [])
  const customDays = Math.max(1, Math.min(30, Math.floor((new Date(`${to}T12:00:00`).getTime() - new Date(`${from}T12:00:00`).getTime()) / 86400000) + 1))
  const toggle = (type: HabitType) => setSelected((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type])
  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={tr.title} sub={tr.sub} icon="trending" />
    <section className="card space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4"><fieldset><legend className="mb-2 text-sm font-semibold">{tr.variables}</legend><div className="flex flex-wrap gap-2">{types.map((type) => {
        const on = selected.includes(type)
        return <label key={type} className={cn('flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border-2 px-3.5 text-sm font-bold focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink', on ? 'border-ink bg-card' : 'border-line bg-surface')}>
          <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(type)} />
          <span aria-hidden="true" className="flex h-[18px] w-[18px] items-center justify-center rounded-md text-white" style={on ? { backgroundColor: HABIT_TYPE_INFO[type].color } : { border: '1.5px solid rgb(var(--c-line))' }}>{on && <Icon name="check" size={12} />}</span>
          {t.habits[type]}
        </label>
      })}</div></fieldset>
      <div className="flex flex-wrap items-end gap-3"><label className="text-sm font-semibold">{tr.period}<select className="mt-1 block input rounded-xl font-normal" value={period} onChange={(e) => setPeriod(e.target.value)}><option value="1">{t.common.today}</option><option value="7">{tr.days7}</option><option value="30">{tr.days30}</option><option value="custom">{tr.custom}</option></select></label>{period === 'custom' && <><label className="text-sm">{tr.from}<input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="mt-1 block input rounded-xl" /></label><label className="text-sm">{tr.to}<input type="date" value={to} min={from} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setTo(e.target.value)} className="mt-1 block input rounded-xl" /></label></>}</div></div>
      {selected.length ? <TrendChart records={records} selected={selected} days={period === 'custom' ? customDays : Number(period)} endDate={period === 'custom' ? to : undefined} /> : <p className="rounded bg-surface p-8 text-center text-text-secondary">{tr.pickOne}</p>}
      <div className="grid gap-3 border-t border-line pt-4 md:grid-cols-3"><div><h2 className="text-sm font-semibold">{tr.q1}</h2><p className="mt-1 text-sm text-text-secondary">{tr.a1}</p></div><div><h2 className="text-sm font-semibold">{tr.q2}</h2><p className="mt-1 text-sm text-text-secondary">{tr.a2}</p></div><div><h2 className="text-sm font-semibold">{tr.q3}</h2><p className="mt-1 text-sm text-text-secondary">{tr.a3}</p></div></div>
      <div className="flex flex-wrap gap-4 text-xs text-text-secondary"><span>{tr.legend1}</span><span>{tr.legend2}</span><span>{tr.legend3}</span></div>
    </section>
  </div>
}

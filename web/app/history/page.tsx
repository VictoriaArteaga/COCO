'use client'

import { useEffect, useMemo, useState } from 'react'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { habitRepository } from '@/services/repositories'
import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/utils/cn'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { PageHeader } from '@/components/organisms/PageHeader'

const types: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

export default function HistoryPage() {
  const { t, locale } = usePrefs()
  const h = t.history
  const dateText = (value: string) => new Date(value).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })
  const [type, setType] = useState('ALL')
  const [period, setPeriod] = useState('7')
  const [source, setSource] = useState('ALL')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [detail, setDetail] = useState<HabitRecord | null>(null)
  const [records, setRecords] = useState<HabitRecord[]>([])
  const [loading, setLoading] = useState(true)
  const pageSize = 8

  useEffect(() => { habitRepository.listRecords().then(setRecords).finally(() => setLoading(false)) }, [])

  const filtered = useMemo(() => records.filter((record) => {
    const age = (Date.now() - new Date(record.recordedAt).getTime()) / 86400000
    return (type === 'ALL' || record.habitType === type)
      && (period === 'ALL' || period === 'CUSTOM' || age <= Number(period))
      && (source === 'ALL' || record.source === source)
      && (!from || record.recordedAt.slice(0, 10) >= from)
      && (!to || record.recordedAt.slice(0, 10) <= to)
      && (!query || (record.habitType === 'BEHAVIOR' && record.note?.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale))))
  }), [records, type, period, source, from, to, query, locale])
  const periods: [string, string][] = [['1', t.common.today], ['7', h.last7], ['30', h.last30], ['ALL', h.allHistory], ['CUSTOM', h.custom]]
  const clearFilters = () => { setType('ALL'); setPeriod('7'); setSource('ALL'); setFrom(''); setTo(''); setQuery(''); setPage(0) }
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize)

  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={h.title} sub={h.sub} icon="list" />
    <section className="card space-y-5" aria-label={h.filters}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="block min-w-[16rem] flex-1 text-sm font-bold sm:max-w-md">{h.search}
          <span className="relative mt-1 block">
            <Icon name="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }} placeholder={h.searchPlaceholder} className="input w-full rounded-xl pl-10 font-normal" />
          </span>
        </label>
        <div>
          <span id="period-label" className="mb-1 block text-sm font-bold">{h.period}</span>
          <div role="group" aria-labelledby="period-label" className="inline-flex flex-wrap gap-0.5 rounded-2xl border border-line bg-surface p-1">
            {periods.map(([value, label]) => (
              <button key={value} type="button" aria-pressed={period === value} onClick={() => { setPeriod(value); setPage(0) }}
                className={cn('min-h-[40px] rounded-xl px-3.5 text-sm font-bold transition-colors', period === value ? 'bg-green-dark text-white' : 'text-green-dark hover:bg-green-light')}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="text-sm font-bold">{h.recordType}<select className="mt-1 block input rounded-xl font-normal" value={source} onChange={(e) => { setSource(e.target.value); setPage(0) }}><option value="ALL">{h.all}</option><option value="WATCH">{h.watch}</option><option value="WEB">{h.web}</option></select></label>
      </div>
      <div>
        <span id="variable-label" className="mb-2 block text-sm font-bold">{h.variable}</span>
        <div role="group" aria-labelledby="variable-label" className="flex flex-wrap gap-2">
          {['ALL', ...types].map((key) => {
            const on = type === key
            return (
              <button key={key} type="button" aria-pressed={on} onClick={() => { setType(key); setPage(0) }}
                className={cn('flex min-h-[40px] items-center gap-2 rounded-xl border-2 px-3.5 text-sm font-bold transition-colors', on ? 'border-ink bg-card' : 'border-line bg-surface hover:border-mute')}>
                {key !== 'ALL' && <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HABIT_TYPE_INFO[key as HabitType].color }} />}
                {key === 'ALL' ? t.common.all : t.habits[key as HabitType]}
                {on && <Icon name="check" size={14} />}
              </button>
            )
          })}
        </div>
      </div>
      {period === 'CUSTOM' && (
        <div className="grid gap-3 sm:grid-cols-2 sm:max-w-md">
          <label className="text-sm font-bold">{h.from}<input type="date" className="mt-1 w-full input rounded-xl font-normal" value={from} onChange={(e) => { setFrom(e.target.value); setPage(0) }} /></label>
          <label className="text-sm font-bold">{h.to}<input type="date" className="mt-1 w-full input rounded-xl font-normal" value={to} onChange={(e) => { setTo(e.target.value); setPage(0) }} /></label>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
        <span className="text-text-secondary" role="status">{h.showing(filtered.length)}</span>
        <button type="button" onClick={clearFilters} className="min-h-[44px] px-2 font-bold text-green-dark underline underline-offset-4">{h.clear}</button>
      </div>
    </section>
    <section className="card overflow-hidden p-0" aria-live="polite">
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-green-light/50 text-text-secondary"><tr><th className="p-4">{h.date}</th><th className="p-4">{h.variable}</th><th className="p-4">{h.valueNote}</th><th className="p-4">{h.origin}</th><th className="p-4">{t.recordStatusLabel}</th><th className="p-4"><span className="sr-only">{h.detail}</span></th></tr></thead>
      <tbody>{visible.map((record) => <tr key={record.id} className="border-t border-line"><td className="whitespace-nowrap p-4">{dateText(record.recordedAt)}</td><td className="p-4"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HABIT_TYPE_INFO[record.habitType].color }} />{t.habits[record.habitType]}</td><td className="max-w-sm truncate p-4">{record.note || `${record.value} ${t.units[HABIT_TYPE_INFO[record.habitType].unit] ?? HABIT_TYPE_INFO[record.habitType].unit}`}</td><td className="p-4">{record.source === 'WATCH' ? h.watch : h.webShort}</td><td className="p-4"><span className={cn('badge', record.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-light text-green-dark')}><Icon name={record.status === 'PENDING' ? 'clock' : 'check'} size={13} />{record.status === 'PENDING' ? t.recordStatus.PENDING : t.recordStatus.SYNCED}</span></td><td className="p-2"><button className="min-h-[44px] rounded-lg px-3 font-bold text-green-dark underline underline-offset-4" onClick={() => setDetail(record)}>{t.common.view}</button></td></tr>)}</tbody></table></div>
      {loading ? <p className="p-10 text-center text-text-secondary" role="status">{h.loading}</p> : visible.length === 0 && <p className="p-10 text-center text-text-secondary">{h.empty}</p>}
      <div className="flex items-center justify-between border-t border-line p-4 text-sm"><span>{h.summary(filtered.length, page + 1, pages)}</span><div className="flex gap-2"><button className="btn-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>{t.common.previous}</button><button className="btn-secondary" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>{t.common.next}</button></div></div>
    </section>
    {detail && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]" role="presentation" onClick={() => setDetail(null)}><section role="dialog" aria-modal="true" aria-labelledby="record-detail-title" className="card w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><h2 id="record-detail-title" className="text-lg font-semibold">{h.detailTitle}</h2><button aria-label={h.closeDetail} onClick={() => setDetail(null)} className="rounded-coco border border-mute p-1 text-text-secondary transition-colors hover:border-ink hover:text-ink"><Icon name="close" size={18} /></button></div><p><b>{h.variable}:</b> {t.habits[detail.habitType]}</p><p><b>{h.date}:</b> {dateText(detail.recordedAt)}</p><p><b>{h.value}:</b> {detail.note || `${detail.value} ${t.units[HABIT_TYPE_INFO[detail.habitType].unit] ?? HABIT_TYPE_INFO[detail.habitType].unit}`}</p><p><b>{h.origin}:</b> {detail.source === 'WATCH' ? h.watch : h.web}</p><p><b>{h.sync}:</b> {detail.status === 'PENDING' ? t.recordStatus.PENDING : t.recordStatus.SYNCED}</p><button className="btn-primary" onClick={() => setDetail(null)}>{t.common.done}</button></section></div>}
  </div>
}

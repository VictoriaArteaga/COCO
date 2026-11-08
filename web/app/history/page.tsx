'use client'

import { useEffect, useMemo, useState } from 'react'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { habitRepository } from '@/services/repositories'
import { Icon } from '@/components/atoms/Icon'
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
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize)

  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={h.title} sub={h.sub} icon="list" />
    <section className="card space-y-4" aria-label={h.filters}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="text-sm font-medium">{h.variable}<select className="mt-1 w-full input rounded-xl" value={type} onChange={(e) => { setType(e.target.value); setPage(0) }}><option value="ALL">{t.common.all}</option>{types.map((key) => <option key={key} value={key}>{t.habits[key]}</option>)}</select></label>
        <label className="text-sm font-medium">{h.period}<select className="mt-1 w-full input rounded-xl" value={period} onChange={(e) => { setPeriod(e.target.value); setPage(0) }}><option value="1">{t.common.today}</option><option value="7">{h.last7}</option><option value="30">{h.last30}</option><option value="ALL">{h.allHistory}</option><option value="CUSTOM">{h.custom}</option></select></label>
        <label className="text-sm font-medium">{h.recordType}<select className="mt-1 w-full input rounded-xl" value={source} onChange={(e) => setSource(e.target.value)}><option value="ALL">{h.all}</option><option value="WATCH">{h.watch}</option><option value="WEB">{h.web}</option></select></label>
        <label className="text-sm font-medium">{h.from}<input type="date" className="mt-1 w-full input rounded-xl" value={from} onChange={(e) => { setFrom(e.target.value); setPeriod('CUSTOM') }} /></label>
        <label className="text-sm font-medium">{h.to}<input type="date" className="mt-1 w-full input rounded-xl" value={to} onChange={(e) => { setTo(e.target.value); setPeriod('CUSTOM') }} /></label>
      </div>
      <label className="block text-sm font-medium">{h.search}<input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }} placeholder={h.searchPlaceholder} className="mt-1 w-full input rounded-xl sm:max-w-md" /></label>
    </section>
    <section className="card overflow-hidden p-0" aria-live="polite">
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-green-light/50 text-text-secondary"><tr><th className="p-4">{h.date}</th><th className="p-4">{h.variable}</th><th className="p-4">{h.valueNote}</th><th className="p-4">{h.origin}</th><th className="p-4">{t.recordStatusLabel}</th><th className="p-4"><span className="sr-only">{h.detail}</span></th></tr></thead>
      <tbody>{visible.map((record) => <tr key={record.id} className="border-t border-line"><td className="whitespace-nowrap p-4">{dateText(record.recordedAt)}</td><td className="p-4"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HABIT_TYPE_INFO[record.habitType].color }} />{t.habits[record.habitType]}</td><td className="max-w-sm truncate p-4">{record.note || `${record.value} ${t.units[HABIT_TYPE_INFO[record.habitType].unit] ?? HABIT_TYPE_INFO[record.habitType].unit}`}</td><td className="p-4">{record.source === 'WATCH' ? h.watch : h.webShort}</td><td className="p-4">{record.status === 'PENDING' ? t.recordStatus.PENDING : t.recordStatus.SYNCED}</td><td className="p-4"><button className="text-green-dark underline" onClick={() => setDetail(record)}>{t.common.view}</button></td></tr>)}</tbody></table></div>
      {loading ? <p className="p-10 text-center text-text-secondary" role="status">{h.loading}</p> : visible.length === 0 && <p className="p-10 text-center text-text-secondary">{h.empty}</p>}
      <div className="flex items-center justify-between border-t border-line p-4 text-sm"><span>{h.summary(filtered.length, page + 1, pages)}</span><div className="flex gap-2"><button className="btn-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>{t.common.previous}</button><button className="btn-secondary" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>{t.common.next}</button></div></div>
    </section>
    {detail && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]" role="presentation" onClick={() => setDetail(null)}><section role="dialog" aria-modal="true" aria-labelledby="record-detail-title" className="card w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><h2 id="record-detail-title" className="text-lg font-semibold">{h.detailTitle}</h2><button aria-label={h.closeDetail} onClick={() => setDetail(null)} className="rounded-coco border border-mute p-1 text-text-secondary transition-colors hover:border-ink hover:text-ink"><Icon name="close" size={18} /></button></div><p><b>{h.variable}:</b> {t.habits[detail.habitType]}</p><p><b>{h.date}:</b> {dateText(detail.recordedAt)}</p><p><b>{h.value}:</b> {detail.note || `${detail.value} ${t.units[HABIT_TYPE_INFO[detail.habitType].unit] ?? HABIT_TYPE_INFO[detail.habitType].unit}`}</p><p><b>{h.origin}:</b> {detail.source === 'WATCH' ? h.watch : h.web}</p><p><b>{h.sync}:</b> {detail.status === 'PENDING' ? t.recordStatus.PENDING : t.recordStatus.SYNCED}</p><button className="btn-primary" onClick={() => setDetail(null)}>{t.common.done}</button></section></div>}
  </div>
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { habitRepository } from '@/services/repositories'

const types: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']
const dateText = (value: string) => new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

export default function HistoryPage() {
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
      && (!query || (record.habitType === 'BEHAVIOR' && record.note?.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))))
  }), [records, type, period, source, from, to, query])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice(page * pageSize, (page + 1) * pageSize)

  return <div className="p-6 lg:p-8 space-y-6">
    <div><h1 className="text-2xl font-bold">Historial</h1><p className="mt-1 text-text-secondary">Filtra y consulta las observaciones de Coquito.</p></div>
    <section className="card space-y-4" aria-label="Filtros del historial">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="text-sm font-medium">Variable<select className="mt-1 w-full rounded border border-green-light p-2" value={type} onChange={(e) => { setType(e.target.value); setPage(0) }}><option value="ALL">Todas</option>{types.map((key) => <option key={key} value={key}>{HABIT_TYPE_INFO[key].label}</option>)}</select></label>
        <label className="text-sm font-medium">Periodo<select className="mt-1 w-full rounded border border-green-light p-2" value={period} onChange={(e) => { setPeriod(e.target.value); setPage(0) }}><option value="1">Hoy</option><option value="7">Últimos 7 días</option><option value="30">Últimos 30 días</option><option value="ALL">Todo el historial</option><option value="CUSTOM">Rango personalizado</option></select></label>
        <label className="text-sm font-medium">Tipo de registro<select className="mt-1 w-full rounded border border-green-light p-2" value={source} onChange={(e) => setSource(e.target.value)}><option value="ALL">Todos</option><option value="WATCH">Smartwatch</option><option value="WEB">Plataforma web</option></select></label>
        <label className="text-sm font-medium">Desde<input type="date" className="mt-1 w-full rounded border border-green-light p-2" value={from} onChange={(e) => { setFrom(e.target.value); setPeriod('CUSTOM') }} /></label>
        <label className="text-sm font-medium">Hasta<input type="date" className="mt-1 w-full rounded border border-green-light p-2" value={to} onChange={(e) => { setTo(e.target.value); setPeriod('CUSTOM') }} /></label>
      </div>
      <label className="block text-sm font-medium">Buscar en notas de comportamiento<input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0) }} placeholder="Ej. tranquilo, juego…" className="mt-1 w-full rounded border border-green-light p-2 sm:max-w-md" /></label>
    </section>
    <section className="card overflow-hidden p-0" aria-live="polite">
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-green-light/50 text-text-secondary"><tr><th className="p-4">Fecha</th><th className="p-4">Variable</th><th className="p-4">Valor / nota</th><th className="p-4">Origen</th><th className="p-4">Estado</th><th className="p-4"><span className="sr-only">Detalle</span></th></tr></thead>
      <tbody>{visible.map((record) => <tr key={record.id} className="border-t border-green-light"><td className="whitespace-nowrap p-4">{dateText(record.recordedAt)}</td><td className="p-4"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HABIT_TYPE_INFO[record.habitType].color }} />{HABIT_TYPE_INFO[record.habitType].label}</td><td className="max-w-sm truncate p-4">{record.note || `${record.value} ${HABIT_TYPE_INFO[record.habitType].unit}`}</td><td className="p-4">{record.source === 'WATCH' ? 'Smartwatch' : 'Web'}</td><td className="p-4">{record.status === 'PENDING' ? 'Pendiente' : 'Sincronizado'}</td><td className="p-4"><button className="text-green underline" onClick={() => setDetail(record)}>Ver</button></td></tr>)}</tbody></table></div>
      {loading ? <p className="p-10 text-center text-text-secondary" role="status">Cargando historial…</p> : visible.length === 0 && <p className="p-10 text-center text-text-secondary">No hay registros que coincidan con estos filtros.</p>}
      <div className="flex items-center justify-between border-t border-green-light p-4 text-sm"><span>{filtered.length} registros · página {page + 1} de {pages}</span><div className="flex gap-2"><button className="btn-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button><button className="btn-secondary" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Siguiente</button></div></div>
    </section>
    {detail && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="presentation" onClick={() => setDetail(null)}><section role="dialog" aria-modal="true" aria-labelledby="record-detail-title" className="card w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><h2 id="record-detail-title" className="text-lg font-semibold">Detalle del registro</h2><button aria-label="Cerrar detalle" onClick={() => setDetail(null)}>✕</button></div><p><b>Variable:</b> {HABIT_TYPE_INFO[detail.habitType].label}</p><p><b>Fecha:</b> {dateText(detail.recordedAt)}</p><p><b>Valor:</b> {detail.note || `${detail.value} ${HABIT_TYPE_INFO[detail.habitType].unit}`}</p><p><b>Origen:</b> {detail.source === 'WATCH' ? 'Smartwatch' : 'Plataforma web'}</p><p><b>Sincronización:</b> {detail.status === 'PENDING' ? 'Pendiente' : 'Sincronizado'}</p><button className="btn-primary" onClick={() => setDetail(null)}>Listo</button></section></div>}
  </div>
}

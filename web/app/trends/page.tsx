'use client'

import { useEffect, useState } from 'react'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { habitRepository } from '@/services/repositories'
import { TrendChart } from '@/components/organisms/TrendChart'

const types: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

export default function TrendsPage() {
  const [selected, setSelected] = useState<HabitType[]>(types)
  const [period, setPeriod] = useState('7')
  const [from, setFrom] = useState(() => { const date = new Date(); date.setDate(date.getDate() - 6); return date.toISOString().slice(0, 10) })
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10))
  const [records, setRecords] = useState<HabitRecord[]>([])
  useEffect(() => { habitRepository.listRecords().then(setRecords) }, [])
  const customDays = Math.max(1, Math.min(30, Math.floor((new Date(`${to}T12:00:00`).getTime() - new Date(`${from}T12:00:00`).getTime()) / 86400000) + 1))
  const toggle = (type: HabitType) => setSelected((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type])
  return <div className="p-6 lg:p-8 space-y-6">
    <div><h1 className="text-2xl font-bold">Tendencias</h1><p className="mt-1 text-text-secondary">Compara las observaciones registradas en el tiempo.</p></div>
    <section className="card space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4"><fieldset><legend className="mb-2 text-sm font-semibold">Variables</legend><div className="flex flex-wrap gap-2">{types.map((type) => <label key={type} className="flex cursor-pointer items-center gap-2 rounded-full border border-green-light px-3 py-2 text-sm"><input type="checkbox" checked={selected.includes(type)} onChange={() => toggle(type)} /> <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HABIT_TYPE_INFO[type].color }} />{HABIT_TYPE_INFO[type].label}</label>)}</div></fieldset>
      <div className="flex flex-wrap items-end gap-3"><label className="text-sm font-semibold">Periodo<select className="mt-1 block rounded border border-green-light p-2 font-normal" value={period} onChange={(e) => setPeriod(e.target.value)}><option value="1">Hoy</option><option value="7">7 días</option><option value="30">30 días</option><option value="custom">Personalizado</option></select></label>{period === 'custom' && <><label className="text-sm">Desde<input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="mt-1 block rounded border border-green-light p-2" /></label><label className="text-sm">Hasta<input type="date" value={to} min={from} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setTo(e.target.value)} className="mt-1 block rounded border border-green-light p-2" /></label></>}</div></div>
      {selected.length ? <TrendChart records={records} selected={selected} days={period === 'custom' ? customDays : Number(period)} endDate={period === 'custom' ? to : undefined} /> : <p className="rounded bg-surface p-8 text-center text-text-secondary">Selecciona al menos una variable para ver sus registros.</p>}
      <div className="grid gap-3 border-t border-green-light pt-4 md:grid-cols-3"><div><h2 className="text-sm font-semibold">¿Qué ocurrió?</h2><p className="mt-1 text-sm text-text-secondary">La gráfica cuenta observaciones por día y variable.</p></div><div><h2 className="text-sm font-semibold">¿Qué cambió?</h2><p className="mt-1 text-sm text-text-secondary">Compara los días visibles para encontrar variaciones registradas.</p></div><div><h2 className="text-sm font-semibold">Contexto</h2><p className="mt-1 text-sm text-text-secondary">Patrón ilustrativo construido con datos demo; no equivale a una evaluación clínica.</p></div></div>
      <div className="flex flex-wrap gap-4 text-xs text-text-secondary"><span>— Observaciones registradas</span><span>Patrón habitual simulado: referencia demo</span><span>Los cambios dependen de los registros disponibles</span></div>
    </section>
  </div>
}

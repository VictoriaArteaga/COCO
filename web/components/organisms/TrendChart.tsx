'use client'

import { useMemo } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'

const types: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

export function TrendChart({ records, selected = types, days = 7, endDate }: { records: HabitRecord[]; selected?: HabitType[]; days?: number; endDate?: string }) {
  const data = useMemo(() => {
    const dates = Array.from({ length: days }, (_, index) => {
      const date = endDate ? new Date(`${endDate}T12:00:00`) : new Date()
      date.setDate(date.getDate() - (days - index - 1))
      return date.toISOString().slice(0, 10)
    })
    return dates.map((date) => {
      const row: Record<string, string | number> = { date: new Date(`${date}T12:00:00`).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' }) }
      selected.forEach((type) => {
        row[type] = records.filter((record) => record.habitType === type && record.recordedAt.slice(0, 10) === date).length
        row[`${type}_usual`] = 1
      })
      return row
    })
  }, [records, selected, days, endDate])

  return (
    <div className="h-72 w-full" role="img" aria-label="Gráfica de registros diarios por variable">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E5" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {selected.map((type) => <Line key={type} type="monotone" dataKey={type} name={HABIT_TYPE_INFO[type].label} stroke={HABIT_TYPE_INFO[type].color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />)}
          {selected.map((type) => <Line key={`${type}-usual`} type="monotone" dataKey={`${type}_usual`} name={`${HABIT_TYPE_INFO[type].label} · patrón demo`} stroke={HABIT_TYPE_INFO[type].color} strokeWidth={1} strokeDasharray="5 5" dot={false} activeDot={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

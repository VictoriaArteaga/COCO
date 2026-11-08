'use client'

import { useMemo } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'

const types: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

/** Versiones más claras de los colores de hábito para que las líneas se vean sobre fondo oscuro. */
const DARK_HABIT_COLORS: Record<HabitType, string> = {
  FOOD: '#2FD1AE', WATER: '#5AB0EA', SLEEP: '#8FA8F0', PLAY: '#F27A9C', BEHAVIOR: '#F0A24A',
}

const CHART_THEME = {
  light: { grid: '#C5D8D1', axis: '#8E98A6', tick: '#4A6862', ink: '#0B2E2A', tooltipBg: '#FFFFFF', tooltipText: '#0B2E2A' },
  dark: { grid: '#2E4A42', axis: '#7F9A92', tick: '#A5B7B1', ink: '#B7D4CB', tooltipBg: '#16241F', tooltipText: '#E7F3EF' },
} as const

export function TrendChart({ records, selected = types, days = 7, endDate }: { records: HabitRecord[]; selected?: HabitType[]; days?: number; endDate?: string }) {
  const { t, theme, locale } = usePrefs()
  const c = CHART_THEME[theme]
  const colorOf = (type: HabitType) => (theme === 'dark' ? DARK_HABIT_COLORS[type] : HABIT_TYPE_INFO[type].color)

  const data = useMemo(() => {
    const dates = Array.from({ length: days }, (_, index) => {
      const date = endDate ? new Date(`${endDate}T12:00:00`) : new Date()
      date.setDate(date.getDate() - (days - index - 1))
      return date.toISOString().slice(0, 10)
    })
    return dates.map((date) => {
      const row: Record<string, string | number> = { date: new Date(`${date}T12:00:00`).toLocaleDateString(locale, { weekday: 'short', day: 'numeric' }) }
      selected.forEach((type) => {
        row[type] = records.filter((record) => record.habitType === type && record.recordedAt.slice(0, 10) === date).length
        row[`${type}_usual`] = 1
      })
      return row
    })
  }, [records, selected, days, endDate, locale])

  return (
    <div className="h-72 w-full" role="img" aria-label={t.trends.chartAria}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: c.tick }} axisLine={{ stroke: c.axis }} tickLine={{ stroke: c.axis }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: c.tick }} axisLine={{ stroke: c.axis }} tickLine={{ stroke: c.axis }} />
          <Tooltip
            cursor={{ stroke: c.ink, strokeDasharray: '4 4' }}
            contentStyle={{ border: `1px solid ${c.ink}`, borderRadius: 12, background: c.tooltipBg, color: c.tooltipText, boxShadow: '0 8px 20px -12px rgb(0 0 0 / 0.5)' }}
            labelStyle={{ color: c.tooltipText }}
          />
          <Legend iconType="plainline" />
          {selected.map((type) => <Line key={type} type="monotone" dataKey={type} name={t.habits[type]} stroke={colorOf(type)} strokeWidth={2.5} dot={{ r: 3, stroke: c.ink, strokeWidth: 1, fill: colorOf(type) }} activeDot={{ r: 6, stroke: c.ink, strokeWidth: 1.5 }} animationDuration={1100} animationEasing="ease-out" />)}
          {selected.map((type) => <Line key={`${type}-usual`} type="monotone" dataKey={`${type}_usual`} name={`${t.habits[type]} · ${t.trends.pattern}`} stroke={colorOf(type)} strokeWidth={1} strokeDasharray="5 5" dot={false} activeDot={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

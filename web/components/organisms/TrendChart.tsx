'use client'

import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'

const types: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

/** Versiones más claras de los colores de hábito para que las curvas se vean sobre fondo oscuro. */
const DARK_HABIT_COLORS: Record<HabitType, string> = {
  FOOD: '#F5A25D', WATER: '#5CC3F0', SLEEP: '#8F9BF0', PLAY: '#FF7A94', BEHAVIOR: '#6FCF97',
}

const CHART_THEME = {
  light: { grid: '#EADBCB', tick: '#6D5545', ink: '#2B1B12', cardBg: '#FFFFFF', ring: '#FFFFFF', ref: '#BFA58E' },
  dark: { grid: '#4A3828', tick: '#A5B7B1', ink: '#E7F3EF', cardBg: '#241A13', ring: '#241A13', ref: '#5F8076' },
} as const

interface TooltipRow { dataKey?: string | number; value?: number | string; color?: string; name?: string }

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
      const day = new Date(`${date}T12:00:00`)
      const row: Record<string, string | number> = {
        date: day.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' }),
        full: day.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }),
      }
      selected.forEach((type) => {
        row[type] = records.filter((record) => record.habitType === type && record.recordedAt.slice(0, 10) === date).length
      })
      return row
    })
  }, [records, selected, days, endDate, locale])

  /** Tarjeta flotante con los valores del día: puntos de color, nombre y cifra. */
  function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Record<string, string | number> }[] & TooltipRow[] }) {
    if (!active || !payload?.length) return null
    const row = (payload[0] as { payload: Record<string, string | number> }).payload
    return (
      <div className="min-w-[10rem] rounded-2xl border p-3 text-sm shadow-xl" style={{ background: c.cardBg, color: c.ink, borderColor: theme === 'dark' ? '#4A3828' : '#E2D0BE' }}>
        <p className="mb-2 font-display text-base font-semibold capitalize">{String(row.full)}</p>
        <ul className="space-y-1.5">
          {selected.map((type) => (
            <li key={type} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 font-medium"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: colorOf(type) }} />{t.habits[type]}</span>
              <span className="font-bold tabular-nums">{row[type]}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {/* Leyenda en píldoras, con el color de cada variable */}
      <ul className="mb-4 flex flex-wrap gap-2" aria-hidden="true">
        {selected.map((type) => (
          <li key={type} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-bold text-text">
            <span className="h-3 w-3 rounded-full" style={{ background: colorOf(type) }} />
            {t.habits[type]}
          </li>
        ))}
      </ul>

      <div className="h-64 w-full sm:h-80 lg:h-96" role="img" aria-label={t.trends.chartAria}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={c.grid} strokeWidth={1} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: c.tick, fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis allowDecimals={false} domain={[0, (max: number) => Math.max(2, max + 1)]} tick={{ fontSize: 12, fill: c.tick, fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={6} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: c.ref, strokeWidth: 1.5, strokeDasharray: '4 6' }} />
            <ReferenceLine y={1} stroke={c.ref} strokeDasharray="5 6" strokeWidth={1.5} label={{ value: t.trends.pattern, position: 'insideTopRight', fontSize: 11, fill: c.tick, fontWeight: 600 }} />
            {selected.map((type) => (
              <Area
                key={type}
                type="linear"
                dataKey={type}
                name={t.habits[type]}
                stroke={colorOf(type)}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="miter"
                fill="none"
                dot={false}
                activeDot={{ r: 6, fill: colorOf(type), stroke: c.ring, strokeWidth: 3 }}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

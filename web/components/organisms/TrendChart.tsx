'use client'

import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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

/** Símbolo de cada variable, centrado en (0,0): círculo, cuadrado, triángulo, rombo y cruz. */
function Marker({ type, color, ring }: { type: HabitType; color: string; ring: string }) {
  switch (type) {
    case 'FOOD': return <circle r={5} fill={ring} stroke={color} strokeWidth={2.5} />
    case 'WATER': return <rect x={-5} y={-5} width={10} height={10} fill={ring} stroke={color} strokeWidth={2.5} />
    case 'SLEEP': return <path d="M0 -6L6 5L-6 5Z" fill={ring} stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
    case 'PLAY': return <path d="M0 -6L6 0L0 6L-6 0Z" fill={ring} stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
    default: return <path d="M-5 -5L5 5M5 -5L-5 5" stroke={color} strokeWidth={3} strokeLinecap="round" />
  }
}

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

  // Desplazamiento vertical de las etiquetas finales cuando varias variables terminan en el mismo valor.
  const endShift = useMemo(() => {
    const last = data[data.length - 1] ?? {}
    const seen: Record<string, number> = {}
    const shift: Record<string, number> = {}
    selected.forEach((type) => {
      const key = String(last[type] ?? 0)
      shift[type] = (seen[key] ?? 0) * 16
      seen[key] = (seen[key] ?? 0) + 1
    })
    return shift
  }, [data, selected])

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
      {/* Sin leyenda aparte: cada línea lleva su nombre al final y su propio símbolo */}
      <div className="h-64 w-full sm:h-72 lg:h-80" role="img" aria-label={t.trends.chartAria}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 112, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={c.grid} strokeWidth={1} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: c.tick, fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis allowDecimals={false} domain={[0, (max: number) => Math.max(2, max + 1)]} tick={{ fontSize: 12, fill: c.tick, fontWeight: 600 }} axisLine={false} tickLine={false} tickMargin={6} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: c.ref, strokeWidth: 1.5, strokeDasharray: '4 6' }} />
            {selected.map((type) => (
              <Line
                key={type}
                type="linear"
                dataKey={type}
                name={t.habits[type]}
                stroke={colorOf(type)}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                // Un símbolo distinto por variable: se reconocen sin depender solo del color
                dot={(p: { cx?: number; cy?: number; index?: number }) => (
                  <g key={`${type}-${p.index}`} transform={`translate(${p.cx ?? 0} ${p.cy ?? 0})`}><Marker type={type} color={colorOf(type)} ring={c.ring} /></g>
                )}
                activeDot={{ r: 6, fill: colorOf(type), stroke: c.ring, strokeWidth: 3 }}
                // Etiqueta directa al final de cada línea, separada si dos terminan en el mismo valor
                label={(p: { x?: number; y?: number; index?: number }) => p.index === data.length - 1
                  ? <text key={`${type}-end`} x={(p.x ?? 0) + 14} y={(p.y ?? 0) + 5 + (endShift[type] ?? 0)} fontSize={13} fontWeight={800} fill={c.ink}>{t.habits[type]}</text>
                  : <g key={`${type}-${p.index}-l`} />}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

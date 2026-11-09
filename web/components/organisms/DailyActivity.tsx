import type { HabitRecord } from '@/types'
import { getServerPrefs } from '@/lib/i18n/server'

/**
 * Organism: observaciones registradas por día en los últimos 7 días (barras con la cifra encima).
 * El día de hoy se resalta; el texto de abajo da el total para no depender solo de la forma de las barras.
 */
export async function DailyActivity({ records }: { records: HabitRecord[] }) {
  const { t, locale } = await getServerPrefs()
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)
    return {
      key,
      label: index === 6 ? t.common.today.toLowerCase() : date.toLocaleDateString(locale, { weekday: 'short' }),
      count: records.filter((record) => record.recordedAt.slice(0, 10) === key).length,
    }
  })
  const max = Math.max(1, ...days.map((day) => day.count))
  const total = days.reduce((sum, day) => sum + day.count, 0)

  return (
    <div>
      <ul className="flex h-52 items-end gap-2 sm:gap-3">
        {days.map((day, index) => (
          <li key={day.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-sm font-extrabold tabular-nums text-text">{day.count}</span>
            <div
              aria-hidden="true"
              className="w-full rounded-t-xl rounded-b-sm border-[1.5px] border-ink"
              style={{ height: `${Math.max(6, Math.round((day.count / max) * 140))}px`, background: index === 6 ? '#7D4D31' : '#C9A887' }}
            />
            <span className="w-full truncate text-center text-xs font-bold capitalize text-text-secondary">{day.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-text-secondary">{t.dashboard.activityTotal(total, days[6].count)}</p>
    </div>
  )
}

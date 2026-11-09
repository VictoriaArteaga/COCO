import type { HabitRecord, HabitType } from '@/types'
import { HabitCard } from '@/components/molecules/HabitCard'
import { getServerPrefs } from '@/lib/i18n/server'

const HABIT_TYPES: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

interface HabitOverviewProps {
  records: HabitRecord[]
  rabbitId?: string
}

/**
 * Organism: "Rutina de hoy". Encabezado con lo que falta y el avance (n de 5), barra de progreso
 * y una tarjeta por variable con su último registro de hoy.
 */
export async function HabitOverview({ records, rabbitId }: HabitOverviewProps) {
  const { t, locale } = await getServerPrefs()
  const today = new Date().toISOString().split('T')[0]

  const todayRecords = records.filter(
    (r) => r.recordedAt.startsWith(today),
  )

  const doneTypes = HABIT_TYPES.filter((type) => todayRecords.some((r) => r.habitType === type))
  const missing = HABIT_TYPES.filter((type) => !doneTypes.includes(type)).map((type) => t.habits[type])

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-green-dark">{t.dashboard.routineTitle}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            {missing.length === 0 ? t.dashboard.routineDone : t.dashboard.routineMissing(new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(missing))}
          </p>
        </div>
        <span className="font-display text-[22px] font-semibold text-green-dark">{t.dashboard.routineCount(doneTypes.length)}</span>
      </div>
      <div
        className="mb-5 mt-4 h-2.5 overflow-hidden rounded-full border border-line bg-surface"
        role="progressbar" aria-valuemin={0} aria-valuemax={5} aria-valuenow={doneTypes.length} aria-label={t.dashboard.routineCount(doneTypes.length)}
      >
        <div className="h-full rounded-full bg-yellow transition-[width] duration-700" style={{ width: `${(doneTypes.length / 5) * 100}%` }} />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-5" aria-label={t.dashboard.todayHabits}>
        {HABIT_TYPES.map((type) => {
          const latest = todayRecords
            .filter((r) => r.habitType === type)
            .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0] ?? null

          return <HabitCard key={type} habitType={type} latestRecord={latest} rabbitId={rabbitId} />
        })}
      </div>
    </div>
  )
}

import type { HabitRecord, HabitType } from '@/types'
import { HabitCard } from '@/components/molecules/HabitCard'
import { Icon } from '@/components/atoms/Icon'
import { getServerPrefs } from '@/lib/i18n/server'

const HABIT_TYPES: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

interface HabitOverviewProps {
  records: HabitRecord[]
}

/**
 * Organism: grid of HabitCards — one per habit type.
 * Shows the most recent record for each type today.
 */
export async function HabitOverview({ records }: HabitOverviewProps) {
  const { t } = await getServerPrefs()
  const today = new Date().toISOString().split('T')[0]

  const todayRecords = records.filter(
    (r) => r.recordedAt.startsWith(today),
  )

  const doneTypes = HABIT_TYPES.filter((type) => todayRecords.some((r) => r.habitType === type))
  const missing = HABIT_TYPES.filter((type) => !doneTypes.includes(type)).map((type) => t.habits[type])

  return (
    <div className="card space-y-5">
      {/* Progreso de la rutina de hoy: qué falta, de un vistazo */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-green-dark">{t.dashboard.routineTitle}</h3>
          <span className="badge bg-green-light text-green-dark"><Icon name="check" size={14} />{t.reminders.doneOf(doneTypes.length)}</span>
        </div>
        <div
          className="mt-3 h-3 overflow-hidden rounded-full border border-line bg-surface"
          role="progressbar" aria-valuemin={0} aria-valuemax={5} aria-valuenow={doneTypes.length} aria-label={t.reminders.doneOf(doneTypes.length)}
        >
          <div className="h-full rounded-full bg-yellow transition-[width] duration-700" style={{ width: `${(doneTypes.length / 5) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm font-medium text-text-secondary">
          {missing.length === 0 ? t.dashboard.routineDone : t.dashboard.routineMissing(missing.join(', '))}
        </p>
      </div>

      <div
        className="stagger grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4"
        aria-label={t.dashboard.todayHabits}
      >
        {HABIT_TYPES.map((type) => {
          const latest = todayRecords
            .filter((r) => r.habitType === type)
            .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0] ?? null

          return (
            <HabitCard
              key={type}
              habitType={type}
              latestRecord={latest}
            />
          )
        })}
      </div>
    </div>
  )
}

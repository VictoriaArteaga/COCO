import type { HabitRecord, HabitType } from '@/types'
import { HabitCard } from '@/components/molecules/HabitCard'

const HABIT_TYPES: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

interface HabitOverviewProps {
  records: HabitRecord[]
}

/**
 * Organism: grid of HabitCards — one per habit type.
 * Shows the most recent record for each type today.
 */
export function HabitOverview({ records }: HabitOverviewProps) {
  const today = new Date().toISOString().split('T')[0]

  const todayRecords = records.filter(
    (r) => r.recordedAt.startsWith(today),
  )

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      aria-label="Resumen de hábitos de hoy"
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
  )
}

import type { HabitType, RecordStatus } from '@/types'
import { cn } from '@/lib/utils/cn'
import { getServerPrefs } from '@/lib/i18n/server'

// ─── Record status badge ───────────────────────────────────────────────────────

const STATUS_STYLES: Record<RecordStatus, string> = {
  SYNCED:    'bg-green-light text-green-dark',
  PENDING:   'bg-yellow-100 text-yellow-800',
  FAILED:    'bg-red-100 text-red-800',
  DUPLICATE: 'bg-gray-100 text-gray-600',
}

interface RecordStatusBadgeProps {
  status: RecordStatus
  className?: string
}

/** Accessible badge for a HabitRecord sync status. */
export async function RecordStatusBadge({ status, className }: RecordStatusBadgeProps) {
  const { t } = await getServerPrefs()
  return (
    <span
      className={cn('badge', STATUS_STYLES[status], className)}
      aria-label={`${t.recordStatusLabel}: ${t.recordStatus[status]}`}
    >
      {t.recordStatus[status]}
    </span>
  )
}

// ─── Habit type badge ──────────────────────────────────────────────────────────

const HABIT_BG: Record<HabitType, string> = {
  FOOD:     'bg-habit-food',
  WATER:    'bg-habit-water',
  SLEEP:    'bg-habit-sleep',
  PLAY:     'bg-habit-play',
  BEHAVIOR: 'bg-habit-behavior',
}

interface HabitTypeBadgeProps {
  habitType: HabitType
  className?: string
}

/** Accessible badge for a habit type, using Design System colours. */
export async function HabitTypeBadge({ habitType, className }: HabitTypeBadgeProps) {
  const { t } = await getServerPrefs()
  return (
    <span className={cn('badge text-white', HABIT_BG[habitType], className)}>
      {t.habits[habitType]}
    </span>
  )
}

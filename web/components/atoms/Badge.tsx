import type { HabitType, RecordStatus, SyncStatusType } from '@/types'
import { cn } from '@/lib/utils/cn'

// ─── Record status badge ───────────────────────────────────────────────────────

const STATUS_STYLES: Record<RecordStatus, string> = {
  SYNCED:    'bg-green-light text-green-dark',
  PENDING:   'bg-yellow-100 text-yellow-800',
  FAILED:    'bg-red-100 text-red-800',
  DUPLICATE: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<RecordStatus, string> = {
  SYNCED:    'Sincronizado',
  PENDING:   'Pendiente',
  FAILED:    'Error',
  DUPLICATE: 'Duplicado',
}

interface RecordStatusBadgeProps {
  status: RecordStatus
  className?: string
}

/** Accessible badge for a HabitRecord sync status. */
export function RecordStatusBadge({ status, className }: RecordStatusBadgeProps) {
  return (
    <span
      className={cn('badge', STATUS_STYLES[status], className)}
      aria-label={`Estado: ${STATUS_LABELS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

// ─── Habit type badge ──────────────────────────────────────────────────────────

const HABIT_STYLES: Record<HabitType, string> = {
  FOOD:     'text-white',
  WATER:    'text-white',
  SLEEP:    'text-white',
  PLAY:     'text-white',
  BEHAVIOR: 'text-white',
}

const HABIT_BG: Record<HabitType, string> = {
  FOOD:     'bg-[#5B8E69]',
  WATER:    'bg-[#4387A8]',
  SLEEP:    'bg-[#70659A]',
  PLAY:     'bg-[#C4778C]',
  BEHAVIOR: 'bg-[#C87945]',
}

const HABIT_LABELS: Record<HabitType, string> = {
  FOOD:     'Alimentación',
  WATER:    'Agua',
  SLEEP:    'Sueño',
  PLAY:     'Juego',
  BEHAVIOR: 'Comportamiento',
}

interface HabitTypeBadgeProps {
  habitType: HabitType
  className?: string
}

/** Accessible badge for a habit type, using Design System colours. */
export function HabitTypeBadge({ habitType, className }: HabitTypeBadgeProps) {
  return (
    <span
      className={cn('badge', HABIT_BG[habitType], HABIT_STYLES[habitType], className)}
    >
      {HABIT_LABELS[habitType]}
    </span>
  )
}

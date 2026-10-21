import type { HabitType, HabitRecord } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { cn } from '@/lib/utils/cn'

interface HabitCardProps {
  habitType: HabitType
  /** Latest record for this habit type today, or null if none */
  latestRecord: HabitRecord | null
  className?: string
}

/**
 * Card for a single habit type showing the latest recorded value.
 * Colour accent uses the Design System token for that variable.
 */
export function HabitCard({ habitType, latestRecord, className }: HabitCardProps) {
  const info = HABIT_TYPE_INFO[habitType]

  const valueText = latestRecord?.value != null
    ? `${latestRecord.value} ${info.unit}`
    : latestRecord?.note
      ? latestRecord.note
      : 'Sin registros hoy'

  return (
    <article
      className={cn('card flex flex-col gap-2', className)}
      aria-label={`${info.label}: ${valueText}`}
    >
      {/* Colour accent strip using inline style for the dynamic Design System colour */}
      <div
        className="w-full h-1 rounded-full"
        style={{ backgroundColor: info.color }}
        aria-hidden="true"
      />
      <h3 className="text-sm font-semibold text-text">{info.label}</h3>
      <p className="text-xl font-bold text-text" aria-live="polite">
        {valueText}
      </p>
      {latestRecord && (
        <time
          className="text-xs text-text-secondary"
          dateTime={latestRecord.recordedAt}
        >
          {new Date(latestRecord.recordedAt).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      )}
    </article>
  )
}

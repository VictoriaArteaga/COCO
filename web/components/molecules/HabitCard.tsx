import type { HabitType, HabitRecord } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { cn } from '@/lib/utils/cn'
import { HABIT_ICON, Icon, IconTile } from '@/components/atoms/Icon'
import { getServerPrefs } from '@/lib/i18n/server'

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
export async function HabitCard({ habitType, latestRecord, className }: HabitCardProps) {
  const { t, locale } = await getServerPrefs()
  const info = HABIT_TYPE_INFO[habitType]
  const label = t.habits[habitType]

  const valueText = latestRecord?.value != null
    ? `${latestRecord.value} ${t.units[info.unit] ?? info.unit}`
    : latestRecord?.note
      ? latestRecord.note
      : t.dashboard.noRecordsToday

  return (
    <article
      className={cn(
        'group flex flex-col gap-3 rounded-2xl border-[1.5px] p-4',
        latestRecord ? 'border-line bg-surface' : 'border-green-dark bg-card',
        className,
      )}
      aria-label={`${label}: ${valueText}`}
    >
      <div className="flex items-center gap-3">
        <IconTile name={HABIT_ICON[habitType]} color={info.color} size={40} />
        <h3 className="font-display text-base font-semibold text-text">{label}</h3>
      </div>
      {/* Estado de hoy con icono y texto (no solo color) */}
      <span className={cn('badge w-fit', latestRecord ? 'bg-green-light text-green-dark' : 'bg-yellow-100 text-yellow-800')}>
        <Icon name={latestRecord ? 'check' : 'clock'} size={13} />
        {latestRecord ? t.reminders.done : t.reminders.pending}
      </span>
      <p className="text-xl font-bold text-text" aria-live="polite">
        {valueText}
      </p>
      {latestRecord && (
        <time
          className="text-xs text-text-secondary"
          dateTime={latestRecord.recordedAt}
        >
          {new Date(latestRecord.recordedAt).toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      )}
      {/* Barra de acento que se dibuja al entrar */}
      <div
        className="mt-auto h-1 w-full origin-left rounded-full"
        style={{ backgroundColor: info.color, animation: 'grow-x 0.8s 0.3s var(--ease-out) backwards' }}
        aria-hidden="true"
      />
    </article>
  )
}

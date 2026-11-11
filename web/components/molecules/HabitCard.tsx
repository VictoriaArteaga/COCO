import type { HabitType, HabitRecord } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { cn } from '@/lib/utils/cn'
import { formatRecordValue } from '@/lib/utils/format'
import { HABIT_ICON, Icon, IconTile } from '@/components/atoms/Icon'
import { RegisterObservation } from '@/components/organisms/RegisterObservation'
import { getServerPrefs } from '@/lib/i18n/server'

interface HabitCardProps {
  habitType: HabitType
  /** Latest record for this habit type today, or null if none */
  latestRecord: HabitRecord | null
  /** Conejo activo: permite registrar desde la tarjeta cuando la variable está pendiente. */
  rabbitId?: string
  className?: string
}

/**
 * Tarjeta de una variable en la rutina de hoy: icono y nombre, estado (con icono y texto),
 * último valor y hora; si está pendiente, ofrece registrarla en un toque.
 */
export async function HabitCard({ habitType, latestRecord, rabbitId, className }: HabitCardProps) {
  const { t, locale } = await getServerPrefs()
  const info = HABIT_TYPE_INFO[habitType]
  const label = t.habits[habitType]

  const valueText = latestRecord?.value != null
    ? formatRecordValue(latestRecord.value, info.unit, t.units[info.unit])
    : latestRecord?.note
      ? latestRecord.note
      : t.dashboard.noRecordsToday

  return (
    <article
      className={cn(
        'flex flex-col gap-2.5 rounded-2xl border-[1.5px] p-4',
        latestRecord ? 'border-line bg-surface' : 'border-green-dark bg-card',
        className,
      )}
      aria-label={`${label}: ${valueText}`}
    >
      <div className="flex items-center gap-2.5">
        <IconTile name={HABIT_ICON[habitType]} color={info.color} size={40} />
        <h3 className="font-display text-[17px] font-semibold text-text">{label}</h3>
      </div>
      <span className={cn('badge w-fit', latestRecord ? 'bg-green-light text-green-dark' : 'bg-yellow-100 text-yellow-800')}>
        <Icon name={latestRecord ? 'check' : 'clock'} size={13} />
        {latestRecord ? t.reminders.done : t.reminders.pending}
      </span>
      <p className="text-[15px] font-bold leading-snug text-text" aria-live="polite">{valueText}</p>
      <p className="min-h-[17px] text-[13px] text-text-secondary">
        {latestRecord && (
          <time dateTime={latestRecord.recordedAt}>
            {t.common.today}, {new Date(latestRecord.recordedAt).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}
          </time>
        )}
      </p>
      {!latestRecord && rabbitId && (
        <div className="mt-0.5"><RegisterObservation rabbitId={rabbitId} type={habitType} variant="secondary" /></div>
      )}
    </article>
  )
}

import type { HabitRecord } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { HABIT_ICON, IconTile } from '@/components/atoms/Icon'
import { RecordStatusBadge } from '@/components/atoms/Badge'
import { getServerPrefs } from '@/lib/i18n/server'
import { formatRecordValue } from '@/lib/utils/format'

interface RecentRecordsProps {
  records: HabitRecord[]
  /** Maximum number of records to display */
  limit?: number
}

/**
 * Organism: lista de los registros más recientes.
 * Cada fila: icono de la variable, valor o nota con fecha y origen, y el estado con icono y texto.
 */
export async function RecentRecords({ records, limit = 5 }: RecentRecordsProps) {
  const { t, locale } = await getServerPrefs()
  const displayed = [...records]
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    .slice(0, limit)

  if (displayed.length === 0) {
    return (
      <div>
        <p className="py-6 text-center text-sm text-text-secondary">
          {t.records.empty}
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-line" aria-label={t.records.table}>
      {displayed.map((record) => {
        const info = HABIT_TYPE_INFO[record.habitType]
        const detail = record.note || (record.value != null ? formatRecordValue(record.value, info.unit, t.units[info.unit]) : t.common.noValue)
        return (
          <li key={record.id} className="flex flex-wrap items-center gap-3 py-3">
            <IconTile name={HABIT_ICON[record.habitType]} color={info.color} size={38} />
            <div className="min-w-0 flex-1 basis-40">
              <p className="font-extrabold text-text">{t.habits[record.habitType]}</p>
              <p className="truncate text-sm text-text-secondary">
                {detail} ·{' '}
                <time dateTime={record.recordedAt}>
                  {new Date(record.recordedAt).toLocaleString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </time>{' '}
                · {record.source === 'WATCH' ? t.history.watch : t.history.webShort}
              </p>
            </div>
            <RecordStatusBadge status={record.status} />
          </li>
        )
      })}
    </ul>
  )
}

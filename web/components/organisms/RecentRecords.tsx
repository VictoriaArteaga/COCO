import type { HabitRecord } from '@/types'
import { HabitTypeBadge, RecordStatusBadge } from '@/components/atoms/Badge'
import { getServerPrefs } from '@/lib/i18n/server'

interface RecentRecordsProps {
  records: HabitRecord[]
  /** Maximum number of records to display */
  limit?: number
}

/**
 * Organism: table / list of recent habit records.
 * Accessible: proper table semantics, header cells, sortable columns prepared.
 */
export async function RecentRecords({ records, limit = 10 }: RecentRecordsProps) {
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] text-sm" aria-label={t.records.table}>
        <thead>
          <tr className="border-b-2 border-line text-left">
            <th scope="col" className="pb-3 pr-4 font-semibold text-text">{t.records.variable}</th>
            <th scope="col" className="pb-3 pr-4 font-semibold text-text">{t.records.value}</th>
            <th scope="col" className="pb-3 pr-4 font-semibold text-text">{t.records.note}</th>
            <th scope="col" className="pb-3 pr-4 font-semibold text-text">{t.records.date}</th>
            <th scope="col" className="pb-3 font-semibold text-text">{t.records.status}</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((record) => (
            <tr
              key={record.id}
              className="border-b border-line last:border-0 hover:bg-green-light/50"
            >
              <td className="py-3 pr-4">
                <HabitTypeBadge habitType={record.habitType} />
              </td>
              <td className="py-3 pr-4 text-text">
                {record.value != null ? record.value : t.common.noValue}
              </td>
              <td className="py-3 pr-4 text-text-secondary max-w-[180px] truncate">
                {record.note ?? t.common.noValue}
              </td>
              <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">
                <time dateTime={record.recordedAt}>
                  {new Date(record.recordedAt).toLocaleString(locale, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </td>
              <td className="py-3">
                <RecordStatusBadge status={record.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

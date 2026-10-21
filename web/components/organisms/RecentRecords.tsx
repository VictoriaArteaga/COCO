import type { HabitRecord } from '@/types'
import { HabitTypeBadge, RecordStatusBadge } from '@/components/atoms/Badge'

interface RecentRecordsProps {
  records: HabitRecord[]
  /** Maximum number of records to display */
  limit?: number
}

/**
 * Organism: table / list of recent habit records.
 * Accessible: proper table semantics, header cells, sortable columns prepared.
 */
export function RecentRecords({ records, limit = 10 }: RecentRecordsProps) {
  const displayed = [...records]
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    .slice(0, limit)

  if (displayed.length === 0) {
    return (
      <div className="card">
        <p className="text-text-secondary text-sm text-center py-6">
          No hay registros para mostrar.
        </p>
      </div>
    )
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm" aria-label="Registros recientes">
        <thead>
          <tr className="border-b border-green-light text-left">
            <th scope="col" className="pb-3 pr-4 font-semibold text-text">Variable</th>
            <th scope="col" className="pb-3 pr-4 font-semibold text-text">Valor</th>
            <th scope="col" className="pb-3 pr-4 font-semibold text-text">Nota</th>
            <th scope="col" className="pb-3 pr-4 font-semibold text-text">Fecha</th>
            <th scope="col" className="pb-3 font-semibold text-text">Estado</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((record) => (
            <tr
              key={record.id}
              className="border-b border-green-light last:border-0 hover:bg-surface"
            >
              <td className="py-3 pr-4">
                <HabitTypeBadge habitType={record.habitType} />
              </td>
              <td className="py-3 pr-4 text-text">
                {record.value != null ? record.value : '—'}
              </td>
              <td className="py-3 pr-4 text-text-secondary max-w-[180px] truncate">
                {record.note ?? '—'}
              </td>
              <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">
                <time dateTime={record.recordedAt}>
                  {new Date(record.recordedAt).toLocaleString('es-CO', {
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

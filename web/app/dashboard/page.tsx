import type { Metadata } from 'next'
import { DashboardHeader } from '@/components/organisms/DashboardHeader'
import { HabitOverview } from '@/components/organisms/HabitOverview'
import { RecentRecords } from '@/components/organisms/RecentRecords'
import { SyncStatus } from '@/components/molecules/SyncStatus'
import { MOCK_RABBIT, MOCK_RECORDS } from '@/lib/mock/dashboard'

export const metadata: Metadata = { title: 'Inicio' }

/**
 * Dashboard page — home screen for the web platform.
 *
 * Week 4 scope: structural skeleton with mock data.
 * Mocks are clearly labelled and will be replaced by real API calls in week 5.
 * No mock data is sent to the backend.
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header: rabbit selector + date */}
      <DashboardHeader rabbit={MOCK_RABBIT} />

      {/* Sync status indicator */}
      <SyncStatus
        status="synced"
        label="Todos los registros sincronizados"
        className="self-start"
      />

      {/* Habit variable cards — one per FOOD, WATER, SLEEP, PLAY, BEHAVIOR */}
      <section aria-labelledby="habits-heading">
        <h2 id="habits-heading" className="sr-only">
          Resumen de hábitos
        </h2>
        <HabitOverview records={MOCK_RECORDS} />
      </section>

      {/* Recent records table / list */}
      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-lg font-semibold text-text mb-3">
          Registros recientes
        </h2>
        <RecentRecords records={MOCK_RECORDS} />
      </section>

      {/* Chart area — prepared for week 5 */}
      <section
        aria-labelledby="charts-heading"
        className="card min-h-[200px] flex items-center justify-center"
      >
        <p className="text-text-secondary text-sm">
          Las gráficas de tendencias estarán disponibles en la próxima fase.
        </p>
      </section>
    </div>
  )
}

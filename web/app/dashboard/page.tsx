import type { Metadata } from 'next'
import { DashboardHeader } from '@/components/organisms/DashboardHeader'
import { HabitOverview } from '@/components/organisms/HabitOverview'
import { RecentRecords } from '@/components/organisms/RecentRecords'
import { SyncStatus } from '@/components/molecules/SyncStatus'
import { getDashboardData } from '@/lib/api/server'
import { TrendChart } from '@/components/organisms/TrendChart'
import { CreateRabbitForm } from '@/components/organisms/CreateRabbitForm'

export const metadata: Metadata = { title: 'Inicio' }

/**
 * Dashboard page — home screen for the web platform.
 *
 * Dashboard data is loaded from the authenticated backend session.
 */
export default async function DashboardPage() {
  const { rabbit, rabbits, records } = await getDashboardData()
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header: rabbit selector + date */}
      <DashboardHeader rabbit={rabbit} rabbits={rabbits} />
      {!rabbit && <CreateRabbitForm />}

      {/* Sync status indicator */}
      <SyncStatus
        status="synced"
        label="Datos cargados desde tu cuenta"
        className="self-start"
      />

      {/* Habit variable cards — one per FOOD, WATER, SLEEP, PLAY, BEHAVIOR */}
      <section aria-labelledby="habits-heading">
        <h2 id="habits-heading" className="sr-only">
          Resumen de hábitos
        </h2>
        <HabitOverview records={records} />
      </section>

      {/* Recent records table / list */}
      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-lg font-semibold text-text mb-3">
          Registros recientes
        </h2>
        <RecentRecords records={records} />
      </section>

      <section
        aria-labelledby="charts-heading"
        className="card"
      >
        <div className="mb-4"><h2 id="charts-heading" className="text-lg font-semibold">Actividad de los últimos 7 días</h2><p className="text-sm text-text-secondary">Observaciones registradas por variable.</p></div>
        <TrendChart records={records} />
      </section>
    </div>
  )
}

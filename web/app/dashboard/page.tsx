import type { Metadata } from 'next'
import Link from 'next/link'
import { DashboardHeader } from '@/components/organisms/DashboardHeader'
import { HabitOverview } from '@/components/organisms/HabitOverview'
import { RecentRecords } from '@/components/organisms/RecentRecords'
import { DailyActivity } from '@/components/organisms/DailyActivity'
import { CreateRabbitForm } from '@/components/organisms/CreateRabbitForm'
import { Icon } from '@/components/atoms/Icon'
import { getDashboardData } from '@/lib/api/server'
import { getServerPrefs } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: t.dashboard.metaTitle }
}

/**
 * Inicio: saludo, rutina de hoy, registros recientes y actividad de la semana.
 * Los datos se cargan desde la sesión autenticada del backend.
 */
export default async function DashboardPage() {
  const { t } = await getServerPrefs()
  const { rabbit, rabbits, records } = await getDashboardData()
  return (
    <div className="stagger flex flex-col gap-5 p-4 sm:p-6 lg:gap-6 lg:p-8">
      <DashboardHeader rabbit={rabbit} rabbits={rabbits} />
      {!rabbit && <CreateRabbitForm />}

      <section aria-labelledby="habits-heading">
        <h2 id="habits-heading" className="sr-only">{t.dashboard.habitsHeading}</h2>
        <HabitOverview records={records} rabbitId={rabbit?.id} />
      </section>

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <section aria-labelledby="recent-heading" className="card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="recent-heading" className="font-display text-xl font-semibold text-green-dark">{t.dashboard.recent}</h2>
              <p className="mt-1 text-sm text-text-secondary">{t.dashboard.recentSub}</p>
            </div>
            <Link href="/history" className="inline-flex min-h-[44px] items-center gap-1 font-extrabold text-green-dark">
              {t.dashboard.viewHistory}<Icon name="chev" size={16} />
            </Link>
          </div>
          <RecentRecords records={records} limit={5} />
        </section>

        <section aria-labelledby="charts-heading" className="card">
          <h2 id="charts-heading" className="font-display text-xl font-semibold text-green-dark">{t.dashboard.chartTitle}</h2>
          <p className="mb-4 text-sm text-text-secondary">{t.dashboard.chartSub}</p>
          <DailyActivity records={records} />
        </section>
      </div>

      <div role="note" className="card flex items-start gap-3 !border-green-dark !p-4">
        <Icon name="shield" size={22} className="mt-0.5 flex-shrink-0 text-green-dark" />
        <p className="text-sm font-semibold text-text">{t.brand.long}</p>
      </div>
    </div>
  )
}

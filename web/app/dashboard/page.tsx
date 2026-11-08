import type { Metadata } from 'next'
import { DashboardHeader } from '@/components/organisms/DashboardHeader'
import { HabitOverview } from '@/components/organisms/HabitOverview'
import { RecentRecords } from '@/components/organisms/RecentRecords'
import { getDashboardData } from '@/lib/api/server'
import { getServerPrefs } from '@/lib/i18n/server'
import { TrendChart } from '@/components/organisms/TrendChart'
import { CreateRabbitForm } from '@/components/organisms/CreateRabbitForm'
import { HeroPanel } from '@/components/organisms/HeroPanel'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: t.dashboard.metaTitle }
}

/**
 * Dashboard page — home screen for the web platform.
 *
 * Dashboard data is loaded from the authenticated backend session.
 */
export default async function DashboardPage() {
  const { t } = await getServerPrefs()
  const { rabbit, rabbits, records } = await getDashboardData()
  return (
    <div className="stagger flex flex-col gap-5 p-4 sm:p-6 lg:gap-6 lg:p-8">
      {/* Header: rabbit selector + date */}
      <DashboardHeader rabbit={rabbit} rabbits={rabbits} />
      {!rabbit && <CreateRabbitForm />}
      <HeroPanel rabbit={rabbit} records={records} />


      {/* Habit variable cards — one per FOOD, WATER, SLEEP, PLAY, BEHAVIOR */}
      <section aria-labelledby="habits-heading">
        <h2 id="habits-heading" className="sr-only">
          {t.dashboard.habitsHeading}
        </h2>
        <HabitOverview records={records} />
      </section>

      {/* Recent records table / list */}
      <section aria-labelledby="recent-heading" className="auth-card rounded-sheet p-4 sm:p-6">
        <h2 id="recent-heading" className="mb-4 font-display text-xl font-semibold text-green-dark">
          {t.dashboard.recent}
        </h2>
        <RecentRecords records={records} />
      </section>

      <section
        aria-labelledby="charts-heading"
        className="card"
      >
        <div className="mb-4"><h2 id="charts-heading" className="font-display text-xl font-semibold text-green-dark">{t.dashboard.chartTitle}</h2><p className="text-sm text-text-secondary">{t.dashboard.chartSub}</p></div>
        <TrendChart records={records} />
      </section>
    </div>
  )
}

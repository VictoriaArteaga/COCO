import type { Rabbit } from '@/types'
import { RabbitSelector } from '@/components/molecules/RabbitSelector'
import { getServerPrefs } from '@/lib/i18n/server'

interface DashboardHeaderProps {
  rabbit: Rabbit | null
  rabbits?: Rabbit[]
}

/**
 * Organism: top header for the dashboard page.
 * Displays the rabbit selector, date, and page title.
 */
export async function DashboardHeader({ rabbit, rabbits }: DashboardHeaderProps) {
  const { t, locale } = await getServerPrefs()
  const today = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-text">{t.dashboard.title}</h1>
        <time
          className="text-sm text-text-secondary capitalize"
          dateTime={new Date().toISOString().split('T')[0]}
        >
          {today}
        </time>
      </div>

      {rabbit && (
        <RabbitSelector
          rabbits={rabbits ?? [rabbit]}
          selected={rabbit}
        />
      )}
    </header>
  )
}

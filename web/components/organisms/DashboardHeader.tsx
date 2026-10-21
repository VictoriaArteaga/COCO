import type { Rabbit } from '@/types'
import { RabbitSelector } from '@/components/molecules/RabbitSelector'

interface DashboardHeaderProps {
  rabbit: Rabbit | null
  rabbits?: Rabbit[]
}

/**
 * Organism: top header for the dashboard page.
 * Displays the rabbit selector, date, and page title.
 */
export function DashboardHeader({ rabbit, rabbits }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-text">Panel de inicio</h1>
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

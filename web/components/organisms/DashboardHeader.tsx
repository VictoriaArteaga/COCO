import type { Rabbit } from '@/types'
import { PageHeader } from '@/components/organisms/PageHeader'
import { RegisterObservation } from '@/components/organisms/RegisterObservation'
import { getServerPrefs } from '@/lib/i18n/server'

interface DashboardHeaderProps {
  rabbit: Rabbit | null
  rabbits?: Rabbit[]
}

/** Cabecera del tablero: saludo con el nombre del conejo, fecha y el botón principal "Registrar observación". */
export async function DashboardHeader({ rabbit }: DashboardHeaderProps) {
  const { t, locale } = await getServerPrefs()
  const today = new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <PageHeader
      title={rabbit ? t.dashboard.greeting(rabbit.name) : t.dashboard.title}
      icon="home"
      sub={<time className="capitalize" dateTime={new Date().toISOString().split('T')[0]}>{today}</time>}
    >
      {rabbit && <RegisterObservation rabbitId={rabbit.id} />}
    </PageHeader>
  )
}

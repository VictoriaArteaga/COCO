import type { Rabbit } from '@/types'
import { RabbitSelector } from '@/components/molecules/RabbitSelector'
import { PageHeader } from '@/components/organisms/PageHeader'
import { getServerPrefs } from '@/lib/i18n/server'

interface DashboardHeaderProps {
  rabbit: Rabbit | null
  rabbits?: Rabbit[]
}

/** Cabecera del tablero: título, fecha y selector de conejo. */
export async function DashboardHeader({ rabbit, rabbits }: DashboardHeaderProps) {
  const { t, locale } = await getServerPrefs()
  const today = new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <PageHeader title={t.dashboard.title} icon="home" sub={<time className="capitalize" dateTime={new Date().toISOString().split('T')[0]}>{today}</time>}>
      {rabbit && (
        <div className="rounded-xl border border-white/30 bg-white/15 px-4 py-2 text-white">
          <RabbitSelector rabbits={rabbits ?? [rabbit]} selected={rabbit} />
        </div>
      )}
    </PageHeader>
  )
}

import type { HabitRecord, Rabbit } from '@/types'
import { IconTile, type IconName } from '@/components/atoms/Icon'
import { RabbitIllustration } from '@/components/atoms/RabbitIllustration'
import { getServerPrefs } from '@/lib/i18n/server'

/**
 * Panel de bienvenida del tablero: superficie turquesa con la ilustración de Coquito
 * y una barra de "detalles" de tres columnas. Las cifras se calculan sólo con los registros recibidos.
 */
export async function HeroPanel({ rabbit, records }: { rabbit: Rabbit | null; records: HabitRecord[] }) {
  const { t, locale } = await getServerPrefs()
  const sorted = [...records].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
  const last = sorted[0]
  const since = Date.now() - 7 * 86_400_000
  const week = sorted.filter((r) => new Date(r.recordedAt).getTime() >= since)
  const variables = new Set(week.map((r) => r.habitType)).size
  const lastText = last
    ? new Date(last.recordedAt).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : t.hero.none

  const stats: { icon: IconName; label: string; value: string }[] = [
    { icon: 'list', label: t.hero.week, value: String(week.length) },
    { icon: 'behavior', label: t.hero.variables, value: t.hero.of5(variables) },
    { icon: 'bell', label: t.hero.last, value: lastText },
  ]

  return (
    <section
      aria-label={t.hero.summary}
      className="relative overflow-hidden rounded-sheet border-[1.5px] border-ink bg-green p-6 pb-24 text-white sm:p-8 sm:pb-24"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Trama y círculos decorativos */}
      <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.6) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <div aria-hidden="true" className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-green-bright/40" />

      <div className="relative flex items-center justify-between gap-6">
        <div>
          <p className="text-4xl font-extrabold uppercase tracking-wide text-white sm:text-5xl" style={{ animation: 'fade-up 0.6s 0.1s var(--ease-out) backwards' }}>
            {t.hero.hello}
          </p>
          <p className="mt-2 text-lg font-bold text-deep" style={{ animation: 'fade-up 0.6s 0.2s var(--ease-out) backwards' }}>
            {rabbit ? t.hero.rabbitLine(rabbit.name) : t.hero.noRabbit}
          </p>
          <p className="mt-1 max-w-md text-sm font-medium text-deep" style={{ animation: 'fade-up 0.6s 0.3s var(--ease-out) backwards' }}>
            {t.hero.sub}
          </p>
        </div>
        <div className="float-slow hidden h-40 w-40 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink bg-white sm:flex" style={{ animation: 'scale-in 0.7s 0.15s var(--ease-out) backwards, float 5s 1s ease-in-out infinite' }}>
          <RabbitIllustration className="h-36 w-36" />
        </div>
      </div>

      {/* Barra de detalles superpuesta en el borde inferior */}
      <div className="absolute inset-x-4 bottom-4 sm:inset-x-6">
        <dl className="detail-bar" style={{ animation: 'fade-up 0.6s 0.35s var(--ease-out) backwards' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col items-center gap-1 px-2 py-3 text-center">
              <IconTile name={stat.icon} size={28} />
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">{stat.label}</dt>
              <dd className="max-w-full truncate text-sm font-extrabold text-text sm:text-base">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

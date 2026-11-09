import type { Metadata } from 'next'
import { getAuthenticated } from '@/lib/api/server'
import { getServerPrefs } from '@/lib/i18n/server'
import type { HabitRecord, PaginatedResponse, RecordStatus } from '@/types'
import { HABIT_ICON, Icon, IconTile, type IconName } from '@/components/atoms/Icon'
import { HABIT_TYPE_INFO } from '@/types'
import { PageHeader } from '@/components/organisms/PageHeader'
import { RecordStatusBadge } from '@/components/atoms/Badge'
import { RefreshButton } from '@/components/atoms/RefreshButton'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: t.sync.title }
}

function Kpi({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div className="card flex items-center gap-4 !p-4 sm:!p-5">
      <span className="auth-badge flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"><Icon name={icon} size={22} /></span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-text-secondary">{label}</p>
        <p className="truncate font-display text-2xl font-semibold leading-tight text-text">{value}</p>
      </div>
    </div>
  )
}

export default async function SynchronizationPage() {
  const { t, locale } = await getServerPrefs()
  const s = t.sync
  const page = await getAuthenticated<PaginatedResponse<HabitRecord>>('habits?page=0&size=100&sort=recordedAt,desc')
  const records = page.content
  const fmt = (value: string) => new Date(value).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  const count = (status: RecordStatus) => records.filter((r) => r.status === status).length
  const failed = count('FAILED')
  const duplicates = count('DUPLICATE')
  const watch = records.filter((r) => r.source === 'WATCH')
  const lastReceived = [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]

  // Estado general (texto + icono + color: nunca solo color)
  const hero = page.totalElements === 0
    ? { color: 'rgb(var(--c-state-info))', icon: 'info' as IconName, title: s.heroEmpty, text: s.heroEmptyText }
    : failed > 0
      ? { color: 'rgb(var(--c-state-alert))', icon: 'alert' as IconName, title: s.heroFail, text: s.heroFailText }
      : { color: 'rgb(var(--c-state-normal))', icon: 'check' as IconName, title: s.heroOk, text: s.heroOkText }

  const breakdown: { status: RecordStatus; label: string; color: string; n: number }[] = [
    { status: 'SYNCED', label: s.sSynced, color: 'rgb(var(--c-state-normal))', n: count('SYNCED') },
    { status: 'PENDING', label: s.sPending, color: 'rgb(var(--c-state-info))', n: count('PENDING') },
    { status: 'DUPLICATE', label: s.sDuplicate, color: 'rgb(var(--c-state-attention))', n: duplicates },
    { status: 'FAILED', label: s.sFailed, color: 'rgb(var(--c-state-alert))', n: failed },
  ]
  const total = Math.max(1, records.length)

  const steps: { icon: IconName; title: string; text: string }[] = [
    { icon: 'clock', title: s.stepWatch, text: s.stepWatchText },
    { icon: 'refresh', title: s.stepSend, text: s.stepSendText },
    { icon: 'shield', title: s.stepServer, text: s.stepServerText },
    { icon: 'home', title: s.stepWeb, text: s.stepWebText },
  ]

  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={s.title} sub={s.sub} icon="refresh"><RefreshButton /></PageHeader>

    {/* Estado general */}
    <section className="card" aria-label={s.title}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-white" style={{ background: hero.color }}>
          <Icon name={hero.icon} size={32} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-semibold text-text sm:text-2xl">{hero.title}</h2>
          <p className="mt-1 text-text-secondary">{hero.text}</p>
        </div>
        <div className="rounded-xl bg-surface px-4 py-3 sm:text-right">
          <p className="text-xs font-bold text-text-secondary">{s.lastSync}</p>
          <p className="font-display text-lg font-semibold text-text">{lastReceived ? fmt(lastReceived.createdAt) : s.noneYet}</p>
        </div>
      </div>
    </section>

    {/* Cifras */}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={s.onServer}>
      <Kpi icon="home" label={s.onServer} value={String(page.totalElements)} />
      <Kpi icon="clock" label={s.kpiWatch} value={String(watch.length)} />
      <Kpi icon="alert" label={s.failed} value={String(failed)} />
      <Kpi icon="check" label={s.kpiDup} value={String(duplicates)} />
    </section>

    {/* Camino de los datos */}
    <section className="card" aria-labelledby="flow">
      <h2 id="flow" className="font-display text-xl font-semibold text-green-dark">{s.flowTitle}</h2>
      <p className="mb-5 text-sm text-text-secondary">{s.flowSub}</p>
      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
            <IconTile name={step.icon} size={44} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-text-secondary">{s.stepLabel(index + 1)}</p>
              <h3 className="font-display text-base font-semibold text-text">{step.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      {/* Estado de los registros: barra apilada + leyenda con cifras */}
      <section className="card" aria-labelledby="breakdown">
        <h2 id="breakdown" className="font-display text-xl font-semibold text-green-dark">{s.breakdownTitle}</h2>
        <p className="mb-5 text-sm text-text-secondary">{s.breakdownSub}</p>
        <div className="flex h-[22px] overflow-hidden rounded-xl border-[1.5px] border-ink bg-surface" aria-hidden="true">
          {breakdown.filter((b) => b.n > 0).map((b) => <div key={b.status} style={{ width: `${(b.n / total) * 100}%`, background: b.color }} />)}
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-3">
          {breakdown.map((b) => (
            <li key={b.status} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm font-bold text-text"><span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: b.color }} />{b.label}</span>
              <span className="font-display text-lg font-semibold tabular-nums text-text">{b.n}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Actividad reciente */}
      <section className="card" aria-labelledby="recent-sync">
      <h2 id="recent-sync" className="font-display text-xl font-semibold text-green-dark">{s.recentTitle}</h2>
      <p className="mb-4 text-sm text-text-secondary">{s.recentSub}</p>
      {records.length === 0 ? <p className="rounded-xl bg-surface p-6 text-center text-sm text-text-secondary">{t.records.empty}</p> : (
        <ul className="divide-y divide-line">
          {[...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8).map((record) => (
            <li key={record.id} className="flex flex-wrap items-center gap-3 py-3">
              <IconTile name={HABIT_ICON[record.habitType]} color={HABIT_TYPE_INFO[record.habitType].color} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-text">{t.habits[record.habitType]}</p>
                <p className="text-xs text-text-secondary">{s.received} {fmt(record.createdAt)} · {record.source === 'WATCH' ? s.fromWatch : s.fromWeb}</p>
              </div>
              <RecordStatusBadge status={record.status} />
            </li>
          ))}
        </ul>
      )}
      </section>
    </div>
  </div>
}

import type { Metadata } from 'next'
import { getAuthenticated } from '@/lib/api/server'
import { getServerPrefs } from '@/lib/i18n/server'
import type { HabitRecord, HabitType, PaginatedResponse, Rabbit } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { HABIT_ICON, Icon, IconTile, type IconName } from '@/components/atoms/Icon'
import { Logo } from '@/components/atoms/Logo'
import { PageHeader } from '@/components/organisms/PageHeader'
import { RenameRabbitForm } from '@/components/organisms/RenameRabbitForm'
import { CreateRabbitForm } from '@/components/organisms/CreateRabbitForm'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: t.profile.title }
}

const TYPES: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']

interface User { id: string; email: string; displayName: string }

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string }) {
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

export default async function ProfilePage() {
  const { t, locale } = await getServerPrefs()
  const p = t.profile
  const [user, rabbits, page] = await Promise.all([
    getAuthenticated<User>('auth/me').catch(() => null),
    getAuthenticated<Rabbit[]>('rabbits'),
    getAuthenticated<PaginatedResponse<HabitRecord>>('habits?page=0&size=100&sort=recordedAt,desc').catch(() => ({ content: [] as HabitRecord[] })),
  ])
  const records = page.content
  const fmt = (value: string) => new Date(value).toLocaleString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const lastOf = (list: HabitRecord[]) => [...list].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0]

  const watch = records.filter((r) => r.source === 'WATCH')
  const web = records.filter((r) => r.source !== 'WATCH')
  const perType = TYPES.map((type) => ({ type, count: records.filter((r) => r.habitType === type).length }))
  const maxType = Math.max(1, ...perType.map((x) => x.count))
  const varsTracked = perType.filter((x) => x.count > 0).length

  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={p.title} sub={p.sub} icon="user" />

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-6">
      {/* Cuenta */}
      <section className="card flex flex-col items-center gap-4 text-center" aria-labelledby="account">
        <span aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full border-[1.5px] border-ink bg-green font-display text-4xl font-semibold text-white">
          {user ? initials(user.displayName) : <Icon name="user" size={44} />}
        </span>
        <div className="min-w-0 max-w-full">
          <h2 id="account" className="truncate font-display text-2xl font-semibold text-green-dark">{user?.displayName ?? p.account}</h2>
          <p className="mt-1 truncate text-sm text-text-secondary">{user?.email}</p>
        </div>
        <span className="badge bg-green-light text-green-dark"><Icon name="check" size={14} />{p.accountActive}</span>
        <p className="text-xs text-text-secondary">{p.accountSub}</p>
      </section>

      {/* Conejos */}
      <section className="card space-y-4" aria-labelledby="rabbits">
        <div>
          <h2 id="rabbits" className="font-display text-xl font-semibold text-green-dark">{p.rabbits}</h2>
          <p className="text-sm text-text-secondary">{p.rabbitsSub}</p>
        </div>
        {rabbits.length === 0 ? <p className="rounded-xl bg-surface p-4 text-sm text-text-secondary">{p.none}</p> : (
          <ul className="space-y-3">
            {rabbits.map((rabbit, index) => {
              const own = records.filter((r) => r.rabbitId === rabbit.id)
              const last = lastOf(own)
              return (
                <li key={rabbit.id} className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center">
                  <Logo size={56} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-display text-lg font-semibold text-text">{rabbit.name}</h3>
                      {index === 0 && <span className="badge bg-green text-white">{p.activeBadge}</span>}
                    </div>
                    <p className="mt-1 text-sm text-text-secondary">
                      {p.since} {new Date(rabbit.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })} · {p.recordsCount(own.length)}
                    </p>
                    <p className="text-sm text-text-secondary">{p.lastRecord}: {last ? fmt(last.recordedAt) : p.noRecords}</p>
                  </div>
                  <div className="sm:flex-shrink-0"><RenameRabbitForm id={rabbit.id} name={rabbit.name} /></div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>

    {/* Resumen */}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={p.statsTitle}>
      <Stat icon="list" label={p.statTotal} value={String(records.length)} />
      <Stat icon="behavior" label={p.statVars} value={`${varsTracked}/5`} />
      <Stat icon="refresh" label={p.statWatch} value={String(watch.length)} />
      <Stat icon="home" label={p.statWeb} value={String(web.length)} />
    </section>

    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      {/* Origen de los datos */}
      <section className="card" aria-labelledby="origin">
        <h2 id="origin" className="font-display text-xl font-semibold text-green-dark">{p.originTitle}</h2>
        <p className="mb-4 text-sm text-text-secondary">{p.originSub}</p>
        <ul className="space-y-3">
          <li className="flex items-start gap-4 rounded-xl border border-line bg-surface p-4">
            <IconTile name="clock" size={44} />
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-text">{p.watchTitle}</h3>
              <p className="mt-1 text-sm text-text-secondary">{p.watchText}</p>
              <p className="mt-2 text-xs font-bold text-text-secondary">{p.lastWatch}: {lastOf(watch) ? fmt(lastOf(watch)!.recordedAt) : p.noneYet}</p>
            </div>
          </li>
          <li className="flex items-start gap-4 rounded-xl border border-line bg-surface p-4">
            <IconTile name="home" size={44} />
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-text">{p.webTitle}</h3>
              <p className="mt-1 text-sm text-text-secondary">{p.webText}</p>
              <p className="mt-2 text-xs font-bold text-text-secondary">{p.lastWeb}: {lastOf(web) ? fmt(lastOf(web)!.recordedAt) : p.noneYet}</p>
            </div>
          </li>
        </ul>
      </section>

      {/* Variables */}
      <section className="card" aria-labelledby="vars">
        <h2 id="vars" className="font-display text-xl font-semibold text-green-dark">{p.varsTitle}</h2>
        <p className="mb-4 text-sm text-text-secondary">{p.varsSub}</p>
        <ul className="space-y-4">
          {perType.map(({ type, count }) => (
            <li key={type} className="flex items-center gap-3">
              <IconTile name={HABIT_ICON[type]} color={HABIT_TYPE_INFO[type].color} size={36} />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-bold text-text">{t.habits[type]}</span>
                  <span className="font-bold tabular-nums text-text-secondary">{count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface" aria-hidden="true">
                  <div className="h-full rounded-full" style={{ width: `${(count / maxType) * 100}%`, background: HABIT_TYPE_INFO[type].color }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>

    {/* Agregar otro conejo */}
    {rabbits.length > 0 && <CreateRabbitForm title={p.addRabbit} text={p.addRabbitText} />}

    {/* Acerca de */}
    <section className="card flex items-start gap-4">
      <IconTile name="info" color="#1B7FB5" size={44} />
      <div>
        <h2 className="font-display text-lg font-semibold text-green-dark">{p.about}</h2>
        <p className="mt-1 max-w-3xl text-sm text-text-secondary">{p.aboutText}</p>
      </div>
    </section>
  </div>
}

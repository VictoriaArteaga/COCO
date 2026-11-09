import type { Metadata } from 'next'
import { getAuthenticated } from '@/lib/api/server'
import { getServerPrefs } from '@/lib/i18n/server'
import type { HabitRecord, HabitType, PaginatedResponse, Rabbit } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { HABIT_ICON, IconTile } from '@/components/atoms/Icon'
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

/** Perfil: tus conejos (con su historial), tu cuenta, un resumen y de dónde vienen las anotaciones. */
export default async function ProfilePage() {
  const { t, locale } = await getServerPrefs()
  const p = t.profile
  const [user, rabbits, page] = await Promise.all([
    getAuthenticated<User>('auth/me').catch(() => null),
    getAuthenticated<Rabbit[]>('rabbits'),
    getAuthenticated<PaginatedResponse<HabitRecord>>('habits?page=0&size=100&sort=recordedAt,desc').catch(() => ({ content: [] as HabitRecord[] })),
  ])
  const records = page.content
  const fmt = (value: string) => new Date(value).toLocaleString(locale, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
  const lastOf = (list: HabitRecord[]) => [...list].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0]

  const watch = records.filter((r) => r.source === 'WATCH')
  const web = records.filter((r) => r.source !== 'WATCH')
  const perType = TYPES.map((type) => ({ type, count: records.filter((r) => r.habitType === type).length }))
  const varsTracked = perType.filter((x) => x.count > 0).length

  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={p.title} sub={p.sub} icon="user" />

    <div className="flex flex-wrap items-start gap-6">
      {/* Columna izquierda: conejos y variables */}
      <div className="flex min-w-0 flex-[1.5_1_30rem] flex-col gap-5">
        <div>
          <h2 className="font-display text-xl font-semibold text-green-dark">{p.rabbits}</h2>
          <p className="text-sm text-text-secondary">{p.rabbitsSub}</p>
        </div>

        {rabbits.length === 0 ? <p className="card text-sm text-text-secondary">{p.none}</p> : rabbits.map((rabbit, index) => {
          const own = records.filter((r) => r.rabbitId === rabbit.id)
          const last = lastOf(own)
          return (
            <section key={rabbit.id} className="card" aria-label={rabbit.name}>
              <div className="flex flex-wrap items-center gap-4">
                <Logo size={60} />
                <div className="min-w-0 flex-[1_1_14rem]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="truncate font-display text-2xl font-semibold text-green-dark">{rabbit.name}</h3>
                    {index === 0 && <span className="badge h-7 rounded-full border-0 bg-[#E3F1E8] px-2.5 text-[13px] font-bold text-[#1F5C38]">{p.activeBadge}</span>}
                  </div>
                  <p className="mt-1 text-[15px] text-text-secondary">
                    {p.since} {new Date(rabbit.createdAt).toLocaleDateString(locale, { month: 'short', year: 'numeric' })} · {p.recordsCount(own.length)}
                  </p>
                  <p className="text-[15px] text-text-secondary">{p.lastRecord}: {last ? fmt(last.recordedAt) : p.noRecords}</p>
                </div>
                <RenameRabbitForm id={rabbit.id} name={rabbit.name} />
              </div>
            </section>
          )
        })}

        {/* Agregar otro conejo */}
        {rabbits.length > 0 && <CreateRabbitForm dashed title={p.addRabbit} text={p.addRabbitText} button={p.addButton} />}

        <section className="card" aria-labelledby="vars">
          <h2 id="vars" className="font-display text-xl font-semibold text-green-dark">{p.varsTitle}</h2>
          <p className="text-sm text-text-secondary">{p.varsSub}</p>
          <ul className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-3">
            {perType.map(({ type, count }) => (
              <li key={type} className="flex items-center gap-2.5 rounded-[14px] border border-line bg-surface p-3">
                <IconTile name={HABIT_ICON[type]} color={HABIT_TYPE_INFO[type].color} size={36} />
                <div>
                  <p className="text-sm font-extrabold text-text">{t.habits[type]}</p>
                  <p className="text-sm text-text-secondary">{p.recordsCount(count)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Columna derecha: cuenta, resumen y origen */}
      <div className="flex min-w-0 flex-[1_1_20rem] flex-col gap-5">
        <section className="card" aria-labelledby="account">
          <h2 id="account" className="font-display text-xl font-semibold text-green-dark">{p.account}</h2>
          <p className="text-sm text-text-secondary">{p.accountSub}</p>
          <dl className="mt-4 flex flex-col gap-3.5">
            <div><dt className="text-[13px] font-bold text-text-secondary">{p.accountName}</dt><dd className="mt-0.5 break-words text-[17px] font-bold">{user?.displayName ?? '—'}</dd></div>
            <div><dt className="text-[13px] font-bold text-text-secondary">{p.accountEmail}</dt><dd className="mt-0.5 break-all text-[17px] font-bold">{user?.email ?? '—'}</dd></div>
          </dl>
          <span className="badge mt-3.5 h-7 rounded-full border-0 bg-[#E3F1E8] px-2.5 text-[13px] font-bold text-[#1F5C38]">{p.accountActive}</span>
        </section>

        <section className="card" aria-labelledby="stats">
          <h2 id="stats" className="font-display text-xl font-semibold text-green-dark">{p.statsTitle}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {([[p.statTotal, records.length], [p.statVars, varsTracked], [p.statWatch, watch.length], [p.statWeb, web.length]] as const).map(([label, value]) => (
              <div key={label} className="rounded-[14px] border border-line bg-surface p-3.5">
                <dd className="font-display text-[28px] font-semibold leading-none text-green-dark">{value}</dd>
                <dt className="mt-1 text-sm font-bold text-text-secondary">{label}</dt>
              </div>
            ))}
          </dl>
        </section>

        <section className="card" aria-labelledby="origin">
          <h2 id="origin" className="font-display text-xl font-semibold text-green-dark">{p.originTitle}</h2>
          <p className="text-sm text-text-secondary">{p.originSub}</p>
          <ul className="mt-4 flex flex-col gap-3.5">
            <li className="flex gap-3">
              <IconTile name="watch" size={42} color="#7D4D31" />
              <div className="min-w-0">
                <h3 className="font-extrabold">{p.watchTitle}</h3>
                <p className="text-sm leading-snug text-text-secondary">{p.watchText}</p>
                <p className="mt-1 text-sm font-bold">{p.lastWatch}: {lastOf(watch) ? fmt(lastOf(watch)!.recordedAt) : p.noneYet}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <IconTile name="globe" size={42} color="#3B6EA5" />
              <div className="min-w-0">
                <h3 className="font-extrabold">{p.webTitle}</h3>
                <p className="text-sm leading-snug text-text-secondary">{p.webText}</p>
                <p className="mt-1 text-sm font-bold">{p.lastWeb}: {lastOf(web) ? fmt(lastOf(web)!.recordedAt) : p.noneYet}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
}

import type { Metadata } from 'next'
import { getAuthenticated } from '@/lib/api/server'
import { getServerPrefs } from '@/lib/i18n/server'
import type { Rabbit } from '@/types'
import { IconTile } from '@/components/atoms/Icon'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: t.profile.title }
}

export default async function ProfilePage() {
  const { t } = await getServerPrefs()
  const rabbit = (await getAuthenticated<Rabbit[]>('rabbits'))[0] ?? { name: t.profile.none }
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">{t.profile.title}</h1><p className="mt-1 text-text-secondary">{t.profile.sub}</p></div>
    <section className="card grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center"><div className="float-slow"><IconTile name="rabbit" size={80} /></div><div><p className="text-sm text-text-secondary">{t.profile.active}</p><h2 className="text-xl font-semibold">{rabbit.name}</h2><p className="mt-1 text-sm text-text-secondary">{t.profile.demo}</p></div></section>
    <section className="card"><h2 className="font-semibold">{t.profile.about}</h2><p className="mt-2 max-w-2xl text-sm text-text-secondary">{t.profile.aboutText}</p></section>
  </div>
}

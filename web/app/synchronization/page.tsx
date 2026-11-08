import type { Metadata } from 'next'
import { getAuthenticated } from '@/lib/api/server'
import { getServerPrefs } from '@/lib/i18n/server'
import type { HabitRecord, PaginatedResponse } from '@/types'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: t.sync.title }
}

export default async function SynchronizationPage() {
  const { t } = await getServerPrefs()
  const page = await getAuthenticated<PaginatedResponse<HabitRecord>>('habits?page=0&size=100&sort=recordedAt,desc')
  const records = page.content
  const failed = records.filter((record) => record.status === 'FAILED')
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">{t.sync.title}</h1><p className="mt-1 text-text-secondary">{t.sync.sub}</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><section className="card"><p className="text-sm text-text-secondary">{t.sync.api}</p><p className="mt-2 text-lg font-semibold text-green-dark">{t.sync.connected}</p></section><section className="card"><p className="text-sm text-text-secondary">{t.sync.onServer}</p><p className="mt-2 text-2xl font-semibold">{page.totalElements}</p></section><section className="card"><p className="text-sm text-text-secondary">{t.sync.failed}</p><p className="mt-2 text-2xl font-semibold">{failed.length}</p></section></div>
    <section className="card"><h2 className="font-semibold">{t.sync.queue}</h2><p className="mt-2 text-sm text-text-secondary">{t.sync.queueText}</p></section>
  </div>
}

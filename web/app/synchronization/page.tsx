import type { Metadata } from 'next'
import { getAuthenticated } from '@/lib/api/server'
import type { HabitRecord, PaginatedResponse } from '@/types'

export const metadata: Metadata = { title: 'Sincronización' }

export default async function SynchronizationPage() {
  const page = await getAuthenticated<PaginatedResponse<HabitRecord>>('habits?page=0&size=100&sort=recordedAt,desc')
  const records = page.content
  const failed = records.filter((record) => record.status === 'FAILED')
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">Sincronización</h1><p className="mt-1 text-text-secondary">Estado de los registros que llegaron al servidor.</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><section className="card"><p className="text-sm text-text-secondary">API</p><p className="mt-2 text-lg font-semibold text-green">Conectada</p></section><section className="card"><p className="text-sm text-text-secondary">Registros en servidor</p><p className="mt-2 text-2xl font-semibold">{page.totalElements}</p></section><section className="card"><p className="text-sm text-text-secondary">Fallidos reportados</p><p className="mt-2 text-2xl font-semibold">{failed.length}</p></section></div>
    <section className="card"><h2 className="font-semibold">Cola local del reloj</h2><p className="mt-2 text-sm text-text-secondary">Los registros pendientes permanecen en Room y se reintentan desde Wear OS. El servidor no puede consultar la cola local del dispositivo.</p></section>
  </div>
}

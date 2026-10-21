import type { Metadata } from 'next'
import { habitRepository } from '@/services/repositories'

export const metadata: Metadata = { title: 'Sincronización' }

export default async function SynchronizationPage() {
  const records = await habitRepository.listRecords()
  const pending = records.filter((record) => record.status === 'PENDING')
  const synced = records.length - pending.length
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">Sincronización</h1><p className="mt-1 text-text-secondary">Estado de los registros del reloj en esta demostración.</p></div>
    <div className="grid gap-4 sm:grid-cols-3"><section className="card"><p className="text-sm text-text-secondary">Estado</p><p className="mt-2 text-lg font-semibold text-green">Conectado · datos demo</p></section><section className="card"><p className="text-sm text-text-secondary">Sincronizados</p><p className="mt-2 text-2xl font-semibold">{synced}</p></section><section className="card"><p className="text-sm text-text-secondary">Pendientes</p><p className="mt-2 text-2xl font-semibold">{pending.length}</p></section></div>
    <section className="card"><h2 className="font-semibold">Registros pendientes</h2>{pending.length ? <ul className="mt-3 divide-y divide-green-light">{pending.map((record) => <li key={record.id} className="flex items-center justify-between py-3 text-sm"><span>{record.note || record.habitType} · {new Date(record.recordedAt).toLocaleString('es-CO')}</span><span className="badge bg-amber-50 text-amber-800">Pendiente</span></li>)}</ul> : <p className="mt-2 text-sm text-text-secondary">No hay registros pendientes.</p>}<p className="mt-4 text-xs text-text-secondary">Los estados son ilustrativos. La sincronización real se realiza desde el servicio del smartwatch cuando el backend está disponible.</p></section>
  </div>
}

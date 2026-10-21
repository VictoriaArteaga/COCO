import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Recordatorios' }

export default function RemindersPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text mb-2">Recordatorios</h1>
      <p className="text-text-secondary mb-6">
        Configura alertas para el cuidado de Coquito.
      </p>
      <div className="card min-h-[200px] flex items-center justify-center">
        <p className="text-text-secondary text-sm">
          El sistema de recordatorios se implementará en la semana 6.
        </p>
      </div>
    </div>
  )
}

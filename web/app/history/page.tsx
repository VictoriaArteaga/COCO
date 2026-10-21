import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Historial' }

export default function HistoryPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text mb-2">Historial</h1>
      <p className="text-text-secondary mb-6">
        Consulta los registros anteriores de Coquito.
      </p>
      <div className="card min-h-[300px] flex items-center justify-center">
        <p className="text-text-secondary text-sm">
          La tabla de historial con filtros se implementará en la semana 5.
        </p>
      </div>
    </div>
  )
}

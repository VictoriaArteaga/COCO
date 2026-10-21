import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tendencias' }

export default function TrendsPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text mb-2">Tendencias</h1>
      <p className="text-text-secondary mb-6">
        Visualiza los patrones de comportamiento de Coquito a lo largo del tiempo.
      </p>
      <div className="card min-h-[300px] flex items-center justify-center">
        <p className="text-text-secondary text-sm">
          Las gráficas de tendencias (Recharts) se implementarán en la semana 5.
        </p>
      </div>
    </div>
  )
}

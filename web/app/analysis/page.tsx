import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Análisis' }

export default function AnalysisPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text mb-2">Análisis</h1>
      <p className="text-text-secondary mb-6">
        Resumen del comportamiento reciente de Coquito.
      </p>
      <div className="card">
        <p className="text-sm text-text-secondary">
          COCO identifica patrones individuales. No diagnostica enfermedades ni
          reemplaza la valoración veterinaria.
        </p>
      </div>
      <div className="card min-h-[200px] flex items-center justify-center mt-4">
        <p className="text-text-secondary text-sm">
          El análisis explicable se implementará en la semana 6.
        </p>
      </div>
    </div>
  )
}

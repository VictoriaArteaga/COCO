import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Configuración' }

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text mb-2">Configuración</h1>
      <p className="text-text-secondary mb-6">
        Opciones de la aplicación.
      </p>
      <div className="card min-h-[200px] flex items-center justify-center">
        <p className="text-text-secondary text-sm">
          La configuración completa se implementará en las semanas siguientes.
        </p>
      </div>
    </div>
  )
}

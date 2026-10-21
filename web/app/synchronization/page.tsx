import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sincronización' }

export default function SynchronizationPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text mb-2">Sincronización</h1>
      <p className="text-text-secondary mb-6">
        Estado de sincronización entre el reloj y la plataforma web.
      </p>
      <div className="card space-y-3">
        <p className="text-sm text-text">
          Los registros del reloj se envían al backend y quedan disponibles en la
          plataforma web cuando hay conexión.
        </p>
        <p className="text-sm text-text-secondary">
          La vista detallada de estado de sincronización se implementará en la semana 5.
        </p>
      </div>
    </div>
  )
}

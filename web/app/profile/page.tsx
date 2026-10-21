import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Perfil' }

export default function ProfilePage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text mb-2">Perfil</h1>
      <p className="text-text-secondary mb-6">
        Información de tu cuenta y configuración de Coquito.
      </p>
      <div className="card min-h-[200px] flex items-center justify-center">
        <p className="text-text-secondary text-sm">
          La gestión del perfil se implementará en la semana 5.
        </p>
      </div>
    </div>
  )
}

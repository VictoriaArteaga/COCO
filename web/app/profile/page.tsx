import type { Metadata } from 'next'
import { getAuthenticated } from '@/lib/api/server'
import type { Rabbit } from '@/types'

export const metadata: Metadata = { title: 'Perfil' }

export default async function ProfilePage() {
  const rabbit = (await getAuthenticated<Rabbit[]>('rabbits'))[0] ?? { name: 'Sin conejo asociado' }
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">Perfil</h1><p className="mt-1 text-text-secondary">Información del compañero que estás observando.</p></div>
    <section className="card grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-light text-4xl" aria-hidden="true">🐇</div><div><p className="text-sm text-text-secondary">Conejo activo</p><h2 className="text-xl font-semibold">{rabbit.name}</h2><p className="mt-1 text-sm text-text-secondary">Perfil demo · Observaciones almacenadas localmente.</p></div></section>
    <section className="card"><h2 className="font-semibold">Acerca de COCO</h2><p className="mt-2 max-w-2xl text-sm text-text-secondary">Cuaderno de Observación y Cuidado Oportuno. Registra hábitos para reconocer cambios en la rutina. El perfil se administra localmente durante esta etapa de demostración.</p></section>
  </div>
}

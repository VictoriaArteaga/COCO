import { Sidebar } from '@/components/organisms/Sidebar'
import { getAuthenticated } from '@/lib/api/server'
import type { Rabbit } from '@/types'

/**
 * Marco de las rutas autenticadas: fondo crema plano, menú lateral con degradado café y
 * contenido sobre tarjetas blancas. Cada página trae su propio encabezado dentro del contenido.
 * El conejo activo (el primero de la cuenta) se muestra en el menú para saber siempre a quién se observa.
 */
export async function AppShell({ children }: { children: React.ReactNode }) {
  const rabbits = await getAuthenticated<Rabbit[]>('rabbits').catch(() => [] as Rabbit[])
  return (
    <div className="app-bg min-h-screen">
      <Sidebar rabbitName={rabbits[0]?.name ?? null} />
      <main id="main-content" className="relative z-10 min-w-0 md:ml-[5.5rem] xl:ml-64" tabIndex={-1}>
        <div className="mx-auto w-full max-w-[110rem]">{children}</div>
      </main>
    </div>
  )
}

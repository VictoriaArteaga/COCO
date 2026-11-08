import { Sidebar } from '@/components/organisms/Sidebar'

/**
 * Marco de las rutas autenticadas: fondo turquesa con patrón (como el inicio de sesión),
 * menú lateral y barra superior fijos, y contenido sobre tarjetas blancas que se desplaza.
 * El margen/relleno de <main> reserva el espacio del menú (izquierda) y de la barra (arriba).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-bg min-h-screen">
      <Sidebar />
      <main id="main-content" className="relative z-10 min-w-0 pt-[4.5rem] md:ml-[5.5rem] md:pt-20 xl:ml-64" tabIndex={-1}>
        <div className="mx-auto w-full max-w-[110rem] animate-none [&>*>header:first-child+*]:!mt-0">{children}</div>
      </main>
    </div>
  )
}

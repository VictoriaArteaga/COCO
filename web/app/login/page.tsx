import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Iniciar sesión' }

/**
 * Login page — placeholder for week 5 authentication implementation.
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="card w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-dark">COCO</h1>
          <p className="text-text-secondary text-sm mt-1">
            Observa. Registra. Cuida.
          </p>
        </div>

        {/* Placeholder notice */}
        <p className="text-center text-sm text-text-secondary bg-green-light rounded-coco px-4 py-3">
          La autenticación se implementará en la semana 5.
        </p>

        <Link
          href="/dashboard"
          className="btn-primary w-full text-center"
        >
          Acceder al panel (demo)
        </Link>
      </div>
    </main>
  )
}

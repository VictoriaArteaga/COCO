'use client'

import Link from 'next/link'
import { Logo } from '@/components/atoms/Logo'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'

/**
 * Pantalla de error de cualquier página: un mensaje claro y dos salidas (intentar de nuevo o ir al inicio).
 * No muestra el detalle técnico del error, solo lo que la persona necesita saber.
 */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = usePrefs()
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3E7D8] px-4 py-10">
      <section role="alert" className="card flex w-full max-w-md flex-col items-center gap-4 text-center">
        <Logo size={64} />
        <h1 className="font-display text-3xl font-semibold text-green-dark">{t.errors.title}</h1>
        <p className="text-base leading-relaxed text-text-secondary">{t.errors.text}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-accent font-display">{t.errors.retry}</button>
          <Link href="/" className="btn-secondary font-display">{t.errors.home}</Link>
        </div>
      </section>
    </main>
  )
}

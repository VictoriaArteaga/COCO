import Link from 'next/link'
import { Logo } from '@/components/atoms/Logo'
import { getServerPrefs } from '@/lib/i18n/server'

/** Página que no existe: explica qué pasó sin códigos y lleva de vuelta al inicio. */
export default async function NotFound() {
  const { t } = await getServerPrefs()
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3E7D8] px-4 py-10">
      <section className="card flex w-full max-w-md flex-col items-center gap-4 text-center">
        <Logo size={64} />
        <h1 className="font-display text-3xl font-semibold text-green-dark">{t.errors.notFoundTitle}</h1>
        <p className="text-base leading-relaxed text-text-secondary">{t.errors.notFoundText}</p>
        <Link href="/" className="btn-accent mt-2 font-display">{t.errors.home}</Link>
      </section>
    </main>
  )
}

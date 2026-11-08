import type { Metadata } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import './globals.css'
import { PreferencesProvider } from '@/lib/i18n/PreferencesProvider'
import { getServerPrefs } from '@/lib/i18n/server'

// Nunito: texto redondeado y legible; Fredoka: titulares amables y juguetones, acordes a una app de cuidado de conejos.
const sans = Nunito({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Fredoka({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'COCO — Observa. Registra. Cuida.',
    template: '%s | COCO',
  },
  description:
    'Cuaderno de Observación y Cuidado Oportuno. Sistema de monitoreo preventivo del bienestar de conejos domésticos.',
}

/**
 * Root layout — wraps all pages in the app.
 * El idioma y el tema vienen de cookies: claro y español si el visitante no ha elegido otra cosa.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { lang, theme } = await getServerPrefs()
  return (
    <html lang={lang} data-theme={theme} className={`${sans.variable} ${display.variable}`}>
      <body>
        <PreferencesProvider initialLang={lang} initialTheme={theme}>
          {children}
        </PreferencesProvider>
      </body>
    </html>
  )
}

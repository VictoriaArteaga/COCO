import type { Metadata } from 'next'
import './globals.css'

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
 * Authenticated pages render inside the DashboardLayout (in layout.tsx of each route group).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

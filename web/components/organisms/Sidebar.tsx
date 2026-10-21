'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface NavItem {
  href: string
  label: string
  /** Unicode emoji used as icon — always paired with an aria-hidden attribute */
  icon: string
  ariaLabel: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',       label: 'Inicio',         icon: '🏠', ariaLabel: 'Inicio' },
  { href: '/history',         label: 'Historial',      icon: '📋', ariaLabel: 'Historial' },
  { href: '/trends',          label: 'Tendencias',     icon: '📈', ariaLabel: 'Tendencias' },
  { href: '/analysis',        label: 'Análisis',       icon: '🔍', ariaLabel: 'Análisis' },
  { href: '/profile',         label: 'Perfil',         icon: '👤', ariaLabel: 'Perfil' },
  { href: '/reminders',       label: 'Recordatorios',  icon: '🔔', ariaLabel: 'Recordatorios' },
  { href: '/synchronization', label: 'Sincronización', icon: '🔄', ariaLabel: 'Sincronización' },
  { href: '/settings',        label: 'Configuración',  icon: '⚙️', ariaLabel: 'Configuración' },
]

/**
 * Organism: persistent lateral navigation sidebar.
 *
 * Accessibility:
 *   - <nav> landmark with aria-label
 *   - Current page indicated via aria-current="page"
 *   - Focus ring visible on all interactive elements
 *   - Skip-to-main link available in layout
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegación principal"
      className="
        flex flex-col w-60 flex-shrink-0
        bg-white border-r border-green-light
        h-full py-6 px-3
      "
    >
      {/* Brand */}
      <div className="px-3 mb-8">
        <span className="text-2xl font-bold text-green-dark block leading-none">COCO</span>
        <span className="text-xs text-text-secondary mt-0.5 block">Observa. Registra. Cuida.</span>
      </div>

      {/* Navigation links */}
      <ul className="flex flex-col gap-1 flex-1" role="list">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-coco px-3 py-2.5 text-sm font-medium transition-colors',
                  'hover:bg-green-light hover:text-green-dark',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
                  isActive
                    ? 'bg-green-light text-green-dark'
                    : 'text-text-secondary',
                )}
              >
                <span aria-hidden="true" className="text-base w-5 text-center flex-shrink-0">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Footer */}
      <div className="px-3 pt-4 border-t border-green-light">
        <p className="text-xs text-text-secondary text-center">
          COCO no diagnostica enfermedades.
        </p>
      </div>
    </nav>
  )
}

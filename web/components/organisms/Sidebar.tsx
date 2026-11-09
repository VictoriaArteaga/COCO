'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { cn } from '@/lib/utils/cn'
import { Icon, IconTile, TILE, type IconName } from '@/components/atoms/Icon'
import { Logo } from '@/components/atoms/Logo'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface NavItem {
  href: string
  key: keyof Dictionary['nav']
  icon: IconName
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',       key: 'home',     icon: 'home' },
  { href: '/history',         key: 'history',  icon: 'list' },
  { href: '/trends',          key: 'trends',   icon: 'trending' },
  { href: '/analysis',        key: 'analysis', icon: 'search' },
  { href: '/profile',         key: 'profile',  icon: 'user' },
  { href: '/reminders',       key: 'reminders', icon: 'bell' },
  { href: '/synchronization', key: 'sync',     icon: 'refresh' },
  { href: '/settings',        key: 'settings', icon: 'settings' },
]

/**
 * Organism: navegación lateral.
 * - Móvil: barra superior con menú desplegable (hamburguesa).
 * - Tablet (md): riel flotante solo con iconos.
 * - Escritorio (xl): panel flotante con iconos y etiquetas.
 * Accesibilidad: <nav> con aria-label, aria-current en la página activa, aria-expanded en el menú.
 */
export function Sidebar() {
  const pathname = usePathname()
  const { t } = usePrefs()
  const [open, setOpen] = useState(false)

  // Cierra el menú móvil al navegar.
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <nav
      aria-label={t.nav.label}
      className="shell-surface sticky top-0 z-40 flex flex-shrink-0 flex-col border-b md:fixed md:inset-y-0 md:left-0 md:h-screen md:w-[5.5rem] md:border-b-0 md:border-r md:shadow-none xl:w-64"
    >
      {/* Marca + botón de menú (móvil) */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:mb-2 md:justify-center md:px-3 md:pt-6 xl:justify-start xl:px-5">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <div className="md:hidden xl:block">
            <span className="block font-display text-2xl font-semibold leading-none text-white">COCO</span>
            <span className="mt-1 block text-xs text-white/75">{t.brand.tagline}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="sidebar-menu"
          aria-label={t.nav.label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white md:hidden"
        >
          <Icon name={open ? 'close' : 'list'} size={20} />
        </button>
      </div>

      <div id="sidebar-menu" className={cn('max-h-[calc(100vh-5rem)] flex-1 flex-col overflow-y-auto px-3 pb-4 md:max-h-none md:flex md:pb-5', open ? 'flex' : 'hidden')}>
        <ul className="flex flex-col gap-1.5 md:flex-1" role="list">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={t.nav[item.key]}
                  aria-label={t.nav[item.key]}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative flex min-h-[48px] items-center gap-3 rounded-2xl px-3 py-2 text-[15px] font-bold md:justify-center xl:justify-start',
                    'transition-[background-color,color,transform] duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                    isActive
                      ? 'bg-white text-[#5A3825] shadow-[inset_4px_0_0_#FFC83D]'
                      : 'text-white/90 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <IconTile name={item.icon} size={34} color={isActive ? TILE.yellow : 'rgb(255 255 255 / 0.16)'} fg={isActive ? TILE.dark : '#FFF4E8'} border={isActive ? 'ink' : 'light'} />
                  <span className="md:hidden xl:inline">{t.nav[item.key]}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 border-t border-white/15 pt-3">
          <LogoutButton />
          <p className="mt-3 text-center text-xs text-white/70 md:hidden xl:block">{t.brand.short}</p>
        </div>
      </div>
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { cn } from '@/lib/utils/cn'
import { IconTile, TILE, type IconName } from '@/components/atoms/Icon'
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
  const { t } = usePrefs()

  return (
    <nav
      aria-label={t.nav.label}
      className="
        flex flex-col w-full md:w-60 flex-shrink-0
        bg-card border-r border-line
        md:h-full py-4 md:py-6 px-3
      "
    >
      {/* Brand */}
      <div className="px-3 mb-8 flex items-center gap-3">
        <IconTile name="rabbit" size={40} />
        <div>
          <span className="text-2xl font-bold text-green-dark block leading-none">COCO</span>
          <span className="text-xs text-text-secondary mt-1 block">{t.brand.tagline}</span>
        </div>
      </div>

      {/* Navigation links */}
      <ul className="flex flex-row flex-wrap gap-1 md:flex-col md:flex-nowrap md:flex-1" role="list">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={t.nav[item.key]}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-coco border px-2 py-1.5 text-sm font-medium',
                  'transition-[background-color,border-color,transform] duration-200',
                  'hover:translate-x-0.5 hover:bg-green-light/60 hover:text-green-dark',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
                  isActive
                    ? 'border-ink bg-green-light text-green-dark'
                    : 'border-transparent text-text-secondary',
                )}
              >
                <IconTile
                  name={item.icon}
                  size={32}
                  color={isActive ? TILE.teal : TILE.muted}
                  border={isActive ? 'ink' : 'gray'}
                />
                <span>{t.nav[item.key]}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Footer */}
      <div className="px-3 pt-4 border-t border-line">
        <p className="text-xs text-text-secondary text-center">
          {t.brand.short}
        </p>
      </div>
      <div className="mt-auto pt-4"><LogoutButton /></div>
    </nav>
  )
}

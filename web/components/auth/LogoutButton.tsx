'use client'

import { useRouter } from 'next/navigation'
import { IconTile, TILE } from '@/components/atoms/Icon'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'

export function LogoutButton() {
  const router = useRouter()
  const { t } = usePrefs()
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }
  return (
    <button
      onClick={logout}
      title={t.nav.logout}
      aria-label={t.nav.logout}
      className="group flex min-h-[48px] w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-[15px] font-bold text-white/90 transition-[background-color,color] duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:justify-center xl:justify-start"
    >
      <IconTile name="logout" size={34} color="rgb(255 255 255 / 0.16)" border="light" />
      <span className="md:hidden xl:inline">{t.nav.logout}</span>
    </button>
  )
}

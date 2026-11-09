'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '@/components/atoms/Icon'
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
      className="group flex min-h-[46px] w-full items-center gap-3 rounded-xl border-[1.5px] border-white/40 px-3 py-2 text-left text-[15px] font-bold text-white transition-[background-color] duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:justify-center xl:justify-start"
    >
      <Icon name="logout" size={20} />
      <span className="md:hidden xl:inline">{t.nav.logout}</span>
    </button>
  )
}

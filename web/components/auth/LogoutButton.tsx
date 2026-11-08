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
      className="group flex w-full items-center gap-3 rounded-coco border border-transparent px-2 py-1.5 text-left text-sm font-medium text-text-secondary transition-[background-color,border-color,transform] duration-200 hover:translate-x-0.5 hover:border-ink hover:bg-green-light/60"
    >
      <IconTile name="logout" size={32} color={TILE.muted} border="gray" />
      {t.nav.logout}
    </button>
  )
}

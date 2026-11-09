'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '@/components/atoms/Icon'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'

/** Vuelve a pedir al servidor el estado de la sincronización sin recargar toda la página. */
export function RefreshButton() {
  const router = useRouter()
  const { t } = usePrefs()
  return (
    <button type="button" onClick={() => router.refresh()} className="btn-secondary">
      <Icon name="refresh" size={18} />{t.sync.refresh}
    </button>
  )
}

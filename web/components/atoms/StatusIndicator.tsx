import type { SyncStatusType } from '@/types'
import { cn } from '@/lib/utils/cn'
import { getServerPrefs } from '@/lib/i18n/server'

const INDICATOR_STYLES: Record<SyncStatusType, string> = {
  idle:     'bg-state-normal',
  syncing:  'bg-state-info animate-pulse',
  synced:   'bg-state-normal pulse-ring',
  partial:  'bg-state-attention',
  failed:   'bg-state-alert',
  offline:  'bg-state-offline',
}

interface StatusIndicatorProps {
  status: SyncStatusType
  className?: string
}

/**
 * Small coloured dot indicating a status.
 * Never relies on colour alone — includes aria-label.
 */
export async function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const { t } = await getServerPrefs()
  return (
    <span
      role="img"
      aria-label={t.syncState[status]}
      className={cn('inline-block w-2.5 h-2.5 rounded-full flex-shrink-0', INDICATOR_STYLES[status], className)}
    />
  )
}

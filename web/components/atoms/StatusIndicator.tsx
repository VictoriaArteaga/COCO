import type { SyncStatusType } from '@/types'
import { cn } from '@/lib/utils/cn'

const INDICATOR_STYLES: Record<SyncStatusType, string> = {
  idle:     'bg-state-normal',
  syncing:  'bg-state-info animate-pulse',
  synced:   'bg-state-normal',
  partial:  'bg-state-attention',
  failed:   'bg-state-alert',
  offline:  'bg-state-offline',
}

const ARIA_LABELS: Record<SyncStatusType, string> = {
  idle:    'Sin cambios pendientes',
  syncing: 'Sincronizando',
  synced:  'Sincronizado',
  partial: 'Sincronización parcial',
  failed:  'Error de sincronización',
  offline: 'Sin conexión',
}

interface StatusIndicatorProps {
  status: SyncStatusType
  className?: string
}

/**
 * Small coloured dot indicating a status.
 * Never relies on colour alone — includes aria-label.
 */
export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <span
      role="img"
      aria-label={ARIA_LABELS[status]}
      className={cn('inline-block w-2.5 h-2.5 rounded-full flex-shrink-0', INDICATOR_STYLES[status], className)}
    />
  )
}

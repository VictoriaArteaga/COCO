import type { SyncStatusType } from '@/types'
import { StatusIndicator } from '@/components/atoms/StatusIndicator'
import { cn } from '@/lib/utils/cn'

const LABEL_STYLES: Record<SyncStatusType, string> = {
  idle:    'text-state-normal',
  syncing: 'text-state-info',
  synced:  'text-state-normal',
  partial: 'text-state-attention',
  failed:  'text-state-alert',
  offline: 'text-state-offline',
}

const DEFAULT_LABELS: Record<SyncStatusType, string> = {
  idle:    'Sin cambios pendientes',
  syncing: 'Sincronizando…',
  synced:  'Sincronizado',
  partial: 'Sincronización parcial',
  failed:  'No se pudo sincronizar',
  offline: 'Sin conexión',
}

interface SyncStatusProps {
  status: SyncStatusType
  label?: string
  className?: string
}

/**
 * Molecule: status indicator dot + descriptive text.
 * Accessible: text never depends on colour alone.
 */
export function SyncStatus({ status, label, className }: SyncStatusProps) {
  const displayLabel = label ?? DEFAULT_LABELS[status]

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex items-center gap-2', className)}
    >
      <StatusIndicator status={status} />
      <span className={cn('text-sm font-medium', LABEL_STYLES[status])}>
        {displayLabel}
      </span>
    </div>
  )
}

/**
 * Duración legible a partir de minutos: 45 → "45 min", 60 → "1h", 90 → "1h 30 min", 135 → "2h 15 min".
 * Pasada la hora se usa la nomenclatura en horas y minutos.
 */
export function formatDuration(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes))
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours}h` : `${hours}h ${rest} min`
}

/** Valor de un registro con su unidad. Las duraciones (unidad "min") pasan a horas cuando superan los 60 minutos. */
export function formatRecordValue(value: number, unit: string, unitLabel?: string): string {
  return unit === 'min' ? formatDuration(value) : `${value} ${unitLabel ?? unit}`
}

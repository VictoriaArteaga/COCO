import type { Dictionary } from '@/lib/i18n/dictionaries'

/**
 * Convierte el código de respuesta de la API en un mensaje que cualquier persona entienda.
 * Nunca se muestra el texto crudo que devuelve el servidor (puede traer términos técnicos).
 * `fallback` es el mensaje propio de cada acción ("No pudimos guardar a tu conejo…").
 */
export function friendlyError(status: number, t: Dictionary, fallback: string): string {
  if (status === 401) return t.errors.session
  if (status === 403) return t.errors.forbidden
  if (status === 404) return t.errors.notFound
  if (status === 429) return t.errors.tooMany
  if (status >= 500) return t.errors.unavailable
  return fallback
}

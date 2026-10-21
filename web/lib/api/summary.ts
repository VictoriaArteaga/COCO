import { apiClient } from './client'
import type { DailySummary } from '@/types'

/**
 * GET /api/summary/daily?rabbitId=&date=
 * Returns the daily summary for a rabbit.
 * If date is not provided, the backend defaults to today (UTC).
 */
export function getDailySummary(params?: {
  rabbitId?: string
  date?: string // YYYY-MM-DD
}): Promise<DailySummary> {
  return apiClient.get<DailySummary>('/api/summary/daily', params)
}

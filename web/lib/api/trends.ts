import { apiClient } from './client'
import type { HabitType, TrendPoint } from '@/types'

/**
 * GET /api/trends/{habitType}?rabbitId=&days=
 * Returns a list of data points ordered oldest → newest.
 * Designed to be consumed directly by Recharts LineChart / BarChart.
 */
export function getTrends(
  habitType: HabitType,
  params?: { rabbitId?: string; days?: number },
): Promise<TrendPoint[]> {
  return apiClient.get<TrendPoint[]>(`/api/trends/${habitType}`, params)
}

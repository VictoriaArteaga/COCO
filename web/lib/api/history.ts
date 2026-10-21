import { apiClient } from './client'
import type { HabitRecord, HabitType, PaginatedResponse } from '@/types'

/** Filters accepted by GET /api/history */
export interface HistoryParams {
  rabbitId?: string
  habitType?: HabitType
  from?: string // ISO-8601
  to?: string   // ISO-8601
  page?: number
  size?: number
}

export function getHistory(params?: HistoryParams): Promise<PaginatedResponse<HabitRecord>> {
  return apiClient.get<PaginatedResponse<HabitRecord>>('/api/history', params as Record<string, string | number | undefined>)
}

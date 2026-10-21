import { apiClient } from './client'
import type { HabitRecord, HabitType, PaginatedResponse } from '@/types'

/** Params accepted by GET /api/habits */
export interface ListHabitsParams {
  page?: number
  size?: number
}

export function listHabits(params?: ListHabitsParams): Promise<PaginatedResponse<HabitRecord>> {
  return apiClient.get<PaginatedResponse<HabitRecord>>('/api/habits', params as Record<string, number | undefined>)
}

export function getHabit(id: string): Promise<HabitRecord> {
  return apiClient.get<HabitRecord>(`/api/habits/${id}`)
}

export interface CreateHabitBody {
  clientRecordId: string
  rabbitId: string
  habitType: HabitType
  value?: number | null
  note?: string | null
  recordedAt: string // ISO-8601
  source?: string
}

export function createHabit(body: CreateHabitBody): Promise<HabitRecord> {
  return apiClient.post<HabitRecord>('/api/habits', body)
}

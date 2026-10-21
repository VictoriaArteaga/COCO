import { apiClient } from './client'
import type { Rabbit } from '@/types'

/**
 * Rabbit API calls.
 * Each function maps to a backend REST endpoint.
 */

export function getRabbits(): Promise<Rabbit[]> {
  return apiClient.get<Rabbit[]>('/api/rabbits')
}

export function getRabbit(id: string): Promise<Rabbit> {
  return apiClient.get<Rabbit>(`/api/rabbits/${id}`)
}

export function createRabbit(name: string): Promise<Rabbit> {
  return apiClient.post<Rabbit>('/api/rabbits', { name })
}

export function updateRabbit(id: string, name: string): Promise<Rabbit> {
  return apiClient.put<Rabbit>(`/api/rabbits/${id}`, { name })
}

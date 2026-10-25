import type { HabitRecord, Rabbit } from '@/types'
import type { HabitRepository } from './HabitRepository'
import { apiClient } from '@/lib/api/client'

export class ApiHabitRepository implements HabitRepository {
  async getRabbit(): Promise<Rabbit> {
    const rabbits = await apiClient.get<Rabbit[]>('/api/rabbits')
    if (!rabbits.length) throw new Error('Aún no tienes un conejo registrado.')
    return rabbits[0]
  }
  async listRecords(): Promise<HabitRecord[]> {
    const page = await apiClient.get<{ content: HabitRecord[] }>('/api/habits', { page: 0, size: 100, sort: 'recordedAt,desc' })
    return page.content
  }
  async addRecord(record: HabitRecord): Promise<void> {
    await apiClient.post('/api/habits', { clientRecordId: record.clientRecordId, rabbitId: record.rabbitId, habitType: record.habitType, value: record.value, note: record.note, recordedAt: record.recordedAt, source: 'WEB' })
  }
  async getOnline(): Promise<boolean> { return true }
}

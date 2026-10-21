import type { HabitRecord } from '@/types'
import { MOCK_RECORDS } from '@/lib/mock/habitRecords'
import { MOCK_RABBIT } from '@/lib/mock/rabbits'
import type { HabitRepository } from './HabitRepository'

/** In-memory demo adapter. Swap this adapter when a real API repository is ready. */
export class MockHabitRepository implements HabitRepository {
  private records = [...MOCK_RECORDS]
  async getRabbit() { return MOCK_RABBIT }
  async listRecords() { return [...this.records].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)) }
  async addRecord(record: HabitRecord) { this.records = [record, ...this.records] }
  async getOnline() { return true }
}

export const habitRepository = new MockHabitRepository()

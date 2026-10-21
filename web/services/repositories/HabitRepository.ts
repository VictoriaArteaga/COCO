import type { HabitRecord, Rabbit } from '@/types'

export interface HabitRepository {
  getRabbit(): Promise<Rabbit>
  listRecords(): Promise<HabitRecord[]>
  addRecord(record: HabitRecord): Promise<void>
  getOnline(): Promise<boolean>
}

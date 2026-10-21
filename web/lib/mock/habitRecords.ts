import type { HabitRecord, HabitType } from '@/types'
import { MOCK_RABBIT } from './rabbits'

const now = new Date()
const ago = (days: number, hours = 9) => {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  date.setHours(hours, 0, 0, 0)
  return date.toISOString()
}

const seed: Array<[HabitType, number | null, string | null, number, number]> = [
  ['FOOD', 85, null, 0, 8], ['WATER', 120, null, 0, 9], ['PLAY', 25, null, 0, 11],
  ['BEHAVIOR', null, 'Exploró con curiosidad después del desayuno.', 0, 12], ['SLEEP', 110, null, 0, 14],
  ['FOOD', 78, null, 1, 8], ['WATER', 105, null, 1, 10], ['PLAY', 32, null, 1, 12],
  ['BEHAVIOR', null, 'Se mostró tranquilo durante la tarde.', 1, 15], ['SLEEP', 125, null, 1, 16],
  ['FOOD', 82, null, 2, 8], ['WATER', 115, null, 2, 9], ['PLAY', 28, null, 2, 11],
  ['BEHAVIOR', null, 'Respondió al llamado y buscó interacción.', 2, 13], ['SLEEP', 105, null, 2, 16],
  ['FOOD', 90, null, 3, 8], ['WATER', 130, null, 3, 9], ['PLAY', 35, null, 3, 11],
  ['BEHAVIOR', null, 'Actividad habitual en sus momentos de juego.', 3, 14], ['SLEEP', 115, null, 3, 16],
  ['FOOD', 80, null, 4, 8], ['WATER', 110, null, 4, 10], ['PLAY', 22, null, 4, 12],
  ['BEHAVIOR', null, 'Prefirió descansar en un lugar silencioso.', 4, 15], ['SLEEP', 130, null, 4, 17],
  ['FOOD', 88, null, 5, 8], ['WATER', 125, null, 5, 9], ['PLAY', 30, null, 5, 11],
  ['BEHAVIOR', null, 'Se acercó a explorar cuando hubo visitas.', 5, 13], ['SLEEP', 120, null, 5, 16],
  ['FOOD', 86, null, 6, 8], ['WATER', 118, null, 6, 10], ['PLAY', 27, null, 6, 12],
  ['BEHAVIOR', null, 'Rutina tranquila y sin cambios observados.', 6, 15], ['SLEEP', 118, null, 6, 17],
]

export const MOCK_RECORDS: HabitRecord[] = seed.map(([habitType, value, note, days, hour], index) => ({
  id: `demo-record-${String(index + 1).padStart(3, '0')}`,
  clientRecordId: `demo-client-${String(index + 1).padStart(3, '0')}`,
  rabbitId: MOCK_RABBIT.id,
  habitType,
  value,
  note,
  recordedAt: ago(days, hour),
  source: index === 3 ? 'WATCH' : 'WEB',
  status: index === 3 ? 'PENDING' : 'SYNCED',
  createdAt: ago(days, hour),
}))

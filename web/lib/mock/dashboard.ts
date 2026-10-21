/**
 * Mock data used exclusively in the week 4 dashboard skeleton.
 *
 * Purpose: allow the UI structure to be visualised before the backend
 *          is wired up in week 5.
 *
 * Rules:
 *   - These values are NEVER sent to the backend.
 *   - Every file that imports from here must document this fact.
 *   - Remove all usages when real API calls are implemented in week 5.
 */

import type { Rabbit, HabitRecord } from '@/types'

export const MOCK_RABBIT: Rabbit = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Coquito',
  active: true,
  createdAt: new Date().toISOString(),
}

export const MOCK_RECORDS: HabitRecord[] = [
  {
    id: 'a1b2c3d4-0000-0000-0000-000000000001',
    clientRecordId: 'mock-client-001',
    rabbitId: MOCK_RABBIT.id,
    habitType: 'FOOD',
    value: 80,
    note: null,
    recordedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'WATCH',
    status: 'SYNCED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-0000-0000-0000-000000000002',
    clientRecordId: 'mock-client-002',
    rabbitId: MOCK_RABBIT.id,
    habitType: 'WATER',
    value: 150,
    note: null,
    recordedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: 'WATCH',
    status: 'SYNCED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-0000-0000-0000-000000000003',
    clientRecordId: 'mock-client-003',
    rabbitId: MOCK_RABBIT.id,
    habitType: 'SLEEP',
    value: 120,
    note: null,
    recordedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: 'WATCH',
    status: 'SYNCED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-0000-0000-0000-000000000004',
    clientRecordId: 'mock-client-004',
    rabbitId: MOCK_RABBIT.id,
    habitType: 'BEHAVIOR',
    value: null,
    note: 'Muy activo esta mañana',
    recordedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: 'WATCH',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
]

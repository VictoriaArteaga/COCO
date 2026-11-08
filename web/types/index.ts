/**
 * Shared TypeScript types for the COCO web platform.
 * These mirror the backend domain models and REST response DTOs.
 */

// ─── Enumerations ─────────────────────────────────────────────────────────────

export type HabitType = 'FOOD' | 'WATER' | 'SLEEP' | 'PLAY' | 'BEHAVIOR'

export type RecordStatus = 'PENDING' | 'SYNCED' | 'FAILED' | 'DUPLICATE'

/** Possible synchronisation states shown in the UI */
export type SyncStatusType =
  | 'idle'
  | 'syncing'
  | 'synced'
  | 'partial'
  | 'failed'
  | 'offline'

/** Display states for habit observations */
export type ObservationState =
  | 'normal'
  | 'attention'
  | 'alert'
  | 'info'
  | 'offline'
  | 'insufficient_evidence'
  | 'change_detected'

// ─── Domain Models ─────────────────────────────────────────────────────────────

export interface Rabbit {
  id: string
  name: string
  active: boolean
  createdAt: string // ISO-8601
}

export interface HabitRecord {
  id: string
  clientRecordId: string
  rabbitId: string
  habitType: HabitType
  value: number | null
  note: string | null
  recordedAt: string // ISO-8601
  source: string
  status: RecordStatus
  createdAt: string // ISO-8601
}

export interface TrendPoint {
  date: string // YYYY-MM-DD
  count: number
}

export interface DailySummary {
  rabbitId: string
  date: string // YYYY-MM-DD
  totalRecords: number
  countsByType: Record<HabitType, number>
}

// ─── API Request / Response helpers ───────────────────────────────────────────

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number // current page (0-indexed)
}

export interface SyncResult {
  synced: string[]
  duplicates: string[]
  failed: string[]
}

// ─── UI-specific types ────────────────────────────────────────────────────────

/**
 * Display metadata for each habit type — used in cards and charts.
 */
export interface HabitTypeInfo {
  key: HabitType
  label: string
  unit: string
  color: string // CSS hex colour from the Design System
}

export const HABIT_TYPE_INFO: Record<HabitType, HabitTypeInfo> = {
  FOOD: { key: 'FOOD', label: 'Alimentación', unit: 'g', color: '#0B8A72' },
  WATER: { key: 'WATER', label: 'Agua', unit: 'ml', color: '#2A78AE' },
  SLEEP: { key: 'SLEEP', label: 'Sueño', unit: 'min', color: '#6B4C9A' },
  PLAY: { key: 'PLAY', label: 'Juego', unit: 'min', color: '#D0406A' },
  BEHAVIOR: { key: 'BEHAVIOR', label: 'Comportamiento', unit: 'nota', color: '#B85F0E' },
}

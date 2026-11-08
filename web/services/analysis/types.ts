import type { HabitType } from '@/types'
import type { Lang } from '@/lib/i18n/dictionaries'

export type AnalysisStatus = 'NORMAL' | 'ATTENTION' | 'HIGH_ATTENTION' | 'LEARNING'
export interface AnalysisInput { rabbitId: string; periodDays: number; records: number; habitTypes: HabitType[]; lang?: Lang }
export interface AnalysisResult {
  status: AnalysisStatus
  summary: string
  factors: string[]
  recommendation: string
  anomalyDetected: boolean
  requiresVeterinaryAttention: boolean
  generatedAt: string
  source: 'backend' | 'mock'
}

import type { HabitType } from '@/types'

export type AnalysisStatus = 'NORMAL' | 'ATTENTION' | 'HIGH_ATTENTION' | 'LEARNING'
export interface AnalysisInput { rabbitId: string; periodDays: number; records: number; habitTypes: HabitType[] }
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

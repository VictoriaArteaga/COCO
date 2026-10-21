import type { HabitType, ObservationState } from '@/types'

export interface AnalysisInput { periodDays: number; records: number; habitTypes: HabitType[] }
export interface AnalysisResult {
  status: ObservationState
  summary: string
  factors: string[]
  confidence: number
  period: string
  generatedAt: string
  source: 'mock'
}

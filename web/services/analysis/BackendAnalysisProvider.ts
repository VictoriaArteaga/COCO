import { apiClient } from '@/lib/api/client'
import type { AnalysisInput, AnalysisResult, AnalysisStatus } from './types'
import type { AnalysisProvider } from './AnalysisProvider'

interface BackendAnalysis {
  id: string
  rabbitId: string
  status: AnalysisStatus
  anomalyDetected: boolean
  factors: string[]
  explanation: string
  recommendation: string
  requiresVeterinaryAttention: boolean
  createdAt: string
}

export class BackendAnalysisProvider implements AnalysisProvider {
  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    const result = await apiClient.post<BackendAnalysis>(`/api/analysis/rabbit/${encodeURIComponent(input.rabbitId)}`)
    return {
      status: result.status,
      summary: result.explanation,
      factors: result.factors,
      recommendation: result.recommendation,
      anomalyDetected: result.anomalyDetected,
      requiresVeterinaryAttention: result.requiresVeterinaryAttention,
      generatedAt: result.createdAt,
      source: 'backend',
    }
  }
}

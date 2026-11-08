import type { AnalysisProvider } from './AnalysisProvider'
import type { AnalysisInput, AnalysisResult } from './types'
import { dictionaries } from '@/lib/i18n/dictionaries'

/** Deterministic, non-medical demo observation based on supplied activity counts. */
export class MockAnalysisProvider implements AnalysisProvider {
  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    const m = dictionaries[input.lang ?? 'es'].analysis.mock
    const enoughData = input.records >= 5
    return {
      status: enoughData ? 'NORMAL' : 'LEARNING',
      summary: enoughData ? m.enough : m.few,
      factors: enoughData ? m.factorsEnough(input.records, input.periodDays, input.habitTypes.length) : m.factorsFew,
      recommendation: m.recommendation,
      anomalyDetected: false,
      requiresVeterinaryAttention: false,
      generatedAt: new Date().toISOString(),
      source: 'mock',
    }
  }
}

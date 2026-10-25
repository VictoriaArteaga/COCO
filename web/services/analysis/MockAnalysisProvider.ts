import type { AnalysisProvider } from './AnalysisProvider'
import type { AnalysisInput, AnalysisResult } from './types'

/** Deterministic, non-medical demo observation based on supplied activity counts. */
export class MockAnalysisProvider implements AnalysisProvider {
  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    const enoughData = input.records >= 5
    return {
      status: enoughData ? 'NORMAL' : 'LEARNING',
      summary: enoughData
        ? 'Hay registros recientes para describir la rutina; este resultado de demostración no analiza cambios clínicos.'
        : 'Aún hay pocos registros para describir una tendencia con claridad.',
      factors: enoughData
        ? [`${input.records} observaciones en ${input.periodDays} días`, `${input.habitTypes.length} variables con seguimiento`]
        : ['Registra observaciones en varios días', 'La falta de registros no significa que la actividad no ocurrió'],
      recommendation: 'Continúa registrando observaciones y consulta a un veterinario ante una preocupación.',
      anomalyDetected: false,
      requiresVeterinaryAttention: false,
      generatedAt: new Date().toISOString(),
      source: 'mock',
    }
  }
}

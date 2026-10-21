import type { AnalysisProvider } from './AnalysisProvider'
import type { AnalysisInput, AnalysisResult } from './types'

/** Deterministic, non-medical demo observation based on supplied activity counts. */
export class MockAnalysisProvider implements AnalysisProvider {
  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    const enoughData = input.records >= 5
    return {
      status: enoughData ? 'change_detected' : 'insufficient_evidence',
      summary: enoughData
        ? 'Hay registros recientes de las cinco variables para observar la rutina de Coquito.'
        : 'Aún hay pocos registros para describir una tendencia con claridad.',
      factors: enoughData
        ? [`${input.records} observaciones en ${input.periodDays} días`, `${input.habitTypes.length} variables con seguimiento`, 'La actividad de juego varía entre días; sigue registrando para contextualizar el patrón.']
        : ['Registra observaciones en varios días', 'Incluye más de una variable para dar contexto'],
      confidence: enoughData ? 0.76 : 0.32,
      period: `${input.periodDays} días`,
      generatedAt: new Date().toISOString(),
      source: 'mock',
    }
  }
}

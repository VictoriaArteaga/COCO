import type { AnalysisProvider } from './AnalysisProvider'
import type { AnalysisInput, AnalysisResult } from './types'

/** Uses the demo result only when the backend is unreachable during development. */
export class DevelopmentFallbackAnalysisProvider implements AnalysisProvider {
  constructor(private readonly primary: AnalysisProvider, private readonly fallback: AnalysisProvider) {}
  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    try { return await this.primary.analyze(input) }
    catch { return this.fallback.analyze(input) }
  }
}

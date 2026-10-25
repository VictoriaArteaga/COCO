import type { AnalysisProvider } from './AnalysisProvider'
import { BackendAnalysisProvider } from './BackendAnalysisProvider'
import { DevelopmentFallbackAnalysisProvider } from './DevelopmentFallbackAnalysisProvider'
import { MockAnalysisProvider } from './MockAnalysisProvider'

export class AnalysisService {
  constructor(private readonly provider: AnalysisProvider = process.env.NODE_ENV === 'development'
    ? new DevelopmentFallbackAnalysisProvider(new BackendAnalysisProvider(), new MockAnalysisProvider())
    : new BackendAnalysisProvider()) {}
  analyze(input: Parameters<AnalysisProvider['analyze']>[0]) { return this.provider.analyze(input) }
}
export const analysisService = new AnalysisService()

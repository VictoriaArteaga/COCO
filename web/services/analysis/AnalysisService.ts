import type { AnalysisProvider } from './AnalysisProvider'
import { MockAnalysisProvider } from './MockAnalysisProvider'

export class AnalysisService {
  constructor(private readonly provider: AnalysisProvider = new MockAnalysisProvider()) {}
  analyze(input: Parameters<AnalysisProvider['analyze']>[0]) { return this.provider.analyze(input) }
}

export const analysisService = new AnalysisService()

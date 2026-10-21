import type { AnalysisInput, AnalysisResult } from './types'

/** Provider boundary for future explainable analysis; it never represents diagnosis. */
export interface AnalysisProvider { analyze(input: AnalysisInput): Promise<AnalysisResult> }

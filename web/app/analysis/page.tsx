'use client'

import { useEffect, useState } from 'react'
import { habitRepository } from '@/services/repositories'
import { analysisService } from '@/services/analysis/AnalysisService'
import type { AnalysisResult } from '@/services/analysis/types'

export default function AnalysisPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { habitRepository.listRecords().then((records) => analysisService.analyze({ periodDays: 7, records: records.length, habitTypes: [...new Set(records.map((record) => record.habitType))] })).then(setResult).catch(() => setResult(null)).finally(() => setLoading(false)) }, [])
  return <div className="p-6 lg:p-8 space-y-6">
    <div><h1 className="text-2xl font-bold">Análisis observado</h1><p className="mt-1 text-text-secondary">Una lectura descriptiva de los registros recientes de Coquito.</p></div>
    <div className="rounded-coco border border-info/30 bg-info/5 p-4 text-sm text-text-secondary">COCO identifica patrones en los datos registrados. No diagnostica enfermedades ni reemplaza la valoración veterinaria.</div>
    {loading ? <div className="card animate-pulse p-10" role="status">Preparando el resumen demo…</div> : result ? <section className="card space-y-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="badge bg-green-light text-green-dark">{result.status === 'change_detected' ? 'Observación disponible' : 'Evidencia limitada'}</span><span className="text-sm text-text-secondary">Periodo: {result.period}</span></div>
      <h2 className="text-xl font-semibold">{result.summary}</h2>
      <div><h3 className="mb-2 font-semibold">Factores considerados</h3><ul className="list-disc space-y-1 pl-5 text-text-secondary">{result.factors.map((factor) => <li key={factor}>{factor}</li>)}</ul></div>
      <div className="rounded bg-surface p-4"><p className="text-sm font-medium">Indicador de completitud demo</p><p className="mt-1 text-sm text-text-secondary">{Math.round(result.confidence * 100)}% · Orienta sobre los datos disponibles; no es confianza médica.</p></div>
      <p className="text-xs text-text-secondary">Generado {new Date(result.generatedAt).toLocaleString('es-CO')} · Fuente: MockAnalysisProvider</p>
    </section> : <div className="card" role="alert">No fue posible generar el resumen. Inténtalo de nuevo más tarde.</div>}
  </div>
}

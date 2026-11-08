'use client'

import { useEffect, useState } from 'react'
import { habitRepository } from '@/services/repositories'
import { analysisService } from '@/services/analysis/AnalysisService'
import type { AnalysisResult } from '@/services/analysis/types'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'

export default function AnalysisPage() {
  const { t, lang, locale } = usePrefs()
  const a = t.analysis
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  // Se vuelve a pedir el análisis al cambiar de idioma para que el texto llegue en el idioma elegido.
  useEffect(() => {
    setLoading(true)
    Promise.all([habitRepository.getRabbit(), habitRepository.listRecords()])
      .then(([rabbit, allRecords]) => {
        const records = allRecords.filter((record) => record.rabbitId === rabbit.id)
        return analysisService.analyze({ rabbitId: rabbit.id, periodDays: 7, records: records.length, habitTypes: [...new Set(records.map((record) => record.habitType))], lang })
      })
      .then(setResult).catch(() => setResult(null)).finally(() => setLoading(false))
  }, [lang])
  return <div className="p-6 lg:p-8 space-y-6">
    <div><h1 className="text-2xl font-bold">{a.title}</h1><p className="mt-1 text-text-secondary">{a.sub}</p></div>
    <div className="rounded-coco border border-info/30 bg-info/5 p-4 text-sm text-text-secondary">{a.disclaimer}</div>
    {loading ? <div className="card skeleton p-10" role="status">{a.preparing}</div> : result ? <section className="card space-y-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="badge bg-green-light text-green-dark">{a.status[result.status]}</span><span className="text-sm text-text-secondary">{result.source === 'backend' ? a.fromBackend : a.fromMock}</span></div>
      <h2 className="text-xl font-semibold">{result.summary}</h2>
      <div><h3 className="mb-2 font-semibold">{a.factors}</h3><ul className="list-disc space-y-1 pl-5 text-text-secondary">{result.factors.map((factor, index) => <li key={`${index}-${factor}`}>{factor}</li>)}</ul></div>
      <div className="rounded-coco bg-surface p-4"><p className="text-sm font-medium">{a.recommendation}</p><p className="mt-1 text-sm text-text-secondary">{result.recommendation}</p></div>
      {result.requiresVeterinaryAttention && <p role="alert" className="rounded-coco border border-state-attention/40 bg-state-attention/10 p-4 text-sm">{a.vet}</p>}
      <p className="text-xs text-text-secondary">{a.generated} {new Date(result.generatedAt).toLocaleString(locale)}</p>
    </section> : <div className="card" role="alert">{a.error}</div>}
  </div>
}

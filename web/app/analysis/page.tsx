'use client'

import { useEffect, useMemo, useState } from 'react'
import { habitRepository } from '@/services/repositories'
import { analysisService } from '@/services/analysis/AnalysisService'
import type { AnalysisResult, AnalysisStatus } from '@/services/analysis/types'
import type { HabitRecord, HabitType } from '@/types'
import { HABIT_TYPE_INFO } from '@/types'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { PageHeader } from '@/components/organisms/PageHeader'
import { HABIT_ICON, Icon, IconTile, type IconName } from '@/components/atoms/Icon'

const TYPES: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']
const DAY = 86_400_000

/** Color e icono de cada estado, con tokens del proyecto. El texto nunca depende solo del color. */
const STATUS_STYLE: Record<AnalysisStatus, { color: string; icon: IconName }> = {
  NORMAL: { color: 'rgb(var(--c-state-normal))', icon: 'check' },
  LEARNING: { color: 'rgb(var(--c-state-info))', icon: 'info' },
  ATTENTION: { color: 'rgb(var(--c-state-attention))', icon: 'alert' },
  HIGH_ATTENTION: { color: 'rgb(var(--c-state-alert))', icon: 'alert' },
}

function Kpi({ icon, label, value, hint }: { icon: IconName; label: string; value: string; hint: string }) {
  return (
    <div className="card flex items-center gap-4 !p-4 sm:!p-5">
      <span className="auth-badge flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"><Icon name={icon} size={22} /></span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-text-secondary">{label}</p>
        <p className="truncate font-display text-2xl font-semibold leading-tight text-text">{value}</p>
        <p className="truncate text-xs font-medium text-text-secondary">{hint}</p>
      </div>
    </div>
  )
}

export default function AnalysisPage() {
  const { t, lang, locale } = usePrefs()
  const a = t.analysis
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [week, setWeek] = useState<HabitRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Se vuelve a pedir el análisis al cambiar de idioma para que el texto llegue en el idioma elegido.
  useEffect(() => {
    setLoading(true)
    Promise.all([habitRepository.getRabbit(), habitRepository.listRecords()])
      .then(([rabbit, allRecords]) => {
        const records = allRecords.filter((record) => record.rabbitId === rabbit.id)
        const since = Date.now() - 7 * DAY
        setWeek(records.filter((record) => new Date(record.recordedAt).getTime() >= since))
        return analysisService.analyze({ rabbitId: rabbit.id, periodDays: 7, records: records.length, habitTypes: [...new Set(records.map((record) => record.habitType))], lang })
      })
      .then(setResult).catch(() => setResult(null)).finally(() => setLoading(false))
  }, [lang])

  // Cifras descriptivas calculadas solo con los registros de la última semana.
  const stats = useMemo(() => {
    const perType = TYPES.map((type) => ({ type, count: week.filter((r) => r.habitType === type).length }))
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      const key = d.toISOString().slice(0, 10)
      return { key, label: d.toLocaleDateString(locale, { weekday: 'short' }), count: week.filter((r) => r.recordedAt.slice(0, 10) === key).length }
    })
    const last = [...week].sort((x, y) => y.recordedAt.localeCompare(x.recordedAt))[0]
    return {
      perType, days,
      maxType: Math.max(1, ...perType.map((p) => p.count)),
      maxDay: Math.max(1, ...days.map((d) => d.count)),
      vars: perType.filter((p) => p.count > 0).length,
      activeDays: days.filter((d) => d.count > 0).length,
      lastText: last ? new Date(last.recordedAt).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : a.kpiNone,
    }
  }, [week, locale, a.kpiNone])

  const status = result ? STATUS_STYLE[result.status] : null

  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={a.title} sub={a.sub} icon="search" />

    {loading ? (
      <div className="space-y-5" role="status" aria-label={a.preparing}>
        <div className="card skeleton h-40" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="card skeleton h-28" />)}</div>
        <p className="text-center text-sm font-bold text-white">{a.preparing}</p>
      </div>
    ) : !result || !status ? (
      <div className="card flex items-center gap-4" role="alert"><IconTile name="alert" color="#D6334F" size={44} /><p className="font-medium">{a.error}</p></div>
    ) : <div className="space-y-5 lg:space-y-6" aria-live="polite">

      {/* Estado general */}
      <section className="card relative overflow-hidden" aria-label={a.summaryLabel}>
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-2" style={{ background: status.color }} />
        <div className="flex flex-col gap-5 pl-3 sm:flex-row sm:items-start">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-white" style={{ background: status.color }}>
            <Icon name={status.icon} size={32} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge text-white" style={{ background: status.color }}>{a.status[result.status]}</span>
              <span className="text-sm font-medium text-text-secondary">{a.statusHint[result.status]}</span>
            </div>
            <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-text sm:text-2xl">{result.summary}</h2>
            <p className="mt-3 text-xs font-medium text-text-secondary">
              {result.source === 'backend' ? a.fromBackend : a.fromMock} · {a.generated} {new Date(result.generatedAt).toLocaleString(locale)}
            </p>
          </div>
        </div>
      </section>

      {result.requiresVeterinaryAttention && (
        <div role="alert" className="card flex items-start gap-4 !border-coral !bg-coral-light">
          <IconTile name="alert" color="#D6334F" size={44} />
          <p className="pt-1 font-bold text-text">{a.vet}</p>
        </div>
      )}

      {/* Cifras clave (calculadas con los registros reales de la semana) */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={a.kpiRecords}>
        <Kpi icon="list" label={a.kpiRecords} value={String(week.length)} hint={a.kpiRecordsHint} />
        <Kpi icon="behavior" label={a.kpiVars} value={`${stats.vars}/5`} hint={a.kpiVarsHint(stats.vars)} />
        <Kpi icon="calendar" label={a.kpiDays} value={`${stats.activeDays}/7`} hint={a.kpiDaysHint(stats.activeDays)} />
        <Kpi icon="clock" label={a.kpiLast} value={stats.lastText} hint={a.kpiRecordsHint} />
      </section>

      {/* Gráficas funcionales: qué variables y qué días tienen datos */}
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <section className="card" aria-labelledby="by-variable">
          <h2 id="by-variable" className="font-display text-xl font-semibold text-green-dark">{a.byVariable}</h2>
          <p className="mb-5 text-sm text-text-secondary">{a.byVariableSub}</p>
          <ul className="space-y-4">
            {stats.perType.map(({ type, count }) => (
              <li key={type} className="flex items-center gap-3">
                <IconTile name={HABIT_ICON[type]} color={HABIT_TYPE_INFO[type].color} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-bold text-text">{t.habits[type]}</span>
                    <span className="font-bold tabular-nums text-text-secondary">{count === 0 ? a.noVariableData : count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface" aria-hidden="true">
                    <div className="h-full rounded-full" style={{ width: `${(count / stats.maxType) * 100}%`, background: HABIT_TYPE_INFO[type].color, animation: 'grow-x 0.8s var(--ease-out) backwards', transformOrigin: 'left' }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="daily">
          <h2 id="daily" className="font-display text-xl font-semibold text-green-dark">{a.daily}</h2>
          <p className="mb-5 text-sm text-text-secondary">{a.dailySub}</p>
          <ul className="flex h-52 items-end justify-between gap-2 sm:gap-3">
            {stats.days.map((day) => (
              <li key={day.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-sm font-bold tabular-nums text-text">{day.count}</span>
                <div className="flex w-full flex-1 items-end rounded-xl bg-surface" aria-hidden="true">
                  <div className="w-full rounded-xl bg-green" style={{ height: `${day.count === 0 ? 4 : Math.max(10, (day.count / stats.maxDay) * 100)}%`, opacity: day.count === 0 ? 0.35 : 1, animation: 'fade-up 0.6s var(--ease-out) backwards' }} />
                </div>
                <span className="w-full truncate text-center text-xs font-bold capitalize text-text-secondary">{day.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Factores considerados como tarjetas */}
      {result.factors.length > 0 && (
        <section aria-labelledby="factors">
          <h2 id="factors" className="sr-only">{a.factors}</h2>
          <ul className="flex gap-4 overflow-x-auto pb-1">
            {result.factors.map((factor, index) => (
              <li key={`${index}-${factor}`} className="card flex min-w-[15rem] flex-1 items-start gap-3 !p-4">
                <span className="auth-badge flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"><Icon name="check" size={18} /></span>
                <p className="pt-1 text-sm font-semibold text-text">{factor}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recomendación */}
      <section className="card flex flex-col gap-4 sm:flex-row sm:items-start" aria-labelledby="recommendation">
        <IconTile name="bulb" color="#0FA68A" size={52} />
        <div>
          <h2 id="recommendation" className="font-display text-xl font-semibold text-green-dark">{a.recommendation}</h2>
          <p className="mt-2 text-text-secondary">{result.recommendation}</p>
        </div>
      </section>


    </div>}
  </div>
}

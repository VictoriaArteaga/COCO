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
const STATUS_STYLE: Record<AnalysisStatus, { color: string; icon: IconName; badge: string }> = {
  NORMAL: { color: 'rgb(var(--c-state-normal))', icon: 'check', badge: 'bg-[#E3F1E8] text-[#1F5C38]' },
  LEARNING: { color: 'rgb(var(--c-state-info))', icon: 'info', badge: 'bg-[#E1ECF7] text-[#2A5686]' },
  ATTENTION: { color: 'rgb(var(--c-state-attention))', icon: 'alert', badge: 'bg-[#FBEFD5] text-[#7A4F0B]' },
  HIGH_ATTENTION: { color: 'rgb(var(--c-state-alert))', icon: 'alert', badge: 'bg-[#FFE3E8] text-[#9E1F3A]' },
}

function Kpi({ icon, label, value, hint }: { icon: IconName; label: string; value: string; hint: string }) {
  return (
    <div className="card flex items-center gap-3.5 !px-5 !py-[18px]">
      <span className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink bg-green-light text-green-dark"><Icon name={icon} size={22} /></span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-text-secondary">{label}</p>
        <p className="truncate font-display text-[26px] font-semibold leading-tight text-text">{value}</p>
        <p className="truncate text-[13px] text-text-secondary">{hint}</p>
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
  const [progress, setProgress] = useState({ obs: 0, days: 0 })

  // Se vuelve a pedir el análisis al cambiar de idioma para que el texto llegue en el idioma elegido.
  useEffect(() => {
    setLoading(true)
    Promise.all([habitRepository.getRabbit(), habitRepository.listRecords()])
      .then(([rabbit, allRecords]) => {
        const records = allRecords.filter((record) => record.rabbitId === rabbit.id)
        const since = Date.now() - 7 * DAY
        setWeek(records.filter((record) => new Date(record.recordedAt).getTime() >= since))
        setProgress({ obs: records.length, days: new Set(records.map((record) => record.recordedAt.slice(0, 10))).size })
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
        <p className="text-center text-sm font-bold text-text-secondary">{a.preparing}</p>
      </div>
    ) : !result || !status ? (
      <div className="card flex items-center gap-4" role="alert"><IconTile name="alert" color="#D6334F" size={44} /><p className="font-medium">{a.error}</p></div>
    ) : <div className="space-y-5 lg:space-y-6" aria-live="polite">

      {/* Estado general */}
      <section className="card" aria-label={a.summaryLabel}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-full text-white" style={{ background: status.color }}>
            <Icon name={status.icon} size={36} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`badge h-7 rounded-full border-0 px-2.5 text-[13px] font-bold ${status.badge}`}><Icon name={status.icon} size={14} />{a.status[result.status]}</span>
              <span className="text-[15px] font-semibold text-text-secondary">{a.statusHint[result.status]}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-text sm:text-[28px]">{result.summary}</h2>
            {result.status === 'LEARNING' && (
              <>
                <p className="mt-2.5 text-base leading-relaxed text-text-secondary">{a.progressHint}</p>
                <div className="mt-[18px] grid gap-5 sm:grid-cols-2">
                  {([[a.progressRecords, progress.obs, 10], [a.progressDays, progress.days, 3]] as [string, number, number][]).map(([label, value, goal]) => (
                    <div key={label}>
                      <div className="mb-1.5 flex justify-between text-[15px] font-bold"><span>{label}</span><span className="tabular-nums">{Math.min(value, goal)} {a.of} {goal}</span></div>
                      <div className="h-3 overflow-hidden rounded-full border border-line bg-surface" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(value, goal)}>
                        <div className="h-full" style={{ width: `${(Math.min(value, goal) / goal) * 100}%`, background: status.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <p className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-2 text-sm text-text-secondary">
              {(result.status === 'LEARNING' || result.source === 'backend') && (
                <span className="inline-flex items-center gap-1.5 font-bold text-green-dark"><Icon name="bulb" size={16} />{result.status === 'LEARNING' ? a.aiPending : a.aiReady}</span>
              )}
              <span>{result.source === 'backend' ? a.fromBackend : a.fromMock} · {a.generated} {new Date(result.generatedAt).toLocaleString(locale)}</span>
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
                <IconTile name={HABIT_ICON[type]} color={HABIT_TYPE_INFO[type].color} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-[15px]">
                    <span className="font-extrabold text-text">{t.habits[type]}</span>
                    <span className="font-extrabold tabular-nums text-text-secondary">{count === 0 ? a.noVariableData : count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full border border-line bg-surface" aria-hidden="true">
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
          <ul className="flex h-[210px] items-end gap-3">
            {stats.days.map((day, index) => (
              <li key={day.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                <span className="text-[15px] font-extrabold tabular-nums text-text">{day.count}</span>
                <div
                  aria-hidden="true"
                  className="w-full rounded-t-[10px] rounded-b border-[1.5px] border-ink"
                  style={{ height: `${Math.max(8, Math.round((day.count / stats.maxDay) * 140))}px`, background: index === 6 ? '#7D4D31' : '#C9A887', animation: 'fade-up 0.6s var(--ease-out) backwards' }}
                />
                <span className="w-full truncate text-center text-[13px] font-bold capitalize text-text-secondary">{index === 6 ? t.common.today.toLowerCase() : day.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-text-secondary">{a.mock.factorsFew[1]}</p>
        </section>
      </div>

      {/* Factores considerados como tarjetas */}
      {result.factors.length > 0 && (
        <section aria-labelledby="factors">
          <h2 id="factors" className="font-display text-xl font-semibold text-green-dark">{a.factors}</h2>
          <p className="mb-3.5 text-sm text-text-secondary">{a.factorsSub}</p>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
            {result.factors.map((factor, index) => (
              <li key={`${index}-${factor}`} className="card flex items-start gap-3 !px-5 !py-[18px]">
                <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink bg-green-light text-green-dark"><Icon name="check" size={18} /></span>
                <p className="pt-1 text-base font-bold leading-snug text-text">{factor}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recomendación */}
      <section className="card flex flex-col gap-4 sm:flex-row sm:items-start" aria-labelledby="recommendation">
        <IconTile name="bulb" color="#7D4D31" size={56} />
        <div>
          <h2 id="recommendation" className="font-display text-xl font-semibold text-green-dark">{a.recommendation}</h2>
          <p className="mt-2.5 text-[17px] leading-relaxed text-text-secondary">{result.recommendation}</p>
        </div>
      </section>

      {/* Aviso permanente: visible, no una letra chica */}
      <div role="note" className="card flex items-start gap-3 !border-green-dark !p-4">
        <Icon name="shield" size={22} className="mt-0.5 flex-shrink-0 text-green-dark" />
        <p className="text-sm font-semibold text-text">{a.disclaimer}</p>
      </div>
    </div>}
  </div>
}

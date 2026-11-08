'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import type { Lang, Theme } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils/cn'
import { Icon, IconTile, type IconName } from '@/components/atoms/Icon'
import { PageHeader } from '@/components/organisms/PageHeader'

/** Selector de opciones como tarjetas grandes (grupo de radios accesible). */
function OptionCards<T extends string>({ name, label, value, options, onChange }: {
  name: string
  label: string
  value: T
  options: { value: T; label: string; icon?: IconName; hint?: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-2" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              'relative flex min-h-[64px] cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-[background-color,border-color,transform] duration-150',
              'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-green',
              active ? 'border-green bg-green-light' : 'border-line bg-card hover:-translate-y-0.5 hover:border-green',
            )}
          >
            <input type="radio" name={name} value={option.value} checked={active} onChange={() => onChange(option.value)} className="sr-only" />
            {option.icon && <IconTile name={option.icon} color={active ? '#0FA68A' : '#4A6862'} size={40} />}
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold text-text">{option.label}</span>
              {option.hint && <span className="block text-xs font-medium text-text-secondary">{option.hint}</span>}
            </span>
            <span aria-hidden="true" className={cn('flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2', active ? 'border-green bg-green text-white' : 'border-line')}>
              {active && <Icon name="check" size={14} />}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}

function InfoList({ items, icon }: { items: string[]; icon: IconName }) {
  return (
    <ul className="space-y-3">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-3 text-sm text-text-secondary">
          <span className="auth-badge mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"><Icon name={icon} size={15} /></span>
          <span className="pt-0.5 font-medium">{text}</span>
        </li>
      ))}
    </ul>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { t, lang, theme, setLang, setTheme } = usePrefs()
  const s = t.settings

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }


  return <div className="space-y-5 p-4 sm:p-6 lg:space-y-6 lg:p-8">
    <PageHeader title={s.title} sub={s.sub} icon="settings" />

    {/* Apariencia */}
    <section className="card space-y-6" aria-labelledby="appearance">
      <h2 id="appearance" className="font-display text-xl font-semibold text-green-dark">{s.appearance}</h2>
      <div>
        <p className="font-bold text-text">{s.language}</p>
        <p className="mb-3 text-sm text-text-secondary">{s.languageHelp} {s.langNote}</p>
        <OptionCards<Lang> name="lang" label={s.language} value={lang} onChange={setLang}
          options={[{ value: 'es', label: s.spanish, hint: 'ES' }, { value: 'en', label: s.english, hint: 'EN' }]} />
      </div>
      <div>
        <p className="font-bold text-text">{s.theme}</p>
        <p className="mb-3 text-sm text-text-secondary">{s.themeHelp}</p>
        <OptionCards<Theme> name="theme" label={s.theme} value={theme} onChange={setTheme}
          options={[{ value: 'light', label: s.light, icon: 'sun' }, { value: 'dark', label: s.dark, icon: 'sleep' }]} />
      </div>
    </section>

    <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      {/* Cuenta y sesión */}
      <section className="card flex flex-col gap-5" aria-labelledby="session">
        <div className="flex items-start gap-4">
          <IconTile name="shield" size={48} />
          <div>
            <h2 id="session" className="font-display text-xl font-semibold text-green-dark">{s.sessionTitle}</h2>
            <p className="text-sm text-text-secondary">{s.sessionSub}</p>
          </div>
        </div>
        <InfoList icon="check" items={[s.sessionA, s.sessionB, s.sessionC]} />
        <div className="mt-auto flex flex-wrap gap-3">
          <Link href="/profile" className="btn-secondary"><Icon name="user" size={18} />{s.goProfile}</Link>
          <button type="button" onClick={logout} className="btn-secondary hover:!bg-coral-light"><Icon name="logout" size={18} />{s.logoutNow}</button>
        </div>
      </section>

      {/* Análisis preventivo */}
      <section className="card flex flex-col gap-5" aria-labelledby="analysis-info">
        <div className="flex items-start gap-4">
          <IconTile name="search" size={48} />
          <div>
            <h2 id="analysis-info" className="font-display text-xl font-semibold text-green-dark">{s.analysisTitle}</h2>
            <p className="text-sm text-text-secondary">{s.analysisSub}</p>
          </div>
        </div>
        <InfoList icon="info" items={[s.analysisA, s.analysisB, s.analysisC]} />
        <div className="mt-auto"><Link href="/analysis" className="btn-secondary"><Icon name="search" size={18} />{s.goAnalysis}</Link></div>
      </section>
    </div>

  </div>
}

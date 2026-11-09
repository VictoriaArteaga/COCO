'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import type { Lang, Theme } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils/cn'
import { Icon, IconTile, type IconName } from '@/components/atoms/Icon'
import { PageHeader } from '@/components/organisms/PageHeader'

/** Control segmentado (grupo de radios accesible): una opción activa, resaltada con color y relleno. */
function Segmented<T extends string>({ label, value, options, onChange }: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-0.5 rounded-2xl border border-line bg-surface p-1">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(option.value)}
            className={cn('min-h-[40px] rounded-xl px-4 text-sm font-bold transition-colors', active ? 'bg-green-dark text-white' : 'text-green-dark hover:bg-green-light')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function SettingRow({ title, help, children }: { title: string; help: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-line py-4">
      <div className="min-w-0 flex-1 basis-64">
        <p className="text-lg font-extrabold text-text">{title}</p>
        <p className="text-sm text-text-secondary">{help}</p>
      </div>
      {children}
    </div>
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
    <section className="card" aria-labelledby="appearance">
      <h2 id="appearance" className="font-display text-xl font-semibold text-green-dark">{s.appearance}</h2>
      <p className="mb-2 text-sm text-text-secondary">{s.langNote}</p>
      <SettingRow title={s.language} help={s.languageHelp}>
        <Segmented<Lang> label={s.language} value={lang} onChange={setLang}
          options={[{ value: 'es', label: s.spanish }, { value: 'en', label: s.english }]} />
      </SettingRow>
      <SettingRow title={s.theme} help={s.themeHelp}>
        <Segmented<Theme> label={s.theme} value={theme} onChange={setTheme}
          options={[{ value: 'light', label: s.light }, { value: 'dark', label: s.dark }]} />
      </SettingRow>
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

    {/* Accesos rápidos */}
    <section aria-labelledby="quick">
      <h2 id="quick" className="mb-3 font-display text-xl font-semibold text-green-dark">{s.shortcutsTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {([['/reminders', 'bell', t.nav.reminders, s.remindersDesc], ['/synchronization', 'refresh', t.nav.sync, s.syncDesc], ['/profile', 'user', t.nav.profile, s.profileDesc]] as const).map(([href, icon, title, desc]) => (
          <Link key={href} href={href} className="card card-interactive flex min-h-[84px] items-center gap-4 !p-4">
            <IconTile name={icon} color="#7D4D31" size={46} />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold text-green-dark">{title}</span>
              <span className="block text-sm text-text-secondary">{desc}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>

    {/* Datos demo */}
    <section className="card flex items-start gap-4">
      <IconTile name="info" color="#6D5545" size={44} />
      <div>
        <h2 className="font-display text-lg font-semibold text-green-dark">{s.demoData}</h2>
        <p className="mt-1 max-w-3xl text-sm text-text-secondary">{s.demoDataText}</p>
      </div>
    </section>

  </div>
}

'use client'

import { useState } from 'react'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import type { Lang, Theme } from '@/lib/i18n/dictionaries'
import { cn } from '@/lib/utils/cn'

/** Control segmentado accesible (grupo de radios) para elegir una opción entre pocas. */
function Segmented<T extends string>({ name, label, value, options, onChange }: {
  name: string
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="flex flex-wrap gap-2" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              'cursor-pointer rounded-coco border-[1.5px] px-4 py-2 text-sm font-bold transition-[background-color,border-color,transform] duration-150',
              'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink',
              active
                ? 'border-ink bg-purple text-white'
                : 'border-line bg-card text-text hover:-translate-y-0.5 hover:border-ink',
            )}
          >
            <input
              type="radio" name={name} value={option.value} checked={active}
              onChange={() => onChange(option.value)} className="sr-only"
            />
            {option.label}
          </label>
        )
      })}
    </fieldset>
  )
}

export default function SettingsPage() {
  const { t, lang, theme, setLang, setTheme } = usePrefs()
  const s = t.settings
  const [compact, setCompact] = useState(false)
  const [reminders, setReminders] = useState(true)
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">{s.title}</h1><p className="mt-1 text-text-secondary">{s.sub}</p></div>
    <section className="card divide-y divide-line p-0" aria-label={s.appearance}>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div><p className="font-medium">{s.language}</p><p className="text-sm text-text-secondary">{s.languageHelp}</p></div>
        <Segmented<Lang> name="lang" label={s.language} value={lang} onChange={setLang}
          options={[{ value: 'es', label: s.spanish }, { value: 'en', label: s.english }]} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div><p className="font-medium">{s.theme}</p><p className="text-sm text-text-secondary">{s.themeHelp}</p></div>
        <Segmented<Theme> name="theme" label={s.theme} value={theme} onChange={setTheme}
          options={[{ value: 'light', label: s.light }, { value: 'dark', label: s.dark }]} />
      </div>
    </section>
    <section className="card divide-y divide-line p-0"><label className="flex items-center justify-between gap-4 p-5"><span><span className="block font-medium">{s.compact}</span><span className="text-sm text-text-secondary">{s.compactHelp}</span></span><input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} /></label><label className="flex items-center justify-between gap-4 p-5"><span><span className="block font-medium">{s.reminders}</span><span className="text-sm text-text-secondary">{s.remindersHelp}</span></span><input type="checkbox" checked={reminders} onChange={(e) => setReminders(e.target.checked)} /></label><div className="p-5"><p className="font-medium">{s.demoData}</p><p className="mt-1 text-sm text-text-secondary">{s.demoDataText}</p></div></section>
  </div>
}

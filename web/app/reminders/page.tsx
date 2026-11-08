'use client'

import { useState } from 'react'
import { MOCK_REMINDERS } from '@/lib/mock/reminders'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'

export default function RemindersPage() {
  const { t } = usePrefs()
  const [reminders, setReminders] = useState(MOCK_REMINDERS)
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">{t.reminders.title}</h1><p className="mt-1 text-text-secondary">{t.reminders.sub}</p></div>
    <div className="card divide-y divide-line p-0">{reminders.map((item) => {
      const text = t.reminders.items[item.id] ?? { title: item.title, detail: item.detail }
      return <label key={item.id} className="flex items-center justify-between gap-4 p-5"><span><span className="block font-medium">{text.title}</span><span className="mt-1 block text-sm text-text-secondary">{text.detail} · {item.time}</span></span><input aria-label={`${item.enabled ? t.reminders.disable : t.reminders.enable} ${text.title}`} type="checkbox" checked={item.enabled} onChange={() => setReminders((current) => current.map((reminder) => reminder.id === item.id ? { ...reminder, enabled: !reminder.enabled } : reminder))} /></label>
    })}</div>
    <p className="text-sm text-text-secondary">{t.reminders.note}</p>
  </div>
}

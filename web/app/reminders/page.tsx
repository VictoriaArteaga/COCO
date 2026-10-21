'use client'

import { useState } from 'react'
import { MOCK_REMINDERS } from '@/lib/mock/reminders'

export default function RemindersPage() {
  const [reminders, setReminders] = useState(MOCK_REMINDERS)
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">Recordatorios</h1><p className="mt-1 text-text-secondary">Ajusta avisos locales para acompañar la rutina de cuidado.</p></div>
    <div className="card divide-y divide-green-light p-0">{reminders.map((item) => <label key={item.id} className="flex items-center justify-between gap-4 p-5"><span><span className="block font-medium">{item.title}</span><span className="mt-1 block text-sm text-text-secondary">{item.detail} · {item.time}</span></span><input aria-label={`${item.enabled ? 'Desactivar' : 'Activar'} ${item.title}`} type="checkbox" checked={item.enabled} onChange={() => setReminders((current) => current.map((reminder) => reminder.id === item.id ? { ...reminder, enabled: !reminder.enabled } : reminder))} /></label>)}</div>
    <p className="text-sm text-text-secondary">Estos ajustes son una demostración en esta sesión. Las notificaciones del sistema no están conectadas.</p>
  </div>
}

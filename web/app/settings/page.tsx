'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [compact, setCompact] = useState(false)
  const [reminders, setReminders] = useState(true)
  return <div className="p-6 lg:p-8 space-y-6"><div><h1 className="text-2xl font-bold">Configuración</h1><p className="mt-1 text-text-secondary">Preferencias de visualización y privacidad.</p></div>
    <section className="card divide-y divide-green-light p-0"><label className="flex items-center justify-between gap-4 p-5"><span><span className="block font-medium">Vista compacta</span><span className="text-sm text-text-secondary">Reduce el espacio entre tarjetas.</span></span><input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} /></label><label className="flex items-center justify-between gap-4 p-5"><span><span className="block font-medium">Recordatorios</span><span className="text-sm text-text-secondary">Preferencia local para avisos de cuidado.</span></span><input type="checkbox" checked={reminders} onChange={(e) => setReminders(e.target.checked)} /></label><div className="p-5"><p className="font-medium">Datos demo</p><p className="mt-1 text-sm text-text-secondary">Los datos de esta versión se generan desde repositorios mock locales. No se envían credenciales ni observaciones a un proveedor externo.</p></div></section>
  </div>
}

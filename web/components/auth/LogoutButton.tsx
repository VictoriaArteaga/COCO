'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }
  return <button onClick={logout} className="w-full rounded px-3 py-2 text-left text-sm text-text-secondary hover:bg-green-light">Cerrar sesión</button>
}

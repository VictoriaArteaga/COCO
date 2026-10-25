import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata: Metadata = { title: 'Crear cuenta' }

export default function RegisterPage() {
  return <main className="min-h-screen flex items-center justify-center bg-surface px-4"><div className="card w-full max-w-sm space-y-6">
    <header className="text-center"><h1 className="text-3xl font-bold text-green-dark">COCO</h1><p className="text-text-secondary text-sm mt-1">Crea tu cuenta</p></header>
    <AuthForm mode="register" />
  </div></main>
}

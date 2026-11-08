import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/AuthForm'
import { AuthShell } from '@/components/auth/AuthShell'
import { getServerPrefs } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: t.auth.registerMeta }
}

export default function RegisterPage() {
  return <AuthShell mode="register"><AuthForm mode="register" /></AuthShell>
}

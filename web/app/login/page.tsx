import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/AuthForm'
import { AuthShell } from '@/components/auth/AuthShell'
import { getServerPrefs } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: t.auth.loginMeta }
}

export default function LoginPage() {
  return <AuthShell mode="login"><AuthForm mode="login" /></AuthShell>
}

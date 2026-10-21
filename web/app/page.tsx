import { redirect } from 'next/navigation'

/**
 * Root page — redirects to dashboard.
 * Unauthenticated users will be redirected to /login once auth is implemented (week 5).
 */
export default function RootPage() {
  redirect('/dashboard')
}

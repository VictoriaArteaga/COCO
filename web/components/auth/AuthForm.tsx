'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { Icon, type IconName } from '@/components/atoms/Icon'

type FieldProps = {
  label: string; name: string; icon: IconName; type?: string; placeholder?: string; hint?: string
  autoComplete?: string; maxLength?: number
  error?: string; onValue?: (name: string, value: string, final: boolean) => void
  reveal?: { show: string; hide: string }
}

function Field({ label, name, icon, type = 'text', hint, reveal, error, onValue, ...rest }: FieldProps) {
  const [visible, setVisible] = useState(false)
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined
  return (
    <label className="block text-sm font-bold text-text lg:text-base">
      {label}
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"><Icon name={icon} size={18} /></span>
        <input name={name} type={reveal && visible ? 'text' : type} aria-invalid={error ? true : undefined} aria-describedby={describedBy}
          onChange={e => error && onValue?.(name, e.target.value, false)} onBlur={e => onValue?.(name, e.target.value, true)} className="input auth-input w-full rounded-xl py-3 pl-11 pr-11 font-medium lg:py-4 lg:pl-12 lg:text-base" {...rest} />
        {reveal && (
          <button type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? reveal.hide : reveal.show}
            className="auth-eye absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-secondary hover:text-green-dark">
            <Icon name={visible ? 'eyeOff' : 'eye'} size={18} />
          </button>
        )}
      </span>
      {error
        ? <span id={`${name}-error`} role="alert" className="auth-error mt-1 flex items-start gap-1 text-xs font-semibold lg:text-sm"><Icon name="close" size={14} className="mt-0.5 shrink-0" />{error}</span>
        : hint && <span id={`${name}-hint`} className="mt-1 block text-xs font-medium text-text-secondary lg:text-sm">{hint}</span>}
    </label>
  )
}

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const { t } = usePrefs()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const reveal = { show: t.auth.show, hide: t.auth.hide }
  const register = mode === 'register'

  /** Devuelve el mensaje de error del campo, o '' si es válido. */
  function check(name: string, value: string, form?: HTMLFormElement): string {
    const v = value.trim()
    switch (name) {
      case 'displayName': return !v ? t.auth.errName : v.length > 100 ? t.auth.errNameLong : ''
      case 'email': return !v ? t.auth.errEmail : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? t.auth.errEmailFormat : ''
      case 'password': return !value ? t.auth.errPassword : register && value.length < 8 ? t.auth.errPasswordShort : ''
      case 'confirmPassword': {
        if (!value) return t.auth.errConfirm
        const pwd = form ? (new FormData(form).get('password') as string) : (document.querySelector<HTMLInputElement>('input[name=password]')?.value ?? '')
        return value !== pwd ? t.auth.mismatch : ''
      }
      default: return ''
    }
  }
  function onValue(name: string, value: string, final: boolean) {
    // Al salir del campo valida; mientras escribe solo limpia el error cuando ya es correcto.
    const message = check(name, value)
    setErrors(prev => (final || !message) && prev[name] !== message ? { ...prev, [name]: message } : prev)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const form = new FormData(event.currentTarget)
    const found: Record<string, string> = {}
    for (const name of register ? ['displayName', 'email', 'password', 'confirmPassword'] : ['email', 'password']) {
      const message = check(name, String(form.get(name) ?? ''), event.currentTarget)
      if (message) found[name] = message
    }
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) { event.currentTarget.querySelector<HTMLInputElement>(`input[name=${firstInvalid}]`)?.focus(); return }
    const { confirmPassword, ...body } = Object.fromEntries(form.entries())
    setBusy(true)
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json()
      if (!response.ok) { setError(data.message ?? t.auth.requestError); return }
      router.replace('/dashboard'); router.refresh()
    } catch { setError(t.auth.connectError) }
    finally { setBusy(false) }
  }

  return <form className="space-y-5 lg:space-y-7" onSubmit={submit} noValidate>
    <div className={register ? 'grid gap-5 sm:grid-cols-2 lg:gap-x-7 lg:gap-y-6' : 'space-y-5 lg:space-y-7'}>
      {register && <Field label={t.auth.name} name="displayName" error={errors.displayName} onValue={onValue} icon="user" placeholder={t.auth.namePh} hint={t.auth.nameHint} autoComplete="name" maxLength={100} />}
      <Field label={t.auth.email} name="email" error={errors.email} onValue={onValue} type="email" icon="mail" placeholder={t.auth.emailPh} hint={register ? t.auth.emailHint : undefined} autoComplete="email" maxLength={255} />
      <Field label={t.auth.password} name="password" error={errors.password} onValue={onValue} type="password" icon="lock" placeholder={t.auth.passwordPh} hint={register ? t.auth.passwordHint : undefined}
        autoComplete={register ? 'new-password' : 'current-password'} reveal={reveal} />
      {register && <Field label={t.auth.confirm} name="confirmPassword" error={errors.confirmPassword} onValue={onValue} type="password" icon="lock" placeholder={t.auth.passwordPh} hint={t.auth.confirmHint}
        autoComplete="new-password" reveal={reveal} />}
    </div>
    {error && <p role="alert" className="rounded-coco border border-coral bg-coral-light p-3 text-sm font-medium text-text">{error}</p>}
    <button className="btn-accent auth-submit w-full rounded-xl py-3 text-base lg:py-4 lg:text-lg" disabled={busy}>{busy ? t.auth.processing : register ? t.auth.register : t.auth.login}</button>
    <p className="text-center text-sm text-text-secondary lg:text-base">{register
      ? <>{t.auth.haveAccount} <Link className="auth-link" href="/login">{t.auth.signIn}</Link></>
      : <>{t.auth.noAccount} <Link className="auth-link" href="/register">{t.auth.signUp}</Link></>}</p>
  </form>
}

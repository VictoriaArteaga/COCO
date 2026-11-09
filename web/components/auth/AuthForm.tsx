'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { usePrefs } from '@/lib/i18n/PreferencesProvider'
import { friendlyError } from '@/lib/api/friendlyError'
import { Icon, type IconName } from '@/components/atoms/Icon'

type FieldProps = {
  label: string; name: string; icon: IconName; type?: string; placeholder?: string; hint?: string
  autoComplete?: string; maxLength?: number
  error?: string; onValue?: (name: string, value: string, final: boolean) => void
  reveal?: { show: string; hide: string }
}

/** Campo del diseño: etiqueta arriba, caja de 50 px con icono a la izquierda y, si aplica, botón para mostrar la contraseña. */
function Field({ label, name, icon, type = 'text', hint, reveal, error, onValue, ...rest }: FieldProps) {
  const [visible, setVisible] = useState(false)
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[15px] font-bold text-text lg:text-base">{label}</label>
      <div className={cn(
        'flex h-[50px] items-center gap-2.5 rounded-xl border-[1.5px] bg-[var(--input-bg)] px-3.5 text-text-secondary transition-[border-color,box-shadow] lg:h-[54px] lg:px-4',
        'focus-within:border-green focus-within:shadow-[0_0_0_4px_rgb(138_90_59/0.28)]',
        error ? 'border-coral' : 'border-line',
      )}>
        <Icon name={icon} size={20} />
        <input
          id={name} name={name} type={reveal && visible ? 'text' : type} aria-invalid={error ? true : undefined} aria-describedby={describedBy}
          onChange={e => error && onValue?.(name, e.target.value, false)} onBlur={e => onValue?.(name, e.target.value, true)}
          className="min-w-0 flex-1 !min-h-0 !border-0 !bg-transparent !p-0 text-base text-text placeholder:text-text-secondary/70 focus:!shadow-none lg:text-[17px]"
          {...rest}
        />
        {reveal && (
          <button type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? reveal.hide : reveal.show}
            className="auth-eye -mr-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full text-green-dark hover:bg-green-light">
            <Icon name={visible ? 'eyeOff' : 'eye'} size={22} />
          </button>
        )}
      </div>
      {error
        ? <span id={`${name}-error`} role="alert" className="auth-error flex items-start gap-1 text-[13px] font-semibold lg:text-sm"><Icon name="alert" size={14} className="mt-0.5 shrink-0" />{error}</span>
        : hint && <span id={`${name}-hint`} className="text-[13px] text-text-secondary lg:text-sm">{hint}</span>}
    </div>
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
      if (!response.ok) {
        // Mensajes propios según lo que ocurrió; nunca el texto crudo del servidor.
        setError(register && response.status === 409 ? t.auth.emailTaken
          : !register && (response.status === 400 || response.status === 401) ? t.auth.badCredentials
          : friendlyError(response.status, t, t.auth.requestError))
        return
      }
      router.replace('/dashboard'); router.refresh()
    } catch { setError(t.auth.connectError) }
    finally { setBusy(false) }
  }

  // Requisitos de la contraseña en vivo (solo en el registro)
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  function track(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget)
    setPwd(String(data.get('password') ?? ''))
    setPwd2(String(data.get('confirmPassword') ?? ''))
  }

  return <form className="flex flex-col gap-[18px] lg:gap-5" onSubmit={submit} onChange={track} noValidate>
    {register && <Field label={t.auth.name} name="displayName" error={errors.displayName} onValue={onValue} icon="user" placeholder={t.auth.namePh} hint={t.auth.nameHint} autoComplete="name" maxLength={100} />}
    <Field label={t.auth.email} name="email" error={errors.email} onValue={onValue} type="email" icon="mail" placeholder={t.auth.emailPh} hint={register ? t.auth.emailHint : undefined} autoComplete="email" maxLength={255} />
    {register ? (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[18px] lg:gap-x-6 lg:gap-y-5">
        <Field label={t.auth.password} name="password" error={errors.password} onValue={onValue} type="password" icon="lock" placeholder={t.auth.passwordPh} autoComplete="new-password" reveal={reveal} />
        <Field label={t.auth.confirm} name="confirmPassword" error={errors.confirmPassword} onValue={onValue} type="password" icon="lock" placeholder={t.auth.passwordPh} autoComplete="new-password" reveal={reveal} />
      </div>
    ) : (
      <Field label={t.auth.password} name="password" error={errors.password} onValue={onValue} type="password" icon="lock" placeholder={t.auth.passwordPh} autoComplete="current-password" reveal={reveal} />
    )}
    {register && (
      <ul className="-mt-1.5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold lg:text-base" aria-live="polite">
        {[[t.auth.reqLength, pwd.length >= 8], [t.auth.reqMatch, pwd2.length > 0 && pwd === pwd2]].map(([label, ok]) => (
          <li key={String(label)} className={cn('flex items-center gap-1.5', ok ? 'text-state-normal' : 'text-text-secondary')}>
            <Icon name={ok ? 'check' : 'info'} size={16} />{label}
          </li>
        ))}
      </ul>
    )}
    {error && <p role="alert" className="rounded-coco border border-coral bg-coral-light p-3 text-sm font-medium text-text">{error}</p>}
    <button className="btn-accent auth-submit min-h-[52px] w-full rounded-xl font-display text-[17px] font-semibold lg:min-h-[54px] lg:text-lg" disabled={busy}>{busy ? t.auth.processing : register ? t.auth.register : t.auth.login}</button>
    <p className="text-center text-[15px] text-text-secondary lg:text-base">{register
      ? <>{t.auth.haveAccount} <Link className="auth-link" href="/login">{t.auth.signIn}</Link></>
      : <>{t.auth.noAccount} <Link className="auth-link" href="/register">{t.auth.signUp}</Link></>}</p>
  </form>
}

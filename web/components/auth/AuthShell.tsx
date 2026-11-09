import Link from 'next/link'
import { Icon } from '@/components/atoms/Icon'
import { Logo } from '@/components/atoms/Logo'
import { getServerPrefs } from '@/lib/i18n/server'

/**
 * Marco compartido de inicio de sesión y registro.
 * El fondo (degradado, puntos, patrón y luces) es el de siempre; la tarjeta sigue el diseño:
 * login = tarjeta de 460 px con logo, título y formulario, y el aviso de no diagnóstico debajo;
 * registro = tarjeta de dos paneles (bienvenida con beneficios + formulario).
 */
export async function AuthShell({ mode, children }: { mode: 'login' | 'register'; children: React.ReactNode }) {
  const { t } = await getServerPrefs()
  const cardAnim = { animation: 'scale-in 0.6s var(--ease-out) backwards' }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-10 pt-[5.5rem] sm:px-6 sm:pb-14 sm:pt-24"
      style={{ background: 'var(--auth-bg)' }}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ opacity: 'var(--auth-dots-opacity)', backgroundImage: 'radial-gradient(var(--auth-dots) 1px, transparent 1px)', backgroundSize: '24px 24px', animation: 'drift 60s linear infinite' }}
      />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.22]" style={{ backgroundImage: 'var(--auth-pattern)', backgroundSize: '160px 160px' }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 10%, rgb(255 255 255 / 0.22), transparent 70%), radial-gradient(ellipse 50% 45% at 10% 95%, rgb(255 255 255 / 0.14), transparent 70%)' }} />

      {/* Volver a la pantalla de bienvenida */}
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 inline-flex min-h-[44px] items-center gap-2 rounded-xl border-[1.5px] border-white/70 bg-white/15 px-3.5 text-sm font-bold text-white transition-colors hover:bg-white/25 focus-visible:outline-white sm:left-6 sm:top-6"
      >
        <Icon name="back" size={18} />{t.auth.back}
      </Link>

      {mode === 'login' ? (
        <div className="relative flex w-full max-w-[460px] flex-col items-center gap-5 sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[540px]">
          <section aria-labelledby="auth-title" className="auth-card w-full rounded-[24px] p-6 sm:p-10 lg:p-12" style={cardAnim}>
            <header className="flex flex-col items-center gap-2.5 text-center lg:gap-3">
              <Logo size={64} className="lg:scale-110 lg:mb-1" />
              <h1 id="auth-title" className="font-display text-4xl font-semibold text-green-dark lg:text-[2.5rem]">{t.auth.welcome}</h1>
              <p className="text-base text-text-secondary lg:text-[17px]">{t.auth.loginSub}</p>
            </header>
            <div className="mt-[22px] lg:mt-8">{children}</div>
          </section>
          <p className="text-center text-sm font-bold text-white lg:text-[15px]">{t.brand.long}</p>
        </div>
      ) : (
        <div className="auth-card relative flex w-full max-w-[1040px] flex-wrap overflow-hidden rounded-[24px] lg:max-w-[1100px] xl:max-w-[1140px]" style={cardAnim}>
          <section className="flex flex-[1_1_340px] flex-col gap-[22px] p-8 text-white sm:p-11 lg:gap-6 lg:p-12" style={{ background: 'var(--auth-panel)' }}>
            <Logo size={56} className="lg:origin-top-left lg:scale-110 lg:mb-1" />
            <h2 className="font-display text-[2.125rem] font-semibold leading-[1.15] !text-white lg:text-[2.375rem]">{t.auth.joinTitle}</h2>
            <p className="text-[17px] leading-relaxed text-[#FFF4E8] lg:text-[17px]">{t.auth.joinText}</p>
            <ul className="flex flex-col gap-3.5 lg:gap-4">
              {t.auth.joinBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-base font-semibold lg:text-[17px]">
                  <span aria-hidden="true" className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-yellow text-[#2B1B12]"><Icon name="check" size={16} /></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="auth-title" className="flex flex-[1.4_1_420px] flex-col justify-center gap-[18px] p-6 sm:p-11 lg:gap-5 lg:p-12">
            <div>
              <h1 id="auth-title" className="font-display text-[2.125rem] font-semibold text-green-dark lg:text-[2.375rem]">{t.auth.createTitle}</h1>
              <p className="mt-1 text-base text-text-secondary lg:text-[17px]">{t.auth.createLead}</p>
            </div>
            {children}
          </section>
        </div>
      )}
    </main>
  )
}

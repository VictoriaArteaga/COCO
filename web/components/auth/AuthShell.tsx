import { Icon } from '@/components/atoms/Icon'
import { RabbitIllustration } from '@/components/atoms/RabbitIllustration'
import { getServerPrefs } from '@/lib/i18n/server'

/**
 * Marco compartido de inicio de sesión y registro.
 * Fondo turquesa de la marca; login = tarjeta centrada con icono circular,
 * registro = tarjeta de dos paneles (panel de bienvenida + formulario en cuadrícula).
 */
export async function AuthShell({ mode, children }: { mode: 'login' | 'register'; children: React.ReactNode }) {
  const { t } = await getServerPrefs()
  const cardAnim = { animation: 'scale-in 0.6s var(--ease-out) backwards' }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      style={{ background: 'var(--auth-bg)' }}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ opacity: 'var(--auth-dots-opacity)', backgroundImage: 'radial-gradient(var(--auth-dots) 1px, transparent 1px)', backgroundSize: '24px 24px', animation: 'drift 60s linear infinite' }}
      />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.22]" style={{ backgroundImage: 'var(--auth-pattern)', backgroundSize: '160px 160px' }} />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 10%, rgb(255 255 255 / 0.22), transparent 70%), radial-gradient(ellipse 50% 45% at 10% 95%, rgb(255 255 255 / 0.14), transparent 70%)' }} />

      {mode === 'login' ? (
        <div className="auth-card relative w-full max-w-md rounded-sheet overflow-hidden p-6 sm:max-w-lg sm:p-10 lg:max-w-xl lg:p-14 xl:max-w-2xl xl:p-16" style={cardAnim}>
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green via-green-bright to-yellow opacity-90" />
          <header className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full auth-badge lg:h-24 lg:w-24 xl:h-28 xl:w-28">
              <Icon name="login" size={34} className="lg:scale-125 xl:scale-150" />
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold text-green-dark lg:mt-7 lg:text-5xl xl:text-6xl">{t.auth.welcome}</h1>
            <p className="mt-2 text-sm text-text-secondary lg:mt-3 lg:text-base xl:text-lg">{t.auth.loginSub}</p>
          </header>
          <div className="mt-8 lg:mt-10">{children}</div>
        </div>
      ) : (
        <div className="auth-card relative grid w-full max-w-md rounded-sheet overflow-hidden md:max-w-4xl md:grid-cols-[0.8fr_1.2fr] lg:max-w-6xl xl:max-w-7xl xl:min-h-[44rem]" style={cardAnim}>
          <section className="relative hidden flex-col justify-between p-10 text-white md:flex lg:p-14 xl:p-16" style={{ background: 'var(--auth-panel)' }}>
            <div aria-hidden="true" className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/10" />
            <div className="relative">
              <Icon name="userPlus" size={36} />
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight lg:text-4xl xl:text-5xl">{t.auth.joinTitle}</h2>
              <p className="mt-4 font-medium leading-relaxed text-white/90 lg:text-lg xl:text-xl">{t.auth.joinText}</p>
            </div>
            <div className="relative">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full auth-disc lg:h-44 lg:w-44 xl:h-56 xl:w-56">
                <RabbitIllustration className="h-28 w-28 lg:h-40 lg:w-40 xl:h-52 xl:w-52" />
              </div>
              <p className="flex items-center gap-2 text-sm font-bold lg:text-base"><Icon name="rabbit" size={18} />{t.auth.joinFeature}</p>
            </div>
          </section>
          <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-14 xl:p-16">
            <h1 className="font-display text-3xl font-semibold text-green-dark lg:text-4xl xl:text-5xl">{t.auth.createTitle}</h1>
            <p className="mt-1 text-sm text-text-secondary lg:text-base xl:text-lg">{t.auth.createLead}</p>
            <div className="mt-6 lg:mt-8">{children}</div>
          </section>
        </div>
      )}
    </main>
  )
}

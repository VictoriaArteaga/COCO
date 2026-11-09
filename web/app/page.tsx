import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { HABIT_ICON, Icon, IconTile, type IconName } from '@/components/atoms/Icon'
import { Logo } from '@/components/atoms/Logo'
import { CocoMascot } from '@/components/atoms/CocoMascot'
import { HABIT_TYPE_INFO, type HabitType } from '@/types'
import { getServerPrefs } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerPrefs()
  return { title: { absolute: `COCO — ${t.brand.tagline}` }, description: t.brand.hero }
}

const VARIABLES: HabitType[] = ['FOOD', 'WATER', 'SLEEP', 'PLAY', 'BEHAVIOR']
const PILLAR_ICONS: IconName[] = ['eye', 'calendar', 'behavior']
const STEP_ICONS: IconName[] = ['userPlus', 'calendar', 'trending', 'bulb']
const BRAND = '#7D4D31'

const section = 'mx-auto flex max-w-[72.5rem] flex-col gap-9 px-5 py-12 sm:px-8 sm:py-[4.5rem]'
const cta = 'inline-flex min-h-[56px] items-center justify-center rounded-2xl px-7 py-3 text-center text-lg'

function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="flex max-w-3xl flex-col gap-3">
      <span className="text-sm font-extrabold uppercase tracking-widest" style={{ color: BRAND }}>{eyebrow}</span>
      <h2 className="font-display text-3xl font-semibold leading-tight text-green-dark sm:text-4xl">{title}</h2>
      {text && <p className="text-lg leading-relaxed text-text-secondary">{text}</p>}
    </div>
  )
}

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[17px] leading-snug">
          <span aria-hidden="true" className="mt-px flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink bg-yellow text-[#2B1B12]"><Icon name="check" size={15} /></span>
          {item}
        </li>
      ))}
    </ul>
  )
}

/**
 * Pantalla de bienvenida (ruta raíz). Informa qué es COCO y lleva al inicio de sesión o al registro.
 * Si ya hay una sesión abierta, entra directo al panel.
 */
export default async function LandingPage() {
  if ((await cookies()).get('coco_session')?.value) redirect('/dashboard')
  const { t } = await getServerPrefs()
  const l = t.landing

  return (
    <div className="bg-[#F3E7D8] text-text">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-extrabold">{l.skip}</a>

      <header className="text-white" style={{ background: '#4A2E1D' }}>
        <div className="mx-auto flex max-w-[72.5rem] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <Logo size={44} />
            <span className="font-display text-[1.65rem] font-semibold">COCO</span>
          </Link>
          <nav aria-label={l.navLabel} className="flex flex-wrap gap-x-2">
            {([['#que-es', l.navWhat], ['#variables', l.navVars], ['#como', l.navHow], ['#dispositivos', l.navDevices]] as const).map(([href, label]) => (
              <a key={href} href={href} className="inline-flex min-h-[44px] items-center rounded-lg px-3.5 font-bold text-[#FFF4E8] hover:bg-white/10">{label}</a>
            ))}
          </nav>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/login" className="inline-flex min-h-[46px] items-center rounded-xl border-[1.5px] border-white px-5 font-display font-semibold text-white hover:bg-white/10">{l.login}</Link>
            <Link href="/register" className="btn-accent min-h-[46px] font-display">{l.register}</Link>
          </div>
        </div>
      </header>

      <main id="contenido">
        {/* Portada */}
        <section className="text-white" style={{ background: 'linear-gradient(145deg,#8A5A3B 0%,#5E3822 60%,#4A2E1D 100%)' }}>
          <div className="mx-auto flex max-w-[72.5rem] flex-wrap items-center gap-12 px-5 py-10 sm:px-8 sm:py-[4.5rem] lg:pb-[5.25rem]">
            <div className="flex min-w-0 flex-[1_1_26rem] flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3.5 py-1.5 text-sm font-extrabold">
                <Icon name="behavior" size={16} />{t.brand.full}
              </span>
              <h1 className="font-display text-[clamp(2.1rem,9vw,3.5rem)] font-semibold leading-[1.1] !text-white">{t.brand.hero}</h1>
              <p className="max-w-xl text-xl leading-relaxed text-[#FFF4E8]">{l.heroText}</p>
              <div className="flex flex-wrap gap-3.5">
                <Link href="/register" className={`btn-accent font-display ${cta}`}>{l.heroCta}</Link>
                <Link href="/login" className={`${cta} border-[1.5px] border-white font-display font-semibold text-white hover:bg-white/10`}>{l.heroLogin}</Link>
              </div>
              <p className="flex items-center gap-2.5 text-[15px] font-bold text-[#FFF4E8]"><Icon name="shield" size={20} />{t.brand.long}</p>
            </div>
            <div className="flex min-w-0 flex-[1_1_18rem] justify-center">
              <div className="flex aspect-square w-full max-w-[25rem] items-center justify-center rounded-full border-2 border-ink p-[6%] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]" style={{ background: '#EBD6BE' }}>
                <CocoMascot title="Coquito" />
              </div>
            </div>
          </div>
        </section>

        {/* Qué es */}
        <section id="que-es" aria-labelledby="que-es-t" className={section}>
          <div id="que-es-t"><Heading eyebrow={l.whatEyebrow} title={l.whatTitle} text={l.whatText} /></div>
          <div className="grid gap-5 md:grid-cols-3">
            {l.pillars.map((p, i) => (
              <div key={p.title} className="card flex flex-col gap-3.5 !p-7">
                <IconTile name={PILLAR_ICONS[i]} color={BRAND} size={56} />
                <h3 className="font-display text-2xl font-semibold text-green-dark">{p.title}</h3>
                <p className="text-[17px] leading-relaxed text-text-secondary">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Qué registras */}
        <div className="bg-white">
          <section id="variables" className={section}>
            <Heading eyebrow={l.varsEyebrow} title={l.varsTitle} text={l.varsText} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {VARIABLES.map((type) => (
                <li key={type} className="card flex flex-col gap-3 !p-5">
                  <IconTile name={HABIT_ICON[type]} color={HABIT_TYPE_INFO[type].color} size={52} />
                  <h3 className="font-display text-xl font-semibold text-text">{t.habits[type]}</h3>
                  <p className="text-base leading-snug text-text-secondary">{l.varsDesc[type]}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Cómo funciona */}
        <section id="como" className={section}>
          <Heading eyebrow={l.howEyebrow} title={l.howTitle} />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {l.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-6">
                <div className="flex items-center gap-3">
                  <IconTile name={STEP_ICONS[i]} color={BRAND} size={48} />
                  <span className="font-display text-lg font-semibold text-text-secondary">{l.step(i + 1)}</span>
                </div>
                <h3 className="font-display text-[1.4rem] font-semibold text-green-dark">{s.title}</h3>
                <p className="leading-relaxed text-text-secondary">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Reloj y web */}
        <div className="bg-white">
          <section id="dispositivos" className={section}>
            <Heading eyebrow={l.devEyebrow} title={l.devTitle} text={l.devText} />
            <div className="grid gap-5 lg:grid-cols-2">
              {([['clock', BRAND, l.watchTitle, l.watchItems], ['home', '#3B6EA5', l.webTitle, l.webItems]] as const).map(([icon, color, title, items]) => (
                <div key={title} className="card flex flex-col gap-4 !p-7">
                  <div className="flex items-center gap-3.5">
                    <IconTile name={icon} color={color} size={56} />
                    <h3 className="font-display text-2xl font-semibold text-green-dark">{title}</h3>
                  </div>
                  <Checks items={[...items]} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Aviso */}
        <section className="px-5 sm:px-8">
          <div role="note" className="mx-auto mt-12 flex max-w-[68.5rem] flex-wrap items-start gap-4 rounded-[20px] border-2 border-green-dark bg-white px-7 py-6">
            <Icon name="shield" size={36} className="text-green-dark" />
            <div className="min-w-0 flex-[1_1_22rem]">
              <h2 className="font-display text-[1.65rem] font-semibold text-green-dark">{l.noteTitle}</h2>
              <p className="mt-2 text-[17px] leading-relaxed">{l.noteText}</p>
            </div>
          </div>
        </section>

        {/* Llamada final */}
        <section className="px-5 pb-14 pt-10 sm:px-8 sm:pb-[4.5rem]">
          <div className="mx-auto flex max-w-[68.5rem] flex-col items-center gap-5 rounded-[28px] px-5 py-10 text-center text-white sm:px-10 sm:py-14" style={{ background: 'linear-gradient(135deg,#8A5A3B,#5A3825)' }}>
            <Logo size={64} />
            <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight !text-white sm:text-4xl">{l.ctaTitle}</h2>
            <p className="max-w-lg text-lg leading-relaxed text-[#FFF4E8]">{l.ctaText}</p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <Link href="/register" className={`btn-accent font-display ${cta}`}>{l.register}</Link>
              <Link href="/login" className={`${cta} border-[1.5px] border-white font-display font-semibold text-white hover:bg-white/10`}>{l.login}</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-[#FFF4E8]" style={{ background: '#4A2E1D' }}>
        <div className="mx-auto flex max-w-[72.5rem] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-8 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div><p className="font-display text-[1.375rem] font-semibold text-white">COCO</p><p className="text-sm">{t.brand.tagline}</p></div>
          </div>
          <nav aria-label={l.footerAccess} className="flex flex-wrap gap-x-3">
            <Link href="/login" className="inline-flex min-h-[44px] items-center px-2.5 font-extrabold text-white underline">{l.login}</Link>
            <Link href="/register" className="inline-flex min-h-[44px] items-center px-2.5 font-extrabold text-white underline">{l.register}</Link>
          </nav>
          <p className="basis-full text-sm text-[#E8D3BC]">{t.brand.long}</p>
        </div>
      </footer>
    </div>
  )
}

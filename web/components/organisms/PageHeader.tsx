import { Icon, type IconName } from '@/components/atoms/Icon'

/**
 * Barra superior fija de cada sección: nombre de la página con su icono y, a la derecha, acciones
 * (por ejemplo el selector de conejo). Se ancla al borde superior, a la derecha del menú lateral.
 */
export function PageHeader({ title, sub, icon, children }: { title: string; sub?: React.ReactNode; icon: IconName; children?: React.ReactNode }) {
  return (
    <header className="shell-surface fixed inset-x-0 top-[4.25rem] z-30 flex h-[4.5rem] animate-none items-center justify-between gap-3 border-b px-4 sm:px-6 md:left-[5.5rem] md:top-0 md:h-20 lg:px-8 xl:left-64">
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-yellow text-[#2B1B12]">
          <Icon name={icon} size={22} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-semibold leading-tight text-white sm:text-2xl">{title}</h1>
          {sub && <p className="hidden truncate text-sm text-white/80 sm:block">{sub}</p>}
        </div>
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </header>
  )
}

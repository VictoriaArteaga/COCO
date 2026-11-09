import { IconTile, type IconName } from '@/components/atoms/Icon'

/**
 * Encabezado de cada sección, dentro del contenido: mosaico con el icono, título grande y subtítulo.
 * A la derecha van las acciones (por ejemplo el selector de conejo); en pantallas angostas bajan a otra línea.
 */
export function PageHeader({ title, sub, icon, children }: { title: string; sub?: React.ReactNode; icon: IconName; children?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <IconTile name={icon} size={52} color="#7D4D31" />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold leading-tight text-green-dark sm:text-3xl">{title}</h1>
          {sub && <p className="mt-1 text-base text-text-secondary">{sub}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </header>
  )
}

import { cn } from '@/lib/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'text-green hover:bg-green-light rounded-coco px-3 py-1.5 transition-colors',
}

const SIZE_STYLES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
}

/**
 * Accessible button component.
 * Manages disabled state, loading state, and keyboard focus.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(VARIANT_STYLES[variant], SIZE_STYLES[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="sr-only">Cargando…</span>
          <span aria-hidden="true">●●●</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

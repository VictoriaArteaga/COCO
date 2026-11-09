import { cn } from '@/lib/utils/cn'

/**
 * Logo de COCO: conejo a todo color (crema con borde tinta, orejas y mejillas rosas)
 * sobre un mosaico amarillo. Es la misma marca que usa el smartwatch.
 * Decorativo por defecto (aria-hidden): el nombre "COCO" va siempre como texto al lado.
 */
export function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex flex-shrink-0 items-center justify-center', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: '#FFC83D',
        borderRadius: Math.round(size * 0.3),
        border: '1.5px solid #2B1B12',
      }}
    >
      <svg width={Math.round(size * 0.86)} height={Math.round(size * 0.86)} viewBox="0 0 48 48" focusable="false">
        <g transform="rotate(-10 17 15)">
          <ellipse cx="17" cy="14" rx="5.4" ry="11" fill="#FBF3EA" stroke="#2B1B12" strokeWidth="2" />
          <ellipse cx="17" cy="15" rx="2.4" ry="7.2" fill="#F2A99C" />
        </g>
        <g transform="rotate(10 31 15)">
          <ellipse cx="31" cy="14" rx="5.4" ry="11" fill="#FBF3EA" stroke="#2B1B12" strokeWidth="2" />
          <ellipse cx="31" cy="15" rx="2.4" ry="7.2" fill="#F2A99C" />
        </g>
        <ellipse cx="24" cy="31" rx="15.5" ry="13" fill="#FBF3EA" stroke="#2B1B12" strokeWidth="2" />
        <ellipse cx="14.5" cy="34" rx="2.8" ry="1.9" fill="#F2A99C" />
        <ellipse cx="33.5" cy="34" rx="2.8" ry="1.9" fill="#F2A99C" />
        <circle cx="18.5" cy="29" r="2" fill="#2B1B12" />
        <circle cx="29.5" cy="29" r="2" fill="#2B1B12" />
        <circle cx="19.1" cy="28.3" r="0.7" fill="#fff" />
        <circle cx="30.1" cy="28.3" r="0.7" fill="#fff" />
        <path d="M22 33h4l-2 2.2z" fill="#D6334F" />
        <path d="M24 35.2q-1.6 2.6-4 1.2M24 35.2q1.6 2.6 4 1.2" fill="none" stroke="#2B1B12" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  )
}

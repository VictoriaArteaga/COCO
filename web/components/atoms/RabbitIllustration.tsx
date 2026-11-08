import { cn } from '@/lib/utils/cn'

/**
 * Ilustración plana de Coquito (Mini Lop, orejas caídas) con hojas detrás.
 * Decorativa: aria-hidden. Los ojos parpadean y las orejas se mecen con suavidad.
 */
export function RabbitIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 220" aria-hidden="true" focusable="false" className={cn('block', className)}>
      {/* Hojas */}
      <g>
        <path d="M38 190c-14-34-6-70 22-96 10 36 4 72-22 96z" fill="#0A6B5A" />
        <path d="M38 190c-2-28 4-56 22-96" stroke="#0B2E2A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.35" />
        <path d="M184 192c16-30 10-66-14-92-12 34-8 68 14 92z" fill="#D6334F" />
        <path d="M184 192c0-26-4-56-14-92" stroke="#0B2E2A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.35" />
        <path d="M70 196c-6-22 0-44 16-60 8 24 4 46-16 60z" fill="#0FA68A" />
        <path d="M152 198c8-20 4-42-10-58-10 22-8 44 10 58z" fill="#7FF0CC" />
      </g>

      {/* Cuerpo */}
      <ellipse cx="110" cy="170" rx="50" ry="38" fill="#FFF4E8" stroke="#0B2E2A" strokeWidth="2.5" />
      <ellipse cx="88" cy="196" rx="14" ry="8" fill="#FFF4E8" stroke="#0B2E2A" strokeWidth="2.5" />
      <ellipse cx="132" cy="196" rx="14" ry="8" fill="#FFF4E8" stroke="#0B2E2A" strokeWidth="2.5" />

      {/* Orejas caídas */}
      <g className="sway">
        <path d="M76 82C50 82 40 120 54 146c12 8 24-14 28-40z" fill="#E9B98A" stroke="#0B2E2A" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g className="sway" style={{ animationDirection: 'reverse' }}>
        <path d="M144 82c26 0 36 38 22 64-12 8-24-14-28-40z" fill="#E9B98A" stroke="#0B2E2A" strokeWidth="2.5" strokeLinejoin="round" />
      </g>

      {/* Cabeza */}
      <circle cx="110" cy="108" r="40" fill="#FFF4E8" stroke="#0B2E2A" strokeWidth="2.5" />
      <ellipse cx="88" cy="122" rx="8" ry="6" fill="#FFC9B8" />
      <ellipse cx="132" cy="122" rx="8" ry="6" fill="#FFC9B8" />

      {/* Ojos */}
      <g className="blink">
        <ellipse cx="94" cy="104" rx="4" ry="5.5" fill="#0B2E2A" />
        <ellipse cx="126" cy="104" rx="4" ry="5.5" fill="#0B2E2A" />
        <circle cx="95.5" cy="102" r="1.4" fill="#fff" />
        <circle cx="127.5" cy="102" r="1.4" fill="#fff" />
      </g>

      {/* Nariz y boca */}
      <ellipse cx="110" cy="116" rx="5" ry="3.6" fill="#D6334F" />
      <path d="M110 119.5v4M110 123.5q-6 6-12 1M110 123.5q6 6 12 1" stroke="#0B2E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

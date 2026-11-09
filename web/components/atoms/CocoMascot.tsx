import { cn } from '@/lib/utils/cn'

const INK = '#2B1B12'
const BRN = '#8A5A3B'
const PINK = '#F2A99C'

function Eye({ cx }: { cx: number }) {
  return (
    <>
      <ellipse cx={cx} cy={102} rx={7} ry={8.5} fill="#1E3A8A" />
      <ellipse cx={cx} cy={103} rx={3.6} ry={5} fill="#0B1020" />
      <circle cx={cx + 2.4} cy={99} r={2.6} fill="#fff" />
      <circle cx={cx - 2.4} cy={106.5} r={1.2} fill="#fff" />
      <ellipse cx={cx} cy={102} rx={7} ry={8.5} fill="none" stroke={INK} strokeWidth={1.5} />
    </>
  )
}

/**
 * Coquito, el conejo de COCO: blanco con manchas café y negras, orejas paradas, ojos azul oscuro
 * y una zanahoria entre las patas. Decorativo si se da `title` vacío; con `title` se anuncia como imagen.
 */
export function CocoMascot({ title, className }: { title?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 220 220" className={cn('block h-auto w-full', className)} focusable="false"
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <clipPath id="coco-head"><ellipse cx="110" cy="104" rx="45" ry="40" /></clipPath>
      <clipPath id="coco-body"><ellipse cx="110" cy="168" rx="50" ry="38" /></clipPath>
      <clipPath id="coco-ear-l"><path d="M86 80C68 70 66 30 80 10C94 8 102 42 100 78Z" /></clipPath>
      <clipPath id="coco-ear-r"><path d="M134 80C152 70 154 30 140 10C126 8 118 42 120 78Z" /></clipPath>

      <ellipse cx="110" cy="208" rx="66" ry="7" fill={INK} opacity="0.14" />

      {/* Cuerpo */}
      <ellipse cx="110" cy="168" rx="50" ry="38" fill="#fff" />
      <g clipPath="url(#coco-body)">
        <ellipse cx="78" cy="170" rx="17" ry="15" fill={BRN} />
        <ellipse cx="140" cy="158" rx="9" ry="8" fill={INK} />
        <ellipse cx="132" cy="190" rx="10" ry="7" fill={BRN} />
      </g>
      <ellipse cx="110" cy="168" rx="50" ry="38" fill="none" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="84" cy="201" rx="16" ry="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="136" cy="201" rx="16" ry="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="140" cy="201" rx="6" ry="4" fill={BRN} />

      {/* Orejas paradas */}
      <path d="M86 80C68 70 66 30 80 10C94 8 102 42 100 78Z" fill="#fff" />
      <g clipPath="url(#coco-ear-l)"><ellipse cx="74" cy="36" rx="15" ry="22" fill={BRN} /></g>
      <path d="M88 72C80 60 79 38 84 24C91 26 94 46 93 70Z" fill={PINK} opacity="0.95" />
      <path d="M86 80C68 70 66 30 80 10C94 8 102 42 100 78Z" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M134 80C152 70 154 30 140 10C126 8 118 42 120 78Z" fill="#fff" />
      <g clipPath="url(#coco-ear-r)"><ellipse cx="146" cy="62" rx="11" ry="13" fill={INK} /></g>
      <path d="M132 72C140 60 141 38 136 24C129 26 126 46 127 70Z" fill={PINK} opacity="0.95" />
      <path d="M134 80C152 70 154 30 140 10C126 8 118 42 120 78Z" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />

      {/* Cabeza */}
      <ellipse cx="110" cy="104" rx="45" ry="40" fill="#fff" />
      <g clipPath="url(#coco-head)">
        <ellipse cx="86" cy="96" rx="19" ry="17" fill={BRN} />
        <ellipse cx="143" cy="84" rx="10" ry="9" fill={INK} />
        <ellipse cx="128" cy="76" rx="9" ry="6" fill={BRN} />
      </g>
      <ellipse cx="110" cy="104" rx="45" ry="40" fill="none" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="82" cy="119" rx="9" ry="6" fill={PINK} opacity="0.9" />
      <ellipse cx="138" cy="119" rx="9" ry="6" fill={PINK} opacity="0.9" />
      <Eye cx={92} />
      <Eye cx={128} />
      <path d="M104 114Q110 111 116 114Q113 121 110 121Q107 121 104 114Z" fill="#D6334F" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M110 121v4M110 125q-5 6-11 1M110 125q5 6 11 1" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M70 114l-16-3M70 120l-17 3M150 114l16-3M150 120l17 3" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* Zanahoria */}
      <path d="M100 152Q110 148 120 152L113 196Q110 201 107 196Z" fill="#C4600F" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M104 165h7M108 177h6M106 187h5" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M110 152C102 142 94 142 92 146c4 6 12 8 18 6zM110 152C114 140 122 138 126 142c0 6-6 10-16 10zM110 152C107 142 108 136 111 134c4 4 3 12-1 18z" fill="#2E7D50" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="94" cy="171" rx="11" ry="9" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="126" cy="171" rx="11" ry="9" fill="#fff" stroke={INK} strokeWidth="2.5" />
    </svg>
  )
}

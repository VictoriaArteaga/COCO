import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/** Colores de los mosaicos de iconos (misma paleta que tailwind.config.ts). */
export const TILE = {
  teal: '#0FA68A',
  muted: '#4A6862',
  ink: 'rgb(var(--c-ink))',
  gray: 'rgb(var(--c-mute))',
} as const

export type IconName =
  | 'home' | 'list' | 'trending' | 'search' | 'user' | 'bell' | 'refresh' | 'settings'
  | 'rabbit' | 'food' | 'water' | 'sleep' | 'play' | 'behavior' | 'logout' | 'close'
  | 'mail' | 'lock' | 'eye' | 'eyeOff' | 'userPlus' | 'login'

/** Trazos de 24x24. Sólo líneas: el color lo define el contenedor (blanco en los mosaicos). */
const PATHS: Record<IconName, ReactNode> = {
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h5v-6h4v6h5V10" /></>,
  list: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M9 11h6M9 15h6" /></>,
  trending: <><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  bell: <><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 004 0" /></>,
  refresh: <><path d="M20 11a8 8 0 00-14-4L4 9" /><path d="M4 4v5h5" /><path d="M4 13a8 8 0 0014 4l2-2" /><path d="M20 20v-5h-5" /></>,
  settings: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
  rabbit: <><path d="M9.5 11C8 7 8.2 3 9.8 3S12 7 11.5 11" /><path d="M14.5 11c1.5-4 1.3-8-.3-8S12 7 12.5 11" /><circle cx="12" cy="15.5" r="5" /><path d="M10.5 15.5h.01M13.5 15.5h.01" /></>,
  food: <><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19l8-8" /></>,
  water: <path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z" />,
  sleep: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  play: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  behavior: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 6.1A9.8 9.8 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9M6.3 6.8C3.7 8.6 2 12 2 12s4 7 10 7c1.5 0 2.8-.4 4-1" /></>,
  userPlus: <><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6" /><path d="M19 8v6M16 11h6" /></>,
  login: <><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><path d="M10 17l5-5-5-5M15 12H3" /></>,
}

/** Mapeo de cada variable de hábito a su icono. */
export const HABIT_ICON = {
  FOOD: 'food', WATER: 'water', SLEEP: 'sleep', PLAY: 'play', BEHAVIOR: 'behavior',
} as const satisfies Record<string, IconName>

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" className={className}
    >
      {PATHS[name]}
    </svg>
  )
}

interface IconTileProps {
  name: IconName
  /** Color de la paleta COCO para el fondo del mosaico. */
  color?: string
  /** Borde del mosaico: negro tinta o gris. */
  border?: 'ink' | 'gray'
  size?: number
  className?: string
}

/** Icono blanco sobre un mosaico de la paleta con borde negro o gris. Decorativo (aria-hidden). */
export function IconTile({ name, color = TILE.teal, border = 'ink', size = 40, className }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('icon-tile', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.round(size * 0.3),
        border: `1.5px solid ${border === 'ink' ? TILE.ink : TILE.gray}`,
      }}
    >
      <Icon name={name} size={Math.round(size * 0.52)} />
    </span>
  )
}

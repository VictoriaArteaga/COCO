import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/** Colores de los mosaicos de iconos (misma paleta que tailwind.config.ts). */
export const TILE = {
  teal: '#0FA68A',
  muted: '#4A6862',
  ink: 'rgb(var(--c-ink))',
  gray: 'rgb(var(--c-mute))',
  coral: '#D6334F',
  yellow: '#FFC83D',
  dark: '#0B2E2A',
} as const

export type IconName =
  | 'home' | 'list' | 'trending' | 'search' | 'user' | 'bell' | 'refresh' | 'settings'
  | 'rabbit' | 'food' | 'water' | 'sleep' | 'play' | 'behavior' | 'logout' | 'close'
  | 'mail' | 'lock' | 'eye' | 'eyeOff' | 'userPlus' | 'login' | 'check' | 'alert' | 'info' | 'bulb' | 'calendar' | 'clock' | 'sun' | 'shield'

/**
 * Iconos de 24x24 en estilo bicolor redondeado: trazo del color del contenedor y un relleno suave
 * (el mismo color al 25 %), con esquinas y terminaciones redondas, acordes a la tipografía Fredoka.
 */
const soft = { fill: 'currentColor', fillOpacity: 0.25 } as const
const dot = { fill: 'currentColor', stroke: 'none' } as const

const PATHS: Record<IconName, ReactNode> = {
  home: <><path {...soft} d="M4 11.2 12 4l8 7.2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M9.8 21v-5a2.2 2.2 0 0 1 4.4 0v5" /><path d="M2.8 12 12 3.6l9.2 8.4" /></>,
  list: <><path {...soft} d="M3.6 12a8.4 8.4 0 1 0 2.6-6.1" /><path d="M3.5 3.8v4.7H8.2" /><path d="M12 7.6V12l3 1.9" /></>,
  trending: <><path {...soft} d="M4 19v-4.5l4-3.5 3.5 2.5 4.5-6 4 3.5V19z" stroke="none" /><path d="M4 4.5V19h16" /><path d="m7.5 14 3.7-3.7 2.8 2.4 5-5.8" /><path d="M16.2 6.9h2.8v2.8" /></>,
  search: <><circle {...soft} cx="10.5" cy="10.5" r="6.8" /><path d="m15.6 15.6 4.7 4.7" /><path d="m7.8 12 2-2.2 1.6 1.4 1.9-2.6" /></>,
  user: <><circle {...soft} cx="12" cy="8" r="4.2" /><path {...soft} d="M4.5 20.5c0-4.2 3.3-6.5 7.5-6.5s7.5 2.3 7.5 6.5z" /></>,
  bell: <><path {...soft} d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 2H4.4z" /><path d="M12 3.2V5" /><path d="M9.8 21a2.4 2.4 0 0 0 4.4 0" /></>,
  refresh: <><path d="M20 12a8 8 0 0 1-13.7 5.6" /><path d="M4 12a8 8 0 0 1 13.7-5.6" /><path d="M17.8 3v3.7h-3.7" /><path d="M6.2 21v-3.7h3.7" /><circle {...dot} cx="12" cy="12" r="1.6" /></>,
  settings: <><path d="M4 6h8.5M19 6h1M4 12h2.5M13.5 12H20M4 18h9M19.5 18h.5" /><circle {...soft} cx="15.7" cy="6" r="2.6" /><circle {...soft} cx="10" cy="12" r="2.6" /><circle {...soft} cx="16.2" cy="18" r="2.6" /></>,
  rabbit: <><path {...soft} d="M8.6 10.5C7 6.6 7.2 3 9 3s2.7 3.6 2.4 7.5" /><path {...soft} d="M15.4 10.5C17 6.6 16.8 3 15 3s-2.7 3.6-2.4 7.5" /><ellipse {...soft} cx="12" cy="15.2" rx="6.2" ry="5.6" /><circle {...dot} cx="9.7" cy="14.6" r="1" /><circle {...dot} cx="14.3" cy="14.6" r="1" /><path d="M11 17.3q1 .9 2 0" /></>,
  food: <><path {...soft} d="M12.2 6.8 17.4 12 3.8 20.2z" /><path d="m14.6 9.4 3.1-3.1" /><path d="M16.8 3.6c.2 1.7-.6 2.7-2.2 3M20.4 7.2c-1.700-.2-2.700.6-3 2.200" /><path d="m8 15.200 1.600 1.600" /></>,
  water: <><path {...soft} d="M12 3.4c3.600 4.200 6 7.300 6 10.600a6 6 0 0 1-12 0c0-3.300 2.400-6.400 6-10.600z" /><path d="M9.300 14.600a2.800 2.800 0 0 0 2.200 2.500" /></>,
  sleep: <><path {...soft} d="M20 14.600A8.200 8.200 0 0 1 9.400 4a8.200 8.200 0 1 0 10.600 10.600z" /><path d="M17.200 3.200v3.200M15.600 4.800h3.200" /></>,
  play: <><path {...soft} d="M12 12.300c-3 0-5.500 2.400-5.500 4.900 0 1.700 1.300 2.600 3 2.600.9 0 1.600-.4 2.500-.4s1.600.4 2.500.4c1.700 0 3-.9 3-2.600 0-2.500-2.500-4.900-5.500-4.900z" /><circle {...soft} cx="5.200" cy="10.400" r="1.900" /><circle {...soft} cx="9" cy="6.200" r="1.900" /><circle {...soft} cx="15" cy="6.200" r="1.900" /><circle {...soft} cx="18.800" cy="10.400" r="1.900" /></>,
  behavior: <><circle {...soft} cx="12" cy="12" r="9" /><path d="M8.300 14.200a4.200 4.200 0 0 0 7.400 0" /><circle {...dot} cx="9" cy="9.700" r="1.100" /><circle {...dot} cx="15" cy="9.700" r="1.100" /></>,
  logout: <><path {...soft} d="M4 5a2 2 0 0 1 2-2h4v18H6a2 2 0 0 1-2-2z" /><path d="M14 8l4 4-4 4M18 12H9.500" /></>,
  close: <path d="M6.500 6.500l11 11M17.500 6.500l-11 11" />,
  mail: <><rect {...soft} x="3" y="5" width="18" height="14" rx="3.500" /><path d="m4 7.500 8 5.500 8-5.500" /></>,
  lock: <><rect {...soft} x="4.500" y="10.500" width="15" height="10.500" rx="3" /><path d="M8 10.500V8a4 4 0 0 1 8 0v2.500" /><circle {...dot} cx="12" cy="15.700" r="1.300" /></>,
  eye: <><path {...soft} d="M2.500 12S6 5.500 12 5.500 21.500 12 21.500 12 18 18.500 12 18.500 2.500 12 2.500 12z" /><circle cx="12" cy="12" r="2.800" /></>,
  eyeOff: <><path d="M2.500 12S6 5.500 12 5.500c1.200 0 2.300.3 3.300.7M21.500 12s-1.500 2.800-4.100 4.700" /><path d="M3.500 3.500l17 17" /><path d="M9.800 9.800a2.800 2.800 0 0 0 4 4M6.700 7.300C4 9 2.500 12 2.500 12S6 18.500 12 18.500c1.300 0 2.500-.3 3.500-.8" /></>,
  userPlus: <><circle {...soft} cx="9" cy="8" r="4.200" /><path {...soft} d="M2.200 20.500c0-4 3-6.300 6.800-6.300s6.800 2.300 6.800 6.300z" /><path d="M19 7.500v6M16 10.500h6" /></>,
  check: <><circle {...soft} cx="12" cy="12" r="9" /><path d="m8 12.300 2.800 2.800L16.200 9.300" /></>,
  alert: <><path {...soft} d="M10.300 4.100 2.800 17.200A2 2 0 0 0 4.500 20.200h15a2 2 0 0 0 1.700-3L13.700 4.100a2 2 0 0 0-3.400 0z" /><path d="M12 9.500v4" /><circle {...dot} cx="12" cy="16.800" r="1" /></>,
  info: <><circle {...soft} cx="12" cy="12" r="9" /><path d="M12 11v5.200" /><circle {...dot} cx="12" cy="7.800" r="1.100" /></>,
  bulb: <><path {...soft} d="M9 17.500v-1.200C7.200 15.200 6 13.400 6 11.300a6 6 0 0 1 12 0c0 2.100-1.200 3.900-3 5v1.200z" /><path d="M9.500 21h5M10 19.300h4" /></>,
  calendar: <><rect {...soft} x="3.500" y="5" width="17" height="15.500" rx="3" /><path d="M3.500 10h17M8 3v4M16 3v4" /></>,
  clock: <><circle {...soft} cx="12" cy="12" r="9" /><path d="M12 7v5l3.200 2" /></>,
  sun: <><circle {...soft} cx="12" cy="12" r="4.200" /><path d="M12 2.500v2M12 19.500v2M2.500 12h2M19.500 12h2M5.300 5.300l1.400 1.400M17.300 17.300l1.400 1.400M18.700 5.300l-1.400 1.400M6.700 17.300l-1.400 1.400" /></>,
  shield: <><path {...soft} d="M12 3 4.500 6v5.500c0 4.600 3.100 8.200 7.500 9.500 4.400-1.300 7.500-4.900 7.500-9.500V6z" /><path d="m8.800 12.200 2.200 2.200 4.200-4.400" /></>,
  login: <><path {...soft} d="M15 3h3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-3z" /><path d="m10 16.500 4.500-4.500L10 7.500M14.500 12H3" /></>,
}

/** Mapeo de cada variable de hábito a su icono. */
export const HABIT_ICON = {
  FOOD: 'food', WATER: 'water', SLEEP: 'sleep', PLAY: 'play', BEHAVIOR: 'behavior',
} as const satisfies Record<string, IconName>

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"
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
  border?: 'ink' | 'gray' | 'light'
  /** Color del icono (blanco por defecto; oscuro sobre fondos claros como el amarillo). */
  fg?: string
  size?: number
  className?: string
}

/** Icono blanco sobre un mosaico de la paleta con borde negro o gris. Decorativo (aria-hidden). */
export function IconTile({ name, color = TILE.teal, border = 'ink', fg, size = 40, className }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('icon-tile', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        color: fg,
        borderRadius: Math.round(size * 0.22),
        border: `1.5px solid ${border === 'ink' ? TILE.ink : border === 'light' ? 'rgb(255 255 255 / 0.45)' : TILE.gray}`,
      }}
    >
      <Icon name={name} size={Math.round(size * 0.52)} />
    </span>
  )
}

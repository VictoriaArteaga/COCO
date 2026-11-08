import type { Config } from 'tailwindcss'

/** Color tomado de una variable CSS (tripleta RGB) para que el tema claro/oscuro cambie todas las utilidades. */
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ─── COCO Design Tokens (valores en app/globals.css, claro y oscuro) ──────
      colors: {
        // Turquesa de marca (superficies grandes e iconos) y menta
        green: {
          DEFAULT: v('green'),
          dark: v('green-dark'),
          light: v('green-light'),
          bright: v('green-bright'),
        },
        // Verde azulado profundo (antes morado): botones principales y títulos
        purple: {
          DEFAULT: v('purple'),
          dark: v('purple-dark'),
          light: v('purple-light'),
        },
        // Coral: acción destacada y alertas
        coral: {
          DEFAULT: v('coral'),
          light: v('coral-light'),
        },
        // Amarillo: acento cálido de marca (botón principal, detalles)
        yellow: {
          DEFAULT: v('yellow'),
          dark: v('yellow-dark'),
        },
        // Fondos
        surface: v('surface'),
        cream: v('surface'),
        card: v('card'),
        white: '#FFFFFF',
        // Texto fijo sobre superficies turquesa (igual en ambos temas)
        deep: '#2B1B12',
        // Título de marca (verde profundo en claro, menta en oscuro)
        title: v('title'),
        // Bordes de iconos y controles: tinta casi negra y grises (claros en oscuro)
        ink: v('ink'),
        line: v('line'),
        mute: v('mute'),
        // Text
        text: {
          DEFAULT: v('text'),
          secondary: v('text-secondary'),
        },
        // Semantic states
        state: {
          normal: v('state-normal'),
          attention: v('state-attention'),
          alert: v('state-alert'),
          info: v('state-info'),
          offline: v('state-offline'),
        },
        // Habit type variables
        habit: {
          food: '#C4600F',
          water: '#1B7FB5',
          sleep: '#4B55B5',
          play: '#D6334F',
          behavior: '#2E7D50',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-rounded', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Esquinas suaves pero más rectas: se redefine la escala de Tailwind y las medidas del proyecto
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        '3xl': '14px',
        coco: '10px',
        sheet: '14px',
      },
    },
  },
  plugins: [],
}

export default config

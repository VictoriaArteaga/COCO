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
        // Fondos
        surface: v('surface'),
        cream: v('surface'),
        card: v('card'),
        white: '#FFFFFF',
        // Texto fijo sobre superficies turquesa (igual en ambos temas)
        deep: '#0B2E2A',
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
          food: '#0B8A72',
          water: '#2A78AE',
          sleep: '#3B5BA9',
          play: '#D0406A',
          behavior: '#B85F0E',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-rounded', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        coco: '18px',
        sheet: '28px',
      },
    },
  },
  plugins: [],
}

export default config

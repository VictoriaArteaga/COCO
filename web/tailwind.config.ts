import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ─── COCO Design Tokens ──────────────────────────────────────────────────
      colors: {
        // Brand greens
        green: {
          DEFAULT: '#356B55',
          dark: '#244C3C',
          light: '#DCEBE2',
        },
        // Neutral backgrounds
        surface: '#F7F5EF',
        cream: '#F7F5EF',
        white: '#FFFFFF',
        // Text
        text: {
          DEFAULT: '#26332D',
          secondary: '#65716B',
        },
        // Semantic states
        state: {
          normal: '#2E7D5B',
          attention: '#B7791F',
          alert: '#B5483A',
          info: '#3B6EA5',
          offline: '#7A8580',
        },
        // Habit type variables
        habit: {
          food: '#5B8E69',
          water: '#4387A8',
          sleep: '#70659A',
          play: '#C4778C',
          behavior: '#C87945',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        coco: '12px',
      },
    },
  },
  plugins: [],
}

export default config

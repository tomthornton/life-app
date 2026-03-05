import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mind:    '#6366f1',
        body:    '#22c55e',
        spirit:  '#f59e0b',
        surface: 'var(--color-surface)',
        card:    'var(--color-card)',
        border:  'var(--color-border)',
        base:    'var(--color-bg)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        logo: ['var(--font-logo)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config

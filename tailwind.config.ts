import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-dark)',
          soft: 'var(--brand-soft)',
          ink: 'var(--brand-ink)',
        },
        bg: {
          DEFAULT: 'var(--bg)',
          2: 'var(--bg-2)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        border: 'var(--border)',
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
        },
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        amber: 'var(--amber)',
        red: 'var(--red)',
        blue: 'var(--blue)',
        purple: 'var(--purple)',
      },
      borderRadius: {
        btn: '8px',
        card: '12px',
      },
      boxShadow: {
        ring: '0 0 0 3px var(--brand-glow)',
        card: '0 1px 3px rgba(0,0,0,0.4)',
      },
      keyframes: {
        fadeup: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeup: 'fadeup 0.3s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;

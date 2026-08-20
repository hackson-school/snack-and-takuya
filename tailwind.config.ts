import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['var(--font-game)', 'monospace', 'sans-serif'],
      },
      keyframes: {
        'slide-in-top': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-out-top': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        'flash': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        'scan-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-8px)' },
          '80%': { transform: 'translateX(8px)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-fast': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      },
      animation: {
        'slide-in-top': 'slide-in-top 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-out-top': 'slide-out-top 0.25s cubic-bezier(0.7, 0, 0.84, 0) forwards',
        'flash': 'flash 0.15s ease-in-out 3',
        'scan-line': 'scan-line 1.5s linear infinite',
        'shake': 'shake 0.4s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-fast': 'pulse-fast 0.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config

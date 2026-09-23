/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        visor: {
          bg: '#f8fafc',
          surface: '#ffffff',
          ink: '#0f172a',
          'ink-subtle': '#334155',
          mist: '#64748b',
          dim: '#94a3b8',
          line: '#e2e8f0',
          'line-strong': '#cbd5e1',
          tide: '#0284c7',       // electric visor blue
          'tide-deep': '#0369a1',
          foam: '#e0f2fe',
          glow: 'rgba(2, 132, 199, 0.15)',
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          resolved: '#10b981',
        }
      },
      animation: {
        'scan': 'scanLine 2.5s ease-in-out infinite alternate',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
      },
      keyframes: {
        scanLine: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(6px)' },
        }
      }
    },
  },
  plugins: [],
}

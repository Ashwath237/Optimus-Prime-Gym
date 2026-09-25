/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber-green': '#00ff88',
        'cyber-cyan': '#00d9ff',
        'beast-pink': '#ff0055',
        'amber-gold': '#ffb703',
        'obsidian': '#080b14',
        'panel-dark': '#0f1426',
        'panel-card': '#141a33',
        'border-dim': '#222b4c',
        'border-glow': '#2d3b66',
        'text-muted': '#94a3b8'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 15px rgba(0, 255, 136, 0.6))' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 5px rgba(0, 255, 136, 0.2))' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}

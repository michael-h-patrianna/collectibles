/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark premium theme palette
        background: '#0f172a', // Slate 900
        surface: '#1e293b', // Slate 800
        primary: '#3b82f6', // Blue 500
        primaryLight: '#60a5fa', // Blue 400 - For better contrast
        secondary: '#64748b', // Slate 500
        accent: '#f59e0b', // Amber 500 (Gold)
        
        // Rarity colors
        rarity: {
          common: '#94a3b8', // Slate 400
          rare: '#3b82f6', // Blue 500
          epic: '#a855f7', // Purple 500
          legendary: '#f59e0b', // Amber 500
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px 0px rgba(245, 158, 11, 0.5)' },
          '50%': { opacity: .8, boxShadow: '0 0 20px 5px rgba(245, 158, 11, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
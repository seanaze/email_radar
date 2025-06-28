/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        secondary: {
          500: '#06b6d4',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          400: '#f59e42',
        },
        error: {
          500: '#ef4444',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.6)',
          dark: 'rgba(30, 41, 59, 0.6)',
        },
      },
      backdropBlur: {
        'glass': '16px',
      },
      boxShadow: {
        'glass': '0 4px 32px rgba(30, 41, 59, 0.12)',
      },
      borderColor: {
        'glass': 'rgba(100, 116, 139, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
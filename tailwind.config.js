/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hazard: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          900: '#7f1d1d',
        },
        safe: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        caution: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          900: '#78350f',
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        xbox: {
          green: '#107C10',
          dark: '#1a1a1a',
          darker: '#111111',
          light: '#2f2f2f',
        }
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

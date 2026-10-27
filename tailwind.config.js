/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0b0b0b',
          muted: '#737373',
        },
        stone: {
          1: '#f4f4f2',
          2: '#bdbdb9',
        },
        surface: '#f3f3f1',
        line: '#e3e3e0',
        accent: '#e8461e',
        'on-ink': '#ffffff',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        'dm-sans': ['"DM Sans"', 'sans-serif'],
        didact: ['"Didact Gothic"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.06em',
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.04em',
        widest: '0.28em',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Limewash ground and plaster surfaces
        lime: '#ECEBE5',
        plaster: '#F6F5F1',
        // Wet stone text, mist secondary
        ink: {
          DEFAULT: '#1D201E',
          muted: '#6E736D',
        },
        stone: {
          1: '#E3E2DB',
          2: '#B9B8B0',
        },
        surface: '#F6F5F1',
        line: '#D2D1C9',
        kadappa: '#202421',
        // Monsoon moss: the single accent, used for focus and active state
        accent: '#4B5B45',
        'on-ink': '#ECEBE5',
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        'dm-sans': ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        didact: ['"Didact Gothic"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter: '-0.03em',
        tight: '-0.015em',
        wide: '0.04em',
        widest: '0.28em',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

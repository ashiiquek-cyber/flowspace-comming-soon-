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
          muted: '#5F645E',
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
        // CMS (admin panel): neutral white workspace, separate from the limewash site
        cms: {
          bg: '#FFFFFF',
          ink: '#0B0B0B',
          muted: '#666666',
          'stone-1': '#D9D9D6',
          'stone-3': '#8C8C88',
          line: '#E3E3E0',
          surface: '#F3F3F1',
          accent: '#E8461E',
        },
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        didact: ['"Didact Gothic"', 'sans-serif'],
        cms: ['"DM Sans"', 'system-ui', 'sans-serif'],
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

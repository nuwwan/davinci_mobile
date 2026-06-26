/** @type {import('tailwindcss').Config} */

/**
 * Mirrors davinci_web/tailwind.config.js so both platforms share the same
 * semantic class names (bg-primary, text-t-secondary, border-border, etc.).
 * Color values come from CSS variables defined in global.css (light + dark).
 */
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: v('--color-primary'),
          hover: v('--color-primary-hover'),
          light: v('--color-primary-light'),
          muted: v('--color-primary-muted'),
        },
        secondary: {
          DEFAULT: v('--color-secondary'),
          light: v('--color-secondary-light'),
        },
        surface: {
          DEFAULT: v('--color-surface'),
          2: v('--color-surface-2'),
          3: v('--color-surface-3'),
        },
        border: {
          DEFAULT: v('--color-border'),
          strong: v('--color-border-strong'),
        },
        t: {
          primary: v('--color-text-primary'),
          secondary: v('--color-text-secondary'),
          tertiary: v('--color-text-tertiary'),
          inverse: v('--color-text-inverse'),
        },
        correct: {
          DEFAULT: v('--color-correct'),
          bg: v('--color-correct-bg'),
          border: v('--color-correct-border'),
        },
        wrong: {
          DEFAULT: v('--color-wrong'),
          bg: v('--color-wrong-bg'),
          border: v('--color-wrong-border'),
        },
        streak: {
          DEFAULT: v('--color-streak'),
          bg: v('--color-streak-bg'),
        },
        scrim: v('--color-scrim'),
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
        full: '9999px',
      },
      fontFamily: {
        // Body — Inter
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        // Display — Plus Jakarta Sans
        display: ['PlusJakartaSans_700Bold'],
        'display-semibold': ['PlusJakartaSans_600SemiBold'],
      },
      fontSize: {
        'page-title': ['32px', '38px'],
        section: ['24px', '31px'],
        'card-title': ['18px', '25px'],
        question: ['15px', '23px'],
        body: ['14px', '21px'],
        meta: ['13px', '19px'],
        hint: ['12px', '17px'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */

/**
 * DaVinci design system — Tailwind/NativeWind theme.
 * Colors resolve to CSS variables in global.css (light + dark), so every class
 * (bg-primary, text-t-secondary, border-error-border …) flips with the color scheme.
 * Mirror of src/theme (colors.ts / typography.ts / tokens.ts).
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
        accent: {
          DEFAULT: v('--color-accent'),
          light: v('--color-accent-light'),
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
        success: {
          DEFAULT: v('--color-success'),
          bg: v('--color-success-bg'),
          border: v('--color-success-border'),
        },
        error: {
          DEFAULT: v('--color-error'),
          bg: v('--color-error-bg'),
          border: v('--color-error-border'),
        },
        scrim: v('--color-scrim'),
      },
      borderRadius: {
        xs: '4px',
        sm: '8px', // inputs, option letter badge
        md: '12px', // MCQ options, toasts, banners, search bar
        lg: '16px', // buttons, list cards, stat tiles
        xl: '20px', // section cards, bottom sheets
        '2xl': '28px', // hero cards (auth form, daily question)
        full: '9999px',
      },
      spacing: {
        gutter: '16px',
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        display: ['PlusJakartaSans_700Bold'],
        'display-semibold': ['PlusJakartaSans_600SemiBold'],
      },
      fontSize: {
        'display-lg': ['40px', '48px'],
        'page-title': ['32px', '38px'],
        section: ['24px', '31px'],
        'card-title': ['18px', '25px'],
        question: ['15px', '23px'],
        button: ['15px', '18px'],
        body: ['14px', '21px'],
        'body-tight': ['14px', '20px'],
        meta: ['13px', '19px'],
        hint: ['12px', '17px'],
        badge: ['12px', '15px'],
        tab: ['11px', '13px'],
      },
    },
  },
  plugins: [],
};

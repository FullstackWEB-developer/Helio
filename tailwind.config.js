module.exports = {
  purge: {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    options: {
      safelist: {
        greedy: [/^grid-cols-/, /^col-span-/, /^top-/]
      }
    }
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '4.5':'1.125rem',
        '8.5':'2.125rem',
         '62': '15.5rem',
        '88': '22rem'
      },
      textColor: {
        primary : {
          DEFAULT: "var(--color-text-primary)"
        }
      },
      backgroundColor: {
        primary : {
          DEFAULT: "var(--color-bg-primary)",
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary: {
          DEFAULT: "var(--color-bg-secondary)",
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
        },
        default: "var(--color-bg-default)",
        inverse: "var(--color-bg-inverse)"
      },
      colors: {
        primary : {
          DEFAULT: "var(--color-primary-default)",
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary : {
          DEFAULT: "var(--color-secondary-default)",
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
        },
        helio_white: 'var(--color-white)',
        helio_dark_gray: 'var(--dark-gray)',
        helio_gray50: 'var(--color-gray50)',
        helio_red: 'var(--color---color-red)',
        helio_yellow: 'var(--color-yellow)',
        helio_helio_gray: 'var(--color-gray)',
        helio_warm_green: 'var(--color-warm-green)',
      }
    }
  },
  variants: {
    extend: {
      borderWidth: ['hover'],
    },
    backgroundColor: ['active', 'hover'],
  },
  plugins: [],
}

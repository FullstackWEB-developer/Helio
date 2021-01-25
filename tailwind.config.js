module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Roboto'],
      serif: ["Roboto"],
      mono: ["Roboto"],
      display: ["Roboto"],
      body: ["Roboto"]
    },
    extend: {
      fontSize: {
        base: "0.875rem"
      },
      spacing: {
        '18': '4.5rem'
      },
      height: {
        '120': '36rem'
      },
      textColor: {
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        default: "var(--color-text-default)",
        "default-soft": "var(--color-text-default-soft)",
        inverse: "var(--color-text-inverse)",
        "inverse-soft": "var(--color-text-inverse-soft)"
      },
      backgroundColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        default: "var(--color-bg-default)",
        inverse: "var(--color-bg-inverse)"
      },
    }
  },
  variants: {
    extend: {},
    backgroundColor: ['active', 'hover'],
  },
  plugins: [],
}

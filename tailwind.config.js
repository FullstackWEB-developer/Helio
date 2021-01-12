module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

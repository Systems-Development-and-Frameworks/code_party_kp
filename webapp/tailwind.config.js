module.exports = {
  purge: ['./components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',],
  darkMode: false, // or 'media' or 'class'
  theme: {
    inset: {
      '0': 0,
      '-16': '-4rem',
    },
    extend: {},
  },
  variants: {
    extend: {},
    inset: ['hover', 'focus'],
  },
  plugins: [],
}

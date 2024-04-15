/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["./templates/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        '2md': '1200px',
        'xs': '400px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

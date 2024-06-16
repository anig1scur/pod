/** @type {import('tailwindcss').Config} */
module.exports = {
  mod: "jit",
  content: ["./index.html", "./src/**/*.{css,ts,tsx}"],
  darkMode: ['media', "class", "[data-theme='dark']"],
  theme: {
    extend: {},
  },
  plugins: [],
}


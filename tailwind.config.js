/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#071B33',
        'teal-primary': '#00bfa5'
      }
    },
  },
  plugins: [],
}
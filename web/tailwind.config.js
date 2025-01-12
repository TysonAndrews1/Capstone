/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", './public/index.html'
  ],
  theme: {
    extend: {
      colors: { // Corrected from 'color' to 'colors'
        'shift-blue': '#3F6D89',
      },
    },
  },
  plugins: [],
}


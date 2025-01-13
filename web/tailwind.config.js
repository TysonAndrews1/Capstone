/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", './public/index.html'
  ],
  theme: {
    extend: {
      colors: { 
        'hover-blue': '#3F6D89',
        'main-blue': '#32576d',
      },
    },
  },
  plugins: [],
}


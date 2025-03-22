/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgp: '#E0E5B6', // Example custom color
        bgs: '#24251D', // Another custom color
        btnp: '#73802A',
        btns: '#CAAD7E'
      },
      fontFamily: {
        raleway: ['raleway', 'sans-serif'], // Replace "YourCustomFont" with your font name
      },
    },
  },
  plugins: [],
}
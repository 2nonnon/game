/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: ['grid-cols-[repeat(9,1fr)]', 'grid-cols-[repeat(16,1fr)]'],
}

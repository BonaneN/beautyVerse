/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-apricot': '#F9DBBD',
        'cotton-candy': '#FFA5AB',
        'blush-rose': '#DA627D',
        'berry-crush': '#A53860',
        'night-bordeaux': '#450920',
      },
      fontFamily: {
        'body': ['Inter', 'sans-serif'],
        'heading': ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 14px 28px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.1)',
        'soft': '0 4px 12px rgba(69, 9, 32, 0.08)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'status-blue': '#1e40af',
        'status-orange': '#ea580c',
        'status-green': '#16a34a',
        'status-red': '#dc2626',
      }
    },
  },
  plugins: [],
}
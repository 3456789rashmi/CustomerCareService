/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',   // Deep Trust Blue
        secondary: '#06b6d4', // Bright Cyan
      },
    },
  },
  plugins: [],
}
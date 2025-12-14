/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0EA5E9",
        secondary: "#EC4899",
        accent: "#06B6D4",
        light: "#7DD3FC",
        neutral: "#F0F9FF",
        dark: "#0284C7",
        muted: "#38BDF8",
        brown: "#8B4513",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B0A45",
        secondary: "#5E4F82",
        accent: "#A888B5",
        light: "#F1BCCF",
        neutral: "#FDF8FA",
        dark: "#2D0A35",
        muted: "#8174A0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

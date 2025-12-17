/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F5A623",
        primaryDark: "#E39A1E",
        navy: "#1F2937",
        navyLight: "#2B3445",
        textDark: "#111827",
        textMuted: "#6B7280",
        bgLight: "#F2F2F2",
        beige: "#EAD9B5",
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
      },
      fontSize: {
        'sm': '0.95rem',
        'base': '1.05rem',
        'lg': '1.15rem',
        'xl': '1.3rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '2.75rem',
        '6xl': '3.5rem',
      },
    },
  },
  plugins: [],
};

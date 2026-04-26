/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Activează controlul prin clasă
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        baby: {
          blue: "#89CFF0",
          light: "#B8E2F2",
          lighter: "#E0F4FF",
          dark: "#5BB4D9",
        },
        status: {
          accepted: "#22c55e",
          rejected: "#ef4444",
          pending: "#eab308",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

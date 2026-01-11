/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: "#0df2f2",
        "background-light": "#f5f8f8",
        "background-dark": "#102222",
      },
      fontFamily: {
        display: ["Inter", "Segoe UI", "Tahoma", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px"
      }
    },
  },
  plugins: [],
};
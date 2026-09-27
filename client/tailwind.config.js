/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pine: {
          50: "#EAF1EF",
          100: "#CFE0DC",
          300: "#5D8F87",
          500: "#0F3D3E",
          600: "#0C3233",
          700: "#092627",
          900: "#051718",
        },
        amber: {
          50: "#FDF3E3",
          100: "#F8DFAF",
          300: "#EEBB6A",
          500: "#E8A33D",
          600: "#C9852A",
          700: "#9C6820",
        },
        coral: {
          50: "#FCEAE7",
          300: "#F1A99E",
          500: "#E85D4F",
          600: "#CB4638",
          700: "#A0362B",
        },
        linen: "#F0F2EE",
        ink: "#16211D",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px -8px rgba(15, 61, 62, 0.25)",
      },
    },
  },
  plugins: [],
};

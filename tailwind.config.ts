import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        army: {
          50:  "#f4f5ec",
          100: "#e5e9cb",
          200: "#ccd29a",
          300: "#b0bc68",
          400: "#94a63f",
          500: "#788c28",
          600: "#5d6e1e",
          700: "#4b5820",
          800: "#3a441a",
          900: "#2c3314",
          950: "#1b200b",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

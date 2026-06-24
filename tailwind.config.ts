import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          850: "#1a4a2e",
          900: "#14381f",
          950: "#0d2614",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

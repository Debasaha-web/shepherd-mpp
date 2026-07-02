import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal:    "#2b2b2b",
        slate:       "#4a4a4a",
        gold:        "#b08d3c",
        "gold-soft": "#d9c28a",
        cream:       "#f6f3ec",
        white:       "#ffffff",
        green:       "#3a5a40",
        scripture:   "#6b5b3e",
        border:      "#e0d9cc",
      },
      fontFamily: {
        display: ["var(--font-source)", "Georgia", "Cambria", "serif"],
        head:    ["var(--font-oswald)", "system-ui", "sans-serif"],
        body:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        app: "430px",
      },
    },
  },
  plugins: [],
};

export default config;

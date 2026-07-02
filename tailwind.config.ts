import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:        "#0a1322",
        "navy-card": "#0f1e30",
        border:      "#1c2d44",
        gold:        "#c8a04a",
        "gold-dark": "#b8902f",
        cream:       "#e8e4da",
        muted:       "#8a9aaa",
        green:       "#5a9a4a",
        red:         "#c84a4a",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "'Times New Roman'", "serif"],
        head:    ["system-ui", "-apple-system", "'Segoe UI'", "Roboto", "Helvetica", "Arial", "sans-serif"],
        body:    ["system-ui", "-apple-system", "'Segoe UI'", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        app: "430px",
      },
    },
  },
  plugins: [],
};

export default config;

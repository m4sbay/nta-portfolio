import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--brand)",
          light: "var(--brand-light)",
          surface: "var(--brand-surface)"
        },
        background: "var(--background)",
        card: "var(--card)",
        hover: "var(--hover)",
        focus: "var(--focus)",
        foreground: "var(--foreground)",
        "foreground-strong": "var(--foreground-strong)",
        muted: "var(--muted)",
        surface: "var(--background)",
        "border-subtle": "var(--border)",
        "border-control": "var(--border-control)"
      },
      boxShadow: {
        soft: "0 2px 8px #17171706",
        avatar: "0 2px 8px #1717170d"
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        dm: ["var(--font-dm)", "sans-serif"]
      },
      keyframes: {
        "lanyard-drop": {
          "0%": { opacity: "0", transform: "translateY(-65vh)" },
          "72%": { opacity: "1", transform: "translateY(3vh)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "lanyard-drop": "lanyard-drop 1100ms cubic-bezier(0.2, 0.9, 0.24, 1) both"
      }
    }
  },
  plugins: []
};

export default config;

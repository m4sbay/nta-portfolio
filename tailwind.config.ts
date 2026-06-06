import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#9FA1FF",
          light: "#B5BAFF",
          surface: "#EEEEFF"
        }
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        dm: ["var(--font-dm)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

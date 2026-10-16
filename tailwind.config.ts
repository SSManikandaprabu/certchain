import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        surface: "#0E0E10",
        border: "rgba(255, 255, 255, 0.08)",
        "border-light": "rgba(255, 255, 255, 0.14)",
        ink: "#FAFAFA",
        muted: "#A7A6A6",
        nav: "#B6B5B5",
        accent: {
          emerald: "#10B981",
          red: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        sora: ["var(--font-sora)", "sans-serif"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      borderRadius: {
        "14": "14px",
      },
    },
  },
  plugins: [],
};
export default config;

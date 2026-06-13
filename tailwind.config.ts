import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables defined in globals.css so light/dark
        // share one source of truth.
        sand: "rgb(var(--c-sand) / <alpha-value>)",
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        terracotta: "rgb(var(--c-terracotta) / <alpha-value>)",
        olive: "rgb(var(--c-olive) / <alpha-value>)",
        sea: "rgb(var(--c-sea) / <alpha-value>)",
        clay: "rgb(var(--c-clay) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(60, 40, 25, 0.06), 0 12px 30px -12px rgba(60, 40, 25, 0.22)",
        soft: "0 1px 2px rgba(60, 40, 25, 0.05), 0 6px 16px -8px rgba(60, 40, 25, 0.18)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease both",
      },
    },
  },
  plugins: [],
};

export default config;

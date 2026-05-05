import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map Tailwind color names to CSS variables so you only change
        // the variables in globals.css (which mirrors theme.ts).
        primary: {
          DEFAULT:    "var(--color-primary)",
          hover:      "var(--color-primary-hover)",
          foreground: "var(--color-primary-fg)",
        },
        accent: {
          DEFAULT:    "var(--color-accent)",
          foreground: "var(--color-accent-fg)",
        },
        highlight:   "var(--color-highlight)",
        background:  "var(--color-background)",
        foreground:  "var(--color-foreground)",
        muted: {
          DEFAULT:    "var(--color-muted)",
          foreground: "var(--color-muted-fg)",
        },
        border:      "var(--color-border)",
        ring:        "var(--color-ring)",
        success:     "var(--color-success)",
        destructive: "var(--color-destructive)",
        warning:     "var(--color-warning)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      screens: {
        xs: "480px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

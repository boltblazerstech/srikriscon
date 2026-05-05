import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover:   "var(--color-primary-hover)",
          light:   "var(--color-primary-light)",
          fg:      "var(--color-primary-fg)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          light:   "var(--color-destructive-light)",
          fg:      "var(--color-destructive-fg)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          light:   "var(--color-success-light)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          light:   "var(--color-warning-light)",
        },
        sidebar: {
          DEFAULT: "var(--color-sidebar)",
          active:  "var(--color-sidebar-active)",
          fg:      "var(--color-sidebar-fg)",
          muted:   "var(--color-sidebar-muted)",
        },
        surface:          "var(--color-surface)",
        background:       "var(--color-background)",
        foreground:       "var(--color-foreground)",
        border:           "var(--color-border)",
        muted:            "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        ring:             "var(--color-ring)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;

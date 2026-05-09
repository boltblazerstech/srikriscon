/**
 * ─── BRAND THEME ─────────────────────────────────────────────────────────────
 * Single file to customise per client.
 * Colors → also reflected as CSS variables in globals.css.
 * Font   → name here is for reference; update the next/font import in
 *          app/layout.tsx to actually change the loaded typeface.
 */
export const theme = {
  // ── Colors ────────────────────────────────────────────────────────────────
  colors: {
    primary:           "#0B3A42", // Deep Teal — headers, navbar, footer, primary buttons
    primaryHover:      "#0F505B",
    primaryForeground: "#FFFFFF", // text on primary bg

    accent:            "#E6007E", // Bright Pink — CTA buttons, links, hover states, badges
    accentForeground:  "#FFFFFF",

    highlight:         "#B5A57A", // Muted Beige — hero sections, highlights

    background:        "#FFFFFF", // main background for product sections
    foreground:        "#333333", // body text

    muted:             "#F5F5F5", // Light Gray — secondary backgrounds and cards
    mutedForeground:   "#666666", // secondary text, placeholders

    border:            "#E0E0E0",
    ring:              "#0B3A42", // focus ring

    success:           "#16a34a",
    destructive:       "#dc2626",
    warning:           "#d97706",
  },

  // ── Typography ────────────────────────────────────────────────────────────
  // Keep in sync with the next/font import in app/layout.tsx
  font: {
    sans:    "Inter",
    display: "Playfair Display",
  },

  // ── Business info ─────────────────────────────────────────────────────────
  business: {
    name:           "Sri Kriscon",
    tagline:        "Quality products delivered fast",
    phone:          "+91 98765 43210",
    /** Digits only, with country code — used for wa.me link */
    whatsapp:       "919876543210",
    email:          "hello@mystore.com",
    address:        "123, Main Street, Mumbai, Maharashtra 400001",
    gst:            "GSTIN: 27XXXXX1234X1Z5",
    currency:       "INR",
    currencySymbol: "₹",
    /** Social handles — set to "" to hide */
    instagram:      "https://instagram.com/mystore",
    facebook:       "https://facebook.com/mystore",
    twitter:        "",
    youtube:        "",
  },

  // ── Navigation links ──────────────────────────────────────────────────────
  nav: [
    { label: "Home",       href: "/" },
    { label: "Products",   href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "About",      href: "/about" },
    { label: "Contact",    href: "/contact" },
  ],
} as const;

export type ThemeColors = typeof theme.colors;
export type NavLink = (typeof theme.nav)[number];

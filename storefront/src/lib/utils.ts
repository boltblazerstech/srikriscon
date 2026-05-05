import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { theme } from "@/src/config/theme";

/** Merge Tailwind classes safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency using the brand currency from theme. */
export function formatPrice(
  amount: number,
  currency = theme.business.currency,
  locale = "en-IN"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date string to a human-readable short date. */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
  locale = "en-IN"
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(dateString));
}

/** Slugify a string (client-side, for display only). */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Return the primary image URL from a product image array. */
export function getPrimaryImage(images: { url: string; primary: boolean }[]) {
  return (
    images.find((img) => img.primary)?.url ?? images[0]?.url ?? null
  );
}

/** Build a WhatsApp `wa.me` link with an optional pre-filled message. */
export function whatsappLink(phone: string, message?: string) {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Truncate text to `maxLength` chars with an ellipsis. */
export function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + "…" : text;
}

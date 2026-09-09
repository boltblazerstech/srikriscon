import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string, fmt = "dd-MM-yyyy"): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  return formatDate(dateStr, "dd-MM-yyyy hh:mm a");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function cleanErrorMessage(msg: string): string {
  if (!msg) return "An unexpected error occurred. Please try again.";
  const lower = msg.toLowerCase();
  
  if (lower.includes("json parse") || lower.includes("malformed json") || lower.includes("cannot deserialize")) {
    return "Invalid data format received. Please check your inputs.";
  }
  if (lower.includes("constraint") || lower.includes("sql") || lower.includes("foreign key") || lower.includes("duplicate entry")) {
    if (lower.includes("duplicate") || lower.includes("already exists")) {
      return "This record or value already exists.";
    }
    return "A database conflict occurred. Please verify your data.";
  }
  if (lower.includes("nullpointer") || lower.includes("exception") || lower.includes("java.") || lower.includes("hibernate")) {
    return "Internal server error. Please contact support.";
  }
  if (lower.includes("jwt expired") || lower.includes("token expired")) {
    return "Your session has expired. Please log in again.";
  }
  if (lower.includes("access is denied") || lower.includes("forbidden") || lower.includes("unauthorized")) {
    return "You do not have permission to perform this action.";
  }
  if (lower.includes("network error") || lower.includes("timeout") || lower.includes("failed to fetch")) {
    return "Network connection issue. Please check your internet connection.";
  }
  return msg;
}

export function extractApiError(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as { response?: { data?: { message?: string } }; message?: string };
    const rawMessage = e.response?.data?.message ?? e.message ?? "An error occurred";
    return cleanErrorMessage(rawMessage);
  }
  return "An error occurred";
}

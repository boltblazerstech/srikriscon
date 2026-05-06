"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "@/src/config/theme";
import { useCart } from "@/src/hooks/useCart";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-zinc-950/95 backdrop-blur-sm shadow-sm"
          : "bg-zinc-950"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Brand ─────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <Image 
              src="/sri-kriscon-logo.webp" 
              alt={theme.business.name} 
              width={120}
              height={48}
              className="h-12 w-auto object-contain"
            />
            <span className="text-white font-bold text-lg sm:text-xl tracking-tight whitespace-nowrap">
              SRI KRISCON INDUSTRIES
            </span>
          </Link>

          {/* ── Desktop nav links ──────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {theme.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ──────────────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Link
              href="/search"
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="My account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {hydrated && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-zinc-800 bg-zinc-950"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {theme.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-white bg-white/10 font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

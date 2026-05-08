"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  Package,
  Settings,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "@/src/config/theme";
import { useCart } from "@/src/hooks/useCart";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { count, hydrated } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ── Cart spring bounce ────────────────────────────────────────────────────
  const [cartBump, setCartBump] = useState(0);
  const prevCountRef = useRef(count);
  useEffect(() => {
    if (hydrated && count > prevCountRef.current) setCartBump((b) => b + 1);
    prevCountRef.current = count;
  }, [count, hydrated]);

  // ── Scroll shadow ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close menus on route change ───────────────────────────────────────────
  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [pathname]);

  // ── Close user menu on outside click ─────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  // User display name / initials
  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : "";
  const initials = user?.firstName
    ? (user.firstName[0] + (user.lastName?.[0] ?? "")).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-zinc-950/95 backdrop-blur-sm shadow-sm" : "bg-zinc-950"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Brand ──────────────────────────────────────────────────── */}
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

          {/* ── Desktop nav ────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {theme.nav.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                    isActive ? "text-white" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-px bg-accent rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ───────────────────────────────────────────── */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <Link
              href="/search"
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Account — authenticated: avatar dropdown; guest: sign-in link */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Account menu"
                >
                  <span className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                    {initials}
                  </span>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", userMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account/overview"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/account/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-zinc-800 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <User className="h-4 w-4" />
                Sign in
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Cart"
            >
              <motion.span
                key={cartBump}
                initial={cartBump > 0 ? { scale: 1.5, color: "var(--color-accent)" } : false}
                animate={{ scale: 1, color: "currentColor" }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
                className="inline-flex"
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.span>
              {hydrated && count > 0 && (
                <motion.span
                  key={`badge-${count}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
                >
                  {count > 99 ? "99+" : count}
                </motion.span>
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

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
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
              <div className="my-1 border-t border-zinc-800" />
              {isAuthenticated ? (
                <>
                  <Link href="/account/overview" className="px-3 py-2.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="px-3 py-2.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800">
                    My Orders
                  </Link>
                  <button onClick={handleLogout} className="text-left px-3 py-2.5 rounded-md text-sm text-red-400 hover:bg-zinc-800">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"    className="px-3 py-2.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800">Sign in</Link>
                  <Link href="/register" className="px-3 py-2.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-zinc-800">Create account</Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

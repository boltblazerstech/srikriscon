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
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "@/src/config/theme";
import { useCart } from "@/src/hooks/useCart";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";
import TopBanner from "./TopBanner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, hydrated } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ── Scroll Effect ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close menus on route change ───────────────────────────────────────────
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  const initials = user?.firstName
    ? (user.firstName[0] + (user.lastName?.[0] ?? "")).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col pointer-events-none">
      <div className="pointer-events-auto shadow-sm">
        <TopBanner />

        {/* ── Main Header Row ───────────────────────────────────────────────── */}
        <div className={cn(
          "bg-white transition-all duration-300 border-b border-zinc-100",
          scrolled ? "py-2" : "py-4"
        )}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-8">
              
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12 transition-transform group-hover:scale-105">
                  <Image
                    src="/sri-kriscon-logo.webp"
                    alt={theme.business.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-primary font-black text-xl leading-none tracking-tighter">
                    {theme.business.name.toUpperCase()}
                  </h1>
                  <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] mt-0.5">
                    INDUSTRIES
                  </p>
                </div>
              </Link>

              {/* Centered Search Bar */}
              <form 
                onSubmit={handleSearch}
                className="hidden md:flex flex-1 max-w-xl relative group"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <button type="submit" className="hidden">Search</button>
              </form>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                
                {/* Mobile Search Icon */}
                <Link href="/search" className="md:hidden p-2 text-zinc-600">
                  <Search className="h-5 w-5" />
                </Link>

                {/* Account */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-50 transition-colors text-zinc-600"
                  >
                    {isAuthenticated ? (
                      <span className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                        {initials}
                      </span>
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-2xl p-2 z-50"
                      >
                        {isAuthenticated ? (
                          <>
                            <div className="px-3 py-2 mb-2">
                              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Account</p>
                              <p className="text-sm font-bold text-primary truncate">{user?.email}</p>
                            </div>
                            <Link href="/account/overview" className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors">
                              <User className="h-4 w-4" /> Profile
                            </Link>
                            <Link href="/account/orders" className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors">
                              <Package className="h-4 w-4" /> Orders
                            </Link>
                            <button onClick={() => logout()} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1">
                              <LogOut className="h-4 w-4" /> Sign Out
                            </button>
                          </>
                        ) : (
                          <div className="p-2 space-y-2">
                            <Link href="/login" className="block w-full text-center py-2 bg-primary text-white text-sm font-bold rounded-xl">Sign In</Link>
                            <Link href="/register" className="block w-full text-center py-2 text-sm text-primary font-bold">Create Account</Link>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart */}
                <Link href="/cart" className="relative p-2 group">
                  <ShoppingCart className="h-6 w-6 text-zinc-600 group-hover:text-primary transition-colors" />
                  {hydrated && count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-accent text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                      {count > 99 ? "9+" : count}
                    </span>
                  )}
                </Link>

                {/* Mobile Menu */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 text-zinc-600"
                >
                  {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation Row ────────────────────────────────────────────────── */}
        <div className="hidden md:block bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-1 py-1">
              {theme.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 text-[13px] font-bold uppercase tracking-widest transition-all relative group",
                    pathname === link.href ? "text-primary" : "text-zinc-500 hover:text-primary"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute bottom-2 left-4 right-4 h-0.5 bg-primary transition-all duration-300",
                    pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                  )} />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Mobile Menu Sidebar ───────────────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-50 md:hidden p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-black text-xl text-primary">{theme.business.name}</span>
                  <button onClick={() => setMenuOpen(false)}><X className="h-6 w-6" /></button>
                </div>
                
                <div className="space-y-1 mb-8">
                  {theme.nav.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-3 text-lg font-bold border-b border-zinc-50"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="bg-zinc-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-zinc-400 uppercase mb-4">Support</p>
                  <p className="text-sm font-medium mb-2">{theme.business.phone}</p>
                  <p className="text-sm font-medium">{theme.business.email}</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

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
import Button from "@/src/components/ui/Button";
import { useCart } from "@/src/hooks/useCart";
import { useAuth } from "@/src/context/AuthContext";
import { useCategories } from "@/src/hooks/useCategories";
import { useSetting } from "@/src/hooks/useSettings";
import { cn } from "@/src/lib/utils";
import TopBanner from "./TopBanner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, hydrated } = useCart();
  const { value: logoUrl } = useSetting("logoUrl");
  const { value: storeName } = useSetting("storeName");
  const { value: storeTagline } = useSetting("storeTagline");
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);

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
      <div className={cn(
        "pointer-events-auto transition-all duration-300 shadow-[0_2px_18px_rgba(0,0,0,0.05)]",
        scrolled ? "bg-white/85 backdrop-blur-[14px]" : "bg-[#FCFAF7]"
      )}>
        <TopBanner />
        <div className="h-[17px]" />

        {/* ── Main Header Row ───────────────────────────────────────────────── */}
        <div className={cn(
          "transition-all duration-300 flex items-center w-full",
          scrolled ? "h-[60px]" : "h-[70px]"
        )}>
          <div className="mx-auto max-w-[83rem] px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between gap-16 sm:gap-20">
              
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-3.5 group mr-6 lg:mr-12">
                <div className="relative h-[50px] w-[50px] sm:h-[56px] sm:w-[56px] transition-transform group-hover:scale-105 bg-[#0D4A50] rounded-full">
                  <Image
                    src={logoUrl || "/sri-kriscon-logo.webp"}
                    alt={theme.business.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-primary font-black text-xl sm:text-[22px] leading-none tracking-tighter">
                    {(storeName || theme.business.name).toUpperCase()}
                  </h1>
                  <p className="text-[9px] sm:text-[10px] text-zinc-400 font-bold tracking-[0.38em] mt-0.5 sm:mt-1.5">
                    {(storeTagline || "INDUSTRIES").toUpperCase()}
                  </p>
                </div>
              </Link>

              {/* Centered Search Bar */}
              <form 
                onSubmit={handleSearch}
                className="hidden md:flex flex-1 max-w-[60rem] relative group h-[54px] items-center"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search boxes, bags & packaging..."
                  className="w-full bg-white border border-accent rounded-[28px] h-full pl-12 pr-4 text-sm outline-none transition-all shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04),_0_2px_8px_rgba(0,0,0,0.04)] focus:border-2 focus:border-accent focus:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                />
                <Search className="absolute left-[18px] top-1/2 -translate-y-1/2 h-5 w-5 text-accent transition-colors" />
                <button type="submit" className="hidden">Search</button>
              </form>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-4 ml-6 lg:ml-12">
                
                {/* Mobile Search Icon */}
                <Link href="/search" className="md:hidden p-2 text-zinc-600">
                  <Search className="h-5 w-5" />
                </Link>


                {/* Account */}
                <div className="relative flex items-center" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-[#fafafa] hover:bg-[#f4f4f4] text-zinc-600 hover:text-accent transition-all duration-200"
                  >
                    {isAuthenticated ? (
                      <span className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                        {initials}
                      </span>
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-2xl p-2 z-50 pointer-events-auto"
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
                            <button onClick={() => { setShowConfirmLogout(true); setUserMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1">
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
                <Link 
                  href="/cart" 
                  className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-[#fafafa] hover:bg-[#f4f4f4] text-zinc-600 hover:text-accent transition-all duration-200 group"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {hydrated && count > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#FCFAF7]">
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
        <div className="hidden md:block border-b border-[#EBE6DD] h-[55px]">
          <div className="mx-auto max-w-[83rem] px-4 sm:px-6 lg:px-8 h-full">
            <nav className="flex items-center justify-center gap-2 h-full">
              {theme.nav.map((link) => {
                const isCategories = link.label === "Categories";
                return (
                  <div 
                    key={link.href}
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => isCategories && setCategoriesOpen(true)}
                    onMouseLeave={() => isCategories && setCategoriesOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors relative flex items-center h-full",
                        pathname === link.href || (isCategories && categoriesOpen) ? "text-zinc-900" : "text-zinc-700 hover:text-zinc-900"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        {link.label}
                        {isCategories && <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", categoriesOpen && "rotate-180")} />}
                      </div>
                      <span className={cn(
                        "absolute bottom-2 left-5 right-5 h-0.5 bg-accent transition-transform duration-300 origin-center ease-out",
                        pathname === link.href || (isCategories && categoriesOpen) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )} />
                    </Link>

                    {/* Categories Dropdown */}
                    {isCategories && (
                      <AnimatePresence>
                        {categoriesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full w-[280px] bg-white border border-[#EBE6DD] rounded-2xl shadow-2xl p-3 z-50 overflow-hidden"
                          >
                            <CategoriesGrid onClose={() => setCategoriesOpen(false)} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
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
                  <span className="font-black text-xl text-primary">{storeName || theme.business.name}</span>
                  <button onClick={() => setMenuOpen(false)}><X className="h-6 w-6" /></button>
                </div>
                
                <div className="space-y-1 mb-8">
                  {theme.nav.map((link) => {
                    const isCategories = link.label === "Categories";
                    if (isCategories) {
                      return (
                        <div key={link.href} className="border-b border-zinc-50">
                          <button 
                            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                            className="flex items-center justify-between w-full py-4 text-lg font-medium text-left"
                          >
                            {link.label}
                            <ChevronDown className={cn("h-5 w-5 transition-transform", mobileCategoriesOpen && "rotate-180")} />
                          </button>
                          <AnimatePresence>
                            {mobileCategoriesOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-zinc-50 rounded-xl mb-4"
                              >
                                <div className="p-4 space-y-3">
                                  <Link href="/categories" className="block text-sm font-medium text-primary">All Categories</Link>
                                  <MobileCategoriesList onClick={() => setMenuOpen(false)} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-4 text-lg font-medium border-b border-zinc-50"
                      >
                        {link.label}
                      </Link>
                    );
                  })}
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
        <AnimatePresence>
          {showConfirmLogout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmLogout(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-border z-50"
              >
                <h3 className="font-display text-xl font-bold text-foreground">Sign Out</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Are you sure you want to sign out of your account?
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowConfirmLogout(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => { logout(); setShowConfirmLogout(false); }}>
                    Sign Out
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function CategoriesGrid({ onClose }: { onClose: () => void }) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) return <div className="h-40 flex items-center justify-center"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const parentCategories = categories?.filter(c => !c.parent) || [];

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-1 gap-1">
        {parentCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            onClick={onClose}
            className="group flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-all"
          >
            <p className="text-sm font-medium text-zinc-900 group-hover:text-primary transition-colors">{cat.name}</p>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-300 -rotate-90 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
      
      <div className="h-px bg-zinc-50 my-2" />
      
      <Link 
        href="/categories" 
        onClick={onClose}
        className="flex items-center justify-center py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-all"
      >
        View All Categories
      </Link>
    </div>
  );
}

function MobileCategoriesList({ onClick }: { onClick: () => void }) {
  const { data: categories } = useCategories();
  const parentCategories = categories?.filter(c => !c.parent) || [];

  return (
    <div className="space-y-1">
      {parentCategories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          onClick={onClick}
          className="block py-2 text-sm text-zinc-600 font-medium"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

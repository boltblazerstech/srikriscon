"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, User, ShieldCheck, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";
import Spinner from "@/src/components/ui/Spinner";
import Button from "@/src/components/ui/Button";

const NAV = [
  { href: "/account/overview",  label: "Overview",  icon: LayoutDashboard },
  { href: "/account/orders",    label: "My Orders",  icon: Package },
  { href: "/account/profile",   label: "Profile",    icon: User },
  { href: "/account/security",  label: "Security",   icon: ShieldCheck },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email;
  const initials    = user?.firstName
    ? (user.firstName[0] + (user.lastName?.[0] ?? "")).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">

              {/* User header */}
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="p-2">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                        isActive
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {/* Sign out */}
              <div className="p-2 border-t border-border">
                <button
                  onClick={() => setShowConfirmLogout(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>

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
              className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-border"
            >
              <h3 className="font-display text-xl font-bold text-foreground">Sign Out</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to sign out of your account?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowConfirmLogout(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

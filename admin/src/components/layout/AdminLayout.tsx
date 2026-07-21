"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import Sidebar from "./Sidebar";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/login");
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative min-w-0">
      {/* Responsive Sidebar & Mobile Overlay */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main Layout Container */}
      <div className="flex-1 lg:pl-60 min-h-screen flex flex-col min-w-0 bg-background max-w-full overflow-x-hidden">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-16 bg-sidebar border-b border-white/10 px-4 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-sidebar-muted hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-sidebar-fg font-extrabold text-lg tracking-tight flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white text-xs shadow-sm">
                ⚡
              </span>
              Admin
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

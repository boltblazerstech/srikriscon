"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  FileText,
  BookOpen,
  Megaphone,
  MessageSquare,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { cn, getInitials } from "@/src/lib/utils";
import ConfirmDialog from "../ui/ConfirmDialog";

const NAV_ITEMS = [
  { href: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { href: "/products",      label: "Products",     icon: Package },
  { href: "/categories",    label: "Categories",   icon: Tag },
  { href: "/orders",        label: "Orders",       icon: ShoppingCart },
  { href: "/customers",     label: "Customers",    icon: Users },
  { href: "/pages",         label: "Pages",        icon: FileText },
  { href: "/blogs",         label: "Blogs",        icon: BookOpen },
  { href: "/banners",       label: "Banners",      icon: Megaphone },
  { href: "/testimonials",  label: "Testimonials", icon: MessageSquare },
  { href: "/settings",      label: "Settings",     icon: Settings },
];

const SUPER_ADMIN_ITEMS = [
  { href: "/users", label: "Users", icon: Shield },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, isSuperAdmin, logout } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const allItems = isSuperAdmin ? [...NAV_ITEMS, ...SUPER_ADMIN_ITEMS] : NAV_ITEMS;

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 lg:w-60 bg-sidebar border-r border-white/10 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0 bg-sidebar">
          <span className="text-sidebar-fg font-extrabold text-xl tracking-tight flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm shadow-md">
              ⚡
            </span>
            Admin Panel
          </span>

          {/* Close Mobile Button */}
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-sidebar-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {allItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "text-sidebar-muted hover:bg-white/8 hover:text-sidebar-fg"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110", active ? "text-white" : "text-sidebar-muted")} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile + Logout Footer */}
        <div className="border-t border-white/10 p-4 shrink-0 bg-sidebar/95 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/5 border border-white/5">
            <div className="h-9 w-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-fg text-xs font-black flex-shrink-0">
              {user ? getInitials(`${user.firstName} ${user.lastName}`) : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-fg text-xs font-bold truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Admin"}
              </p>
              <p className="text-sidebar-muted text-[10px] font-mono uppercase tracking-wider truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => setShowConfirmLogout(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-sidebar-muted hover:bg-destructive/20 hover:text-destructive transition-colors border border-transparent hover:border-destructive/30"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>

        <ConfirmDialog
          open={showConfirmLogout}
          onConfirm={logout}
          onCancel={() => setShowConfirmLogout(false)}
          title="Sign Out"
          description="Are you sure you want to sign out of the admin panel?"
          confirmLabel="Sign Out"
          cancelLabel="Cancel"
          variant="destructive"
        />
      </aside>
    </>
  );
}

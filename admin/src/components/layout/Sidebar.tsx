"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Image,
  FileText,
  Megaphone,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { cn, getInitials } from "@/src/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { href: "/products",      label: "Products",     icon: Package },
  { href: "/categories",    label: "Categories",   icon: Tag },
  { href: "/orders",        label: "Orders",       icon: ShoppingCart },
  { href: "/gallery",       label: "Gallery",      icon: Image },
  { href: "/pages",         label: "Pages",        icon: FileText },
  { href: "/banners",       label: "Banners",      icon: Megaphone },
  { href: "/testimonials",  label: "Testimonials", icon: MessageSquare },
  { href: "/settings",      label: "Settings",     icon: Settings },
];

const SUPER_ADMIN_ITEMS = [
  { href: "/users", label: "Users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isSuperAdmin, logout } = useAuth();

  const allItems = isSuperAdmin ? [...NAV_ITEMS, ...SUPER_ADMIN_ITEMS] : NAV_ITEMS;

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-screen bg-sidebar overflow-hidden">
      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b border-white/10">
        <span className="text-sidebar-fg font-bold text-lg tracking-tight">
          ⚡ Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {allItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-sidebar-active text-sidebar-fg"
                  : "text-sidebar-muted hover:bg-white/8 hover:text-sidebar-fg"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-3 w-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="h-8 w-8 rounded-full bg-sidebar-active flex items-center justify-center text-sidebar-fg text-xs font-bold flex-shrink-0">
            {user ? getInitials(`${user.firstName} ${user.lastName}`) : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-fg text-sm font-medium truncate">
              {user ? `${user.firstName} ${user.lastName}` : "Admin"}
            </p>
            <p className="text-sidebar-muted text-xs truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:bg-white/8 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

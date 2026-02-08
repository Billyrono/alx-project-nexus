"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronRight,
  X,
  Store,
  Link2,
  Mail,
} from "lucide-react";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/campaigns", label: "Campaign Links", icon: Link2 },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Overlay for mobile — blocks interaction & scroll behind sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-foreground/20 lg:hidden z-30"
          onClick={onClose}
          onTouchMove={(e) => e.preventDefault()}
        />
      )}

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside
        className={`fixed left-0 top-20 w-64 h-[calc(100vh-80px)] bg-card border-r border-border transform fannoh-transition z-40 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col p-3">
          <div className="flex items-center justify-between lg:hidden mb-3">
            <h3 className="font-semibold text-foreground text-sm">Menu</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-foreground/10 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-0.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium fannoh-transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-foreground/5"
                  }`}
                  onClick={onClose}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-border my-1.5" />

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-1">
              Quick Links
            </p>
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-foreground/5 fannoh-transition"
            >
              <Store className="w-4 h-4" />
              View Store
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

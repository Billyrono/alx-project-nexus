"use client";

import {
  Menu,
  Bell,
  LogOut,
  User,
  ChevronRight,
  Home,
  Package,
  AlertTriangle,
  MessageCircle,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/fannoh/auth-context";

interface AdminNotification {
  id: string;
  type: "order" | "low_stock" | "review" | "support" | "system";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await fetch("/api/admin/notifications");
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch notifications on mount and periodically
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const getNotificationIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="w-4 h-4 text-green-500" />;
      case "low_stock":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "support":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "system":
        return <Settings className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-card border-b border-border flex flex-col justify-center px-4 sm:px-6 lg:px-8 z-50 fannoh-shadow">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-foreground/10 rounded-lg fannoh-transition"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Fannoh Naturals"
                width={100}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
              <div className="border-l border-border pl-3">
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Breadcrumbs - Desktop only */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground fannoh-transition"
          >
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbs.slice(1).map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              {index === breadcrumbs.length - 2 ? (
                <span className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground fannoh-transition"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 hover:bg-foreground/10 rounded-lg fannoh-transition"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-18 h-4.5 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-80 bg-card rounded-lg fannoh-shadow border border-border overflow-hidden z-50">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:bg-foreground/10 rounded"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No notifications
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          href={notification.link || "#"}
                          onClick={() => setShowNotifications(false)}
                          className="block p-3 hover:bg-foreground/5 border-b border-border/50 last:border-0 fannoh-transition"
                        >
                          <div className="flex gap-3">
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 border-t border-border">
                      <Link
                        href="/admin/orders"
                        onClick={() => setShowNotifications(false)}
                        className="block text-center text-xs text-primary hover:underline"
                      >
                        View all activity
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-2 hover:bg-foreground/10 rounded-lg fannoh-transition"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground max-w-30 truncate">
                {user?.user_metadata?.full_name ||
                  user?.email?.split("@")[0] ||
                  "Admin"}
              </span>
            </button>

            {showProfile && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfile(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg fannoh-shadow border border-border overflow-hidden z-50">
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.user_metadata?.full_name || "Admin User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || "admin@fannohnaturals.com"}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-foreground/10 fannoh-transition flex items-center gap-2"
                    onClick={() => setShowProfile(false)}
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </Link>
                  <Link
                    href="/"
                    className="block w-full px-4 py-2 text-sm text-foreground hover:bg-foreground/10 fannoh-transition text-left"
                    onClick={() => setShowProfile(false)}
                  >
                    View Store
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 fannoh-transition flex items-center gap-2 border-t border-border"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

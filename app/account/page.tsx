"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Package,
  Heart,
  LogOut,
  Loader2,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

export default function AccountPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load avatar
  useEffect(() => {
    if (user?.image) {
      setAvatarUrl(user.image);
    }
  }, [user]);

  const handleSignOut = async () => {
    dispatch(logout());
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      icon: Package,
      label: "My Orders",
      description: "Track your orders and view history",
      href: "/account/orders",
    },
    {
      icon: Heart,
      label: "Wishlist",
      description: "Products you've saved for later",
      href: "/account/wishlist",
    },
    {
      icon: User,
      label: "Profile Settings",
      description: "Update your personal information",
      href: "/account/settings",
    },
    {
      icon: ShoppingBag,
      label: "Admin Dashboard",
      description: "Manage your store, orders & customers",
      href: "/admin",
    },
    {
      icon: ShoppingBag,
      label: "Browse Shop",
      description: "Explore our latest products and deals",
      href: "/shop",
    },
  ];

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-3xl p-4 sm:p-8 mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="font-serif text-xl sm:text-3xl text-foreground mb-1 truncate">
                  Welcome back
                  {user.firstName
                    ? `, ${user.firstName} ${user.lastName}`
                    : ""}
                  !
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}

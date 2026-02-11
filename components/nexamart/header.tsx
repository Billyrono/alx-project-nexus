"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  LogIn,
} from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleCart } from "@/store/slices/cartSlice";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { totalQuantity } = useAppSelector((state) => state.cart);
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight - 100;
      setIsScrolled(window.scrollY > heroHeight);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 h-22 z-40 transition-all duration-300 ${isScrolled ? "bg-background" : "bg-transparent"
          }`}
      />

      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <nav
          className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 rounded-lg py-0 my-0 animate-scale-fade-in border transition-all duration-300 ${isScrolled
            ? "bg-background/95 backdrop-blur-md border-border/50 shadow-lg"
            : "bg-[rgba(255,255,255,0.4)] backdrop-blur-md border-[rgba(255,255,255,0.32)]"
            }`}
          style={
            !isScrolled ? { boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px" } : {}
          }
        >
          <div className="flex items-center justify-between h-17">
            <button
              type="button"
              className="lg:hidden p-2 text-foreground/80 hover:text-foreground nexamart-transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm tracking-wide text-foreground/70 hover:text-foreground nexamart-transition">
                Home
              </Link>
              <Link href="/shop" className="text-sm tracking-wide text-foreground/70 hover:text-foreground nexamart-transition">
                Shop
              </Link>
              <Link href="/about" className="text-sm tracking-wide text-foreground/70 hover:text-foreground nexamart-transition">
                About
              </Link>

            </div>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="font-serif font-bold italic text-4xl text-foreground leading-none">
                NexaMart
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground font-medium">
                Marketplace
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                className="p-2 text-foreground/70 hover:text-foreground nexamart-transition"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </button>
              {!loading && (user ? (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-2 p-2 text-foreground/70 hover:text-foreground nexamart-transition"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground nexamart-transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              ))}

              <button
                type="button"
                onClick={() => dispatch(toggleCart(true))}
                className="relative p-2 text-foreground/70 hover:text-foreground nexamart-transition"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalQuantity > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>

          <CartDrawer />
          <div
            className={`lg:hidden overflow-hidden nexamart-transition ${isMenuOpen ? "max-h-64 pb-6" : "max-h-0"
              }`}
          >
            <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
              <Link href="/" className="text-sm tracking-wide text-foreground/70 hover:text-foreground nexamart-transition">
                Home
              </Link>
              <Link href="/shop" className="text-sm tracking-wide text-foreground/70 hover:text-foreground nexamart-transition">
                Shop
              </Link>

              <Link href={user ? "/account" : "/login"} className="text-sm tracking-wide text-foreground/70 hover:text-foreground nexamart-transition">
                {user ? "Account" : "Login"}
              </Link>
            </div>
          </div>
        </nav>
      </header>
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-6 py-4 pr-12 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary/80 nexamart-transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

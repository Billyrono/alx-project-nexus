"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Beauty", href: "/shop?category=beauty" },
    { name: "Fragrances", href: "/shop?category=fragrances" },
    { name: "Furniture", href: "/shop?category=furniture" },
    { name: "Groceries", href: "/shop?category=groceries" },
  ],
  about: [
    { name: "Our Story", href: "/about" }, // Changed from Ingredients Guide which is specific
    { name: "Contact Us", href: "/contact" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Return Policy", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" }, // Changed from Patch Test Guide
  ],
};

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-card pt-20 pb-10 relative overflow-hidden"
    >
      {/* Giant Background Text */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <span className="font-serif text-[13vw] font-bold text-foreground/5 whitespace-nowrap leading-none selection:bg-transparent">
          NexaMart
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center text-center">
            <div className="flex flex-col items-center mb-6">
              <span className="font-serif font-bold italic text-5xl text-foreground leading-none mb-1">
                NexaMart
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
                Marketplace
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Your premium destination for quality lifestyle products.
              Curated for excellence.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://www.instagram.com/nexamart"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground hover:scale-110 nexamart-transition nexamart-shadow"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/nexamart"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground hover:scale-110 nexamart-transition nexamart-shadow"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground hover:scale-110 nexamart-transition nexamart-shadow"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div
            className={`transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h3 className="font-medium text-foreground mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block nexamart-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div
            className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h3 className="font-medium text-foreground mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block nexamart-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div
            className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h3 className="font-medium text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block nexamart-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-10 border-t border-border/50 transition-all duration-700 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NexaMart Marketplace. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <span className="text-xs text-muted-foreground mr-2">
                We accept:
              </span>
              {/* Visa */}
              <div
                className="h-7 px-1.5 bg-white rounded flex items-center justify-center border border-border/30"
                title="Visa"
              >
                <Image
                  src="/images/Visa_Inc.-Logo.wine.svg"
                  alt="Visa"
                  width={40}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </div>
              {/* Mastercard */}
              <div
                className="h-7 px-1.5 bg-white rounded flex items-center justify-center border border-border/30"
                title="Mastercard"
              >
                <Image
                  src="/images/Mastercard-Logo.wine.svg"
                  alt="Mastercard"
                  width={40}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </div>
              {/* Apple Pay */}
              <div
                className="h-7 px-1.5 bg-black rounded flex items-center justify-center"
                title="Apple Pay"
              >
                <Image
                  src="/images/Apple_Pay-White-Logo.wine.svg"
                  alt="Apple Pay"
                  width={40}
                  height={24}
                  className="h-4 w-auto object-contain"
                />
              </div>
              {/* M-Pesa */}
              <div
                className="h-7 px-1.5 bg-white rounded flex items-center justify-center border border-border/30"
                title="M-Pesa"
              >
                <Image
                  src="/images/M-PESA_LOGO-01.svg"
                  alt="M-Pesa"
                  width={40}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground nexamart-transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground nexamart-transition"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground/60">
              Developed by{" "}
              <a
                href="https://billyrono.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground nexamart-transition"
              >
                Billy Rono
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

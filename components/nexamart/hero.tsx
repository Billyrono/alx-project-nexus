"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#e3e1e2" }}
    >
      {/* Background Video */}
      <div
        className="border-b border-border/50 py-2"
        style={{ backgroundColor: "#e3e1e2" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scaleX(-1)",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "cover",
          }}
        >
          <source src="/Videos/Hero.mp4" type="video/mp4" />
        </video>
        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-linear-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full sm:pt-22 sm:mr-14 lg:mr-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full lg:max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <span
              className="text-xs sm:text-sm uppercase mb-2 block text-black animate-blur-in opacity-0 tracking-normal"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              Premium Lifestyle Solutions
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-2 text-balance text-black">
              <span
                className="block animate-blur-in opacity-0 font-semibold"
                style={{
                  animationDelay: "0.4s",
                  animationFillMode: "forwards",
                }}
              >
                Style as unique
              </span>
              <span
                className="block animate-blur-in opacity-0 font-semibold text-4xl sm:text-5xl md:text-7xl xl:text-9xl"
                style={{
                  animationDelay: "0.6s",
                  animationFillMode: "forwards",
                }}
              >
                as you are.
              </span>
            </h2>
            <p
              className="text-base sm:text-lg leading-relaxed mb-4 max-w-lg mx-auto lg:mx-0 text-black animate-blur-in opacity-0"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              Discover our curated collection of premium products.
              Quality, style, and elegance for your everyday life.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-blur-in opacity-0"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide nexamart-transition hover:bg-primary/90 nexamart-shadow"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 nexamart-transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-black">
        <span className="text-xs tracking-widest uppercase font-medium">
          Scroll
        </span>
        <div className="w-px h-16 bg-foreground/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-foreground/60 animate-line-scroll" />
        </div>
      </div>
    </section>
  );
}

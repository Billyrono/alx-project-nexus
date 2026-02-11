"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Truck, ShieldCheck, HeartHandshake, Globe } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Reliable shipping to your doorstep",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description: "Protected payments and data privacy",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description: "24/7 support for all your needs",
  },
  {
    icon: Globe,
    title: "Global Brands",
    description: "Authentic products from top manufacturers",
  },
];

export function FeatureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const bentoRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (bentoRef.current) {
      observer.observe(bentoRef.current);
    }

    if (videoSectionRef.current) {
      videoObserver.observe(videoSectionRef.current);
    }

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }

    return () => {
      if (bentoRef.current) {
        observer.unobserve(bentoRef.current);
      }
      if (videoSectionRef.current) {
        videoObserver.unobserve(videoSectionRef.current);
      }
      if (headerRef.current) {
        headerObserver.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid */}
        <div
          ref={bentoRef}
          className="grid md:grid-cols-4 mb-20 md:grid-rows-[300px_300px] gap-6"
        >
          <div
            className={`relative rounded-3xl overflow-hidden h-80 sm:h-125 md:h-auto md:col-span-2 md:row-span-2 transition-all duration-700 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            style={{ transitionDelay: "0ms" }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/Videos/plant_based.webm" type="video/webm" />
              <source src="/Videos/plant_based.mp4" type="video/mp4" />
            </video>
            {/* Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-card p-4 sm:p-6 shadow-lg rounded-xl">
              <div className="flex items-start gap-3">
                <div className="shrink-0"></div>
                <div>
                  <h3 className="text-xl text-foreground mb-2 font-medium">
                    Premium <span className="">Selection</span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Explore our curated collection of top-tier products designed to elevate your lifestyle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-3xl p-6 md:p-8 flex flex-col justify-center md:col-span-2 relative overflow-hidden transition-all duration-700 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            style={{ transitionDelay: "100ms" }}
          >
            {/* Background Image */}
            <Image
              src="/images/products/0ed61900-dd29-4dd2-bc2d-abc2db54c352.png"
              alt="Quality products"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl text-white mb-2">
                100% Genuine
              </h3>
              <h3 className="text-2xl md:text-3xl text-white/70 mb-4">
                Guaranteed Quality
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verified Sellers</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>Tracked Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>International Standards</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden md:col-span-2 transition-all duration-700 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            style={{ transitionDelay: "200ms" }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
            >
              <source
                src="/Videos/eco-friendly-packaging.webm"
                type="video/webm"
              />
              <source
                src="/Videos/eco-friendly-packaging.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-transparent" />

            <div className="relative z-10 flex flex-col justify-center h-full text-left items-start">
              <div className="inline-flex items-center justify-center w-10 h-10 mb-3 bg-white/80 rounded-full">
                <HeartHandshake className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-sans text-base mb-1 text-black font-semibold">
                Smart
              </h3>
              <h3 className="text-2xl md:text-3xl mb-2 text-black font-bold">
                Shopping
              </h3>
            </div>
          </div>
        </div>

        <div
          ref={videoSectionRef}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center my-0 py-20"
        >
          {/* Video */}
          <div
            className={`relative aspect-4/5 rounded-3xl overflow-hidden nexamart-shadow transition-all duration-700 ease-out ${isVideoVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/Videos/Feature.webm" type="video/webm" />
              <source src="/Videos/Feature.mp4" type="video/mp4" />
            </video>
          </div>
          <div
            ref={headerRef}
            className={`transition-all duration-700 ease-out ${isVideoVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: "100ms" }}
          >
            <span
              className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${headerVisible ? "animate-blur-in opacity-0" : "opacity-0"}`}
              style={
                headerVisible
                  ? { animationDelay: "0.2s", animationFillMode: "forwards" }
                  : {}
              }
            >
              Why NexaMart
            </span>
            <h2
              className={`font-serif text-4xl leading-tight text-foreground mb-6 text-balance md:text-7xl ${headerVisible ? "animate-blur-in opacity-0" : "opacity-0"}`}
              style={
                headerVisible
                  ? { animationDelay: "0.4s", animationFillMode: "forwards" }
                  : {}
              }
            >
              Everything you need.
            </h2>
            <p
              className={`text-lg text-muted-foreground leading-relaxed mb-10 max-w-md ${headerVisible ? "animate-blur-in opacity-0" : "opacity-0"}`}
              style={
                headerVisible
                  ? { animationDelay: "0.6s", animationFillMode: "forwards" }
                  : {}
              }
            >
              We believe shopping should be effortless.
              NexaMart brings the world's best products directly to you, handled with care.
            </p>
            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group p-5 nexamart-transition hover:scale-[1.02] rounded-md bg-card"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 group-hover:bg-primary/20 nexamart-transition bg-stone-50">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

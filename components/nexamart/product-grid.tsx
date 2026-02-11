"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { api, Product } from "@/services/api";

const categoryTabs = [
  { value: "all", label: "All" },
  { value: "home-decoration", label: "Home" },
  { value: "furniture", label: "Furniture" },
  { value: "womens-bags", label: "Accessories" },
];

export function ProductGrid() {
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data.products);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .slice(0, 8);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1
    }));
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-card"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
            Curated Selection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mt-4 mb-4 text-foreground">
            Essentials for Your Ritual
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Curated with care. Each product is selected to enhance your daily lifestyle.
          </p>
        </div>
        <div className="flex justify-start sm:justify-center mb-12 overflow-x-auto px-4 -mx-4 sm:px-2 sm:-mx-2 scrollbar-hide pb-2">
          <div className="inline-flex items-center bg-background rounded-full p-1 sm:p-1.5 nexamart-shadow">
            {categoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === tab.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Unable to load products. Please try again later.</p>
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className={`group transition-all duration-500 ease-out ${isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-background rounded-3xl overflow-hidden nexamart-shadow hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={index < 4}
                    />
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-background/95 backdrop-blur-sm text-foreground border border-border/50 shadow-sm">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock <= 0}
                      className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm text-foreground p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50 nexamart-shadow"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-5 flex-1 flex flex-col">
                    <h3 className="font-serif text-sm sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-auto flex items-baseline gap-1 sm:gap-2">
                      <span className="font-semibold text-foreground text-sm sm:text-base">
                        KES {product.price.toLocaleString()}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-xs sm:text-sm text-muted-foreground line-through hidden sm:inline">
                          KES {(product.price / (1 - product.discountPercentage / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-4 border border-border rounded-full text-foreground font-medium hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

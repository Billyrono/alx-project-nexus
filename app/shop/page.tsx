"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
  Heart,
} from "lucide-react";
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { api, Product, Category } from "@/services/api";

export default function ShopPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    category: true,
  });

  const [sortOrder, setSortOrder] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(productsData.products);
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load shop data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    return true;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };



  const hasActiveFilters = selectedCategories.length > 0;

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-asc") return a.price - b.price;
    if (sortOrder === "price-desc") return b.price - a.price;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);

  // Reset animation when filters change
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [selectedCategories]);

  const handleAddToCart = (product: Product) => {
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
    <main className="min-h-screen">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
              Our Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
              Find Your Perfect Match
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Explore our curated collection of products.
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="bg-card rounded-3xl p-6 sticky top-32 nexamart-shadow max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl text-foreground">
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs text-primary hover:text-primary/80 nexamart-transition"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <FilterSection
                  title="Category"
                  expanded={expandedFilters.category}
                  onToggle={() =>
                    setExpandedFilters((prev) => ({
                      ...prev,
                      category: !prev.category,
                    }))
                  }
                >
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label
                        key={category.slug}
                        className="flex items-center gap-3 cursor-pointer capitalize"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.slug)}
                          onChange={() => toggleCategory(category.slug)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-foreground/80">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Filter Bar & Mobile Filters */}
              <div className="mb-10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden inline-flex items-center gap-2 text-sm text-foreground px-4 py-2 rounded-full bg-card nexamart-shadow"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                <div className="flex items-center gap-4 ml-auto">
                  <div className="relative inline-block text-left">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="appearance-none bg-card border border-border text-foreground py-2 pl-4 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <span className="text-sm text-muted-foreground hidden sm:inline-block">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}
                  </span>
                </div>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden fixed inset-0 z-50 bg-background overflow-y-auto">
                  <div className="p-6 pb-20">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="font-serif text-2xl text-foreground">
                        Filters
                      </h2>
                      <button
                        type="button"
                        onClick={() => setShowFilters(false)}
                        className="p-2 text-foreground/70 hover:text-foreground"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Category Filter */}
                    <FilterSection
                      title="Category"
                      expanded={true}
                      onToggle={() => { }}
                    >
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <label
                            key={category.slug}
                            className="flex items-center gap-3 cursor-pointer capitalize"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category.slug)}
                              onChange={() => toggleCategory(category.slug)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-foreground/80">
                              {category.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FilterSection>

                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="w-full mt-8 bg-primary text-primary-foreground py-3 rounded-full font-medium nexamart-transition hover:bg-primary/90"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Product Grid */}
              <div
                ref={gridRef}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {loading ? (
                  <div className="col-span-full flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-20">
                    <p className="text-red-500 text-lg mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  paginatedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      isVisible={isVisible}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 200, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card nexamart-transition"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 200, behavior: "smooth" });
                          }}
                          className={`w-10 h-10 rounded-full text-sm font-medium nexamart-transition ${currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-foreground hover:bg-card"
                            }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 200, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-card nexamart-transition"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Results Info */}
              {!loading && filteredProducts.length > 0 && (
                <div className="text-center mt-8 text-sm text-muted-foreground">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </div>
              )}

              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-4">
                    No products match your filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Clear filters to see all products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-6 border-b border-border/30 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 px-0 hover:text-primary nexamart-transition"
      >
        <h3 className="font-medium text-foreground text-sm">{title}</h3>
        <ChevronDown
          className={`w-4 h-4 text-foreground/60 nexamart-transition ${expanded ? "rotate-180" : ""
            }`}
        />
      </button>
      {expanded && <div className="pt-4">{children}</div>}
    </div>
  );
}

function ProductCard({
  product,
  index,
  isVisible,
  onAddToCart,
}: {
  product: Product;
  index: number;
  isVisible: boolean;
  onAddToCart: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="group h-full">
        <Link
          href={`/product/${product.id}`}
          className="bg-card rounded-3xl overflow-hidden nexamart-shadow nexamart-transition group-hover:scale-[1.02] h-full flex flex-col"
        >
          {/* Image */}
          <div className="relative aspect-square bg-muted overflow-hidden">
            <div
              className={`absolute inset-0 bg-linear-to-br from-muted via-muted/50 to-muted animate-pulse transition-opacity duration-500 ${imageLoaded ? "opacity-0" : "opacity-100"
                }`}
            />

            <Image
              src={product.thumbnail || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover nexamart-transition group-hover:scale-105 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              priority={index < 4}
            />

            {/* Badge */}
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide font-bold bg-background/95 backdrop-blur-sm text-foreground border border-border/50 shadow-sm">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}

            {/* Quick add button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 nexamart-transition nexamart-shadow"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Info */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="font-serif text-lg text-foreground mb-1 line-clamp-1">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3 mt-auto">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < Math.round(product.rating) ? "text-amber-400" : "text-muted-foreground"}`}
                  >
                    {i < Math.round(product.rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.rating})
              </span>
            </div>

            {/* Price & Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">
                  KES {product.price.toLocaleString()}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    KES {(product.price / (1 - product.discountPercentage / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {product.category}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

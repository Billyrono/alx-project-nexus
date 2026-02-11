"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Minus,
  Plus,
  ChevronDown,
  Star,
  Check,
  AlertCircle,
  Shield,
  Beaker,
  Loader2,
  Truck,
  X,
} from "lucide-react";
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { api, Product } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

type AccordionSection =
  | "benefits"
  | "howToUse"
  | "ingredients"
  | "contraindications"
  | "patchTest"
  | "safety"
  | "reviews";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  // Redux
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  // Local State
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<AccordionSection | null>("benefits");
  const [isAdded, setIsAdded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProduct(parseInt(productId));
        setProduct(data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  // Sync quantity with cart
  const cartItem = product ? items.find(item => item.id === product.id) : null;
  const isInCart = !!cartItem;

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [cartItem]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const toggleAccordion = (section: AccordionSection) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!product) return;

    dispatch(addToCart({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: quantity,
    }));

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const accordionItems: {
    key: AccordionSection;
    title: string;
    icon?: React.ReactNode;
  }[] = [
      { key: "benefits", title: "Warranty & Returns", icon: <Check className="w-4 h-4" /> },
      {
        key: "howToUse",
        title: "Shipping Information",
        icon: <Truck className="w-4 h-4" />,
      },
      {
        key: "ingredients",
        title: "Specifications",
        icon: <Beaker className="w-4 h-4" />,
      },
      {
        key: "reviews",
        title: `Reviews (${product?.rating || 0})`,
        icon: <Star className="w-4 h-4" />,
      },
    ];

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Shop
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground nexamart-transition mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-card nexamart-shadow"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br from-muted via-muted/50 to-muted animate-pulse transition-opacity duration-500 ${imageLoaded ? "opacity-0" : "opacity-100"
                  }`}
              />
              <Image
                src={product.thumbnail || "/placeholder.svg"}
                alt={product.title}
                fill
                className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                priority
                onLoad={() => setImageLoaded(true)}
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-medium bg-destructive/10 text-destructive">
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col"
            >
              {/* Header */}
              <div className="mb-8">
                <span className="text-sm tracking-[0.3em] uppercase text-primary mb-2 block">
                  {product.category.toUpperCase()}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl text-foreground mb-4">
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} Rating
                  </span>
                </div>

                <p className="text-foreground/80 leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl sm:text-4xl font-semibold text-foreground">
                  KES {product.price.toLocaleString()}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-2xl text-muted-foreground line-through">
                    KES {(product.price / (1 - product.discountPercentage / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="bg-card rounded-2xl p-5 mb-6 nexamart-shadow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Brand</p>
                    <p className="font-semibold text-foreground">
                      {product.brand}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      In Stock
                    </p>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                      {product.stock > 0 ? "Available" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Quantity
                </label>
                <div className="inline-flex items-center gap-4 bg-card rounded-full px-2 py-2 nexamart-shadow">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground nexamart-transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground nexamart-transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm tracking-wide nexamart-transition nexamart-shadow ${isAdded
                    ? "bg-primary/80 text-primary-foreground"
                    : product.stock > 0
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      {isInCart ? "Cart Updated!" : "Added to Cart!"}
                    </>
                  ) : product.stock > 0 ? (
                    isInCart ? (
                      "Update Cart"
                    ) : (
                      "Add to Cart"
                    )
                  ) : (
                    "Out of Stock"
                  )}
                </button>
              </div>

              {/* Safety Notice */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Authenticity Guaranteed
                  </p>
                  <p className="text-xs text-foreground/70">
                    Sourced directly from trusted suppliers.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Details */}
          <div className="border-t border-border/50 pt-10">
            <h2 className="font-serif text-3xl text-foreground mb-8">
              Product Details
            </h2>

            <div className="space-y-2">
              {accordionItems.map((item) => (
                <div
                  key={item.key}
                  className="border border-border/50 rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.key)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-card/50 nexamart-transition"
                  >
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      {item.title}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground nexamart-transition ${openAccordion === item.key ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-5 bg-card/30 border-t border-border/50">
                          {item.key === "benefits" && (
                            <div className="space-y-2 text-sm text-foreground/80">
                              <p><strong>Warranty:</strong> {product.warrantyInformation || "Standard warranty applies."}</p>
                              <p><strong>Return Policy:</strong> {product.returnPolicy || "30-day return policy."}</p>
                              <p><strong>Availability:</strong> {product.availabilityStatus || "In Stock"}</p>
                            </div>
                          )}
                          {item.key === "howToUse" && (
                            <div className="text-sm text-foreground/80">
                              <p>{product.shippingInformation || "Standard shipping applies."}</p>
                            </div>
                          )}
                          {item.key === "ingredients" && (
                            <div className="space-y-2 text-sm text-foreground/80">
                              <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
                              <p><strong>Weight:</strong> {product.weight ? `${product.weight}g` : "N/A"}</p>
                              <p><strong>Dimensions:</strong> {product.dimensions ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm` : "N/A"}</p>
                            </div>
                          )}
                          {item.key === "reviews" && (
                            <div className="space-y-4">
                              {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review, idx) => (
                                  <div key={idx} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                                        ))}
                                      </div>
                                      <span className="font-medium text-foreground text-sm">{review.reviewerName}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{new Date(review.date).toLocaleDateString()}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No reviews yet.</p>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-8 relative"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <div className="w-6 h-6 flex items-center justify-center rounded-full border border-border hover:bg-background nexamart-transition">
                  <X className="w-4 h-4" />
                </div>
              </button>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  Please Log In
                </h3>
                <p className="text-muted-foreground">
                  You need to be logged in to add items to your cart.
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  href={`/login?redirect=/product/${product?.id}`}
                  className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium nexamart-transition hover:bg-primary/90"
                >
                  Log In
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ChevronLeft, Loader2 } from "lucide-react";
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeFromWishlist, clearWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";

export default function WishlistPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleMoveToCart = (item: (typeof wishlistItems)[0]) => {
    dispatch(addToCart({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      thumbnail: item.thumbnail,
      quantity: 1
    }));
    dispatch(removeFromWishlist(item.id));
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

  if (!user) return null;

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground">
                  My Wishlist
                </h1>
                <p className="text-sm text-muted-foreground">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                </p>
              </div>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={() => dispatch(clearWishlist())}
                className="text-sm text-destructive hover:text-destructive/80 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Wishlist items */}
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Save products you love by clicking the heart icon or &quot;Save
                for Later&quot; button.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6 group hover:border-primary/30 transition-colors"
                >
                  {/* Product image */}
                  <Link
                    href={`/product/${item.id}`}
                    className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-muted shrink-0"
                  >
                    <Image
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                    <p className="text-lg font-semibold text-foreground mt-2">
                      KES {item.price.toLocaleString()}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Move to Cart
                      </button>
                      <button
                        onClick={() => dispatch(removeFromWishlist(item.id))}
                        className="inline-flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded-full text-sm hover:text-destructive hover:border-destructive/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ChevronLeft,
  Loader2,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import { useAppSelector } from "@/store/hooks";

const statusConfig: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  processing: {
    icon: <Loader2 className="w-4 h-4" />,
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
  },
  shipped: {
    icon: <Truck className="w-4 h-4" />,
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-800",
  },
  delivered: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  cancelled: {
    icon: <XCircle className="w-4 h-4" />,
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
  },
  refunded: {
    icon: <AlertCircle className="w-4 h-4" />,
    label: "Refunded",
    color: "bg-gray-100 text-gray-800",
  },
};

export default function OrdersPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const allOrders = useAppSelector((state) => state.orders.orders);
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Filter orders for the current user
  const userOrders = allOrders.filter(order =>
    user && order.userId === String(user.id)
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">
                My Orders
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your orders and view history
              </p>
            </div>
          </div>

          {/* Empty state */}
          {userOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No orders yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Your order history will appear here once you make a purchase.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => {
                const status =
                  statusConfig[order.status] || statusConfig.pending;
                const isExpanded = expandedOrder === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    {/* Order header */}
                    <button
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.id)
                      }
                      className="w-full p-4 sm:p-6 flex items-center justify-between text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-semibold text-foreground">
                            #{order.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>
                            {new Date(order.date).toLocaleDateString(
                              "en-KE",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                          <span className="font-medium text-foreground">
                            KES {order.total.toLocaleString()}
                          </span>
                          <span>
                            {order.items?.length || 0}{" "}
                            {(order.items?.length || 0) === 1
                              ? "item"
                              : "items"}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""
                          }`}
                      />
                    </button>

                    {/* Expanded items */}
                    {isExpanded && order.items && (
                      <div className="border-t border-border px-4 sm:px-6 py-4 bg-muted/30">
                        {/* Shipping Info */}
                        <div className="mb-4 text-sm">
                          <span className="font-semibold">Shipping to:</span> {order.shippingDetails.fullName}, {order.shippingDetails.city}
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background shrink-0">
                                <Image
                                  src={item.thumbnail || "/placeholder.svg"}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/placeholder.svg";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} × KES{" "}
                                  {item.price.toLocaleString()}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                KES {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total
                          </span>
                          <span className="font-semibold text-foreground">
                            KES {order.total.toLocaleString()}
                          </span>
                        </div>

                        {/* Payment Method */}
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Payment Method
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {order.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Header } from "@/components/fannoh/header";
import { Footer } from "@/components/fannoh/footer";
import { useAppSelector } from "@/store/hooks";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  shipping_method?: string;
  tracking_number?: string;
  order_items?: OrderItem[];
}

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
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.isLoading);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    try {
      // Mock orders
      setTimeout(() => {
        setOrders([
          {
            id: "ORD-001",
            order_number: "ORD-001",
            status: "delivered",
            payment_status: "paid",
            total_amount: 2500,
            created_at: "2024-02-15T10:00:00Z",
            tracking_number: "TRK123",
            order_items: [
              { id: "1", product_id: "1", product_name: "Essence Mascara Lash Princess", product_price: 9.99, quantity: 1, subtotal: 9.99 }
            ]
          },
          {
            id: "ORD-002",
            order_number: "ORD-002",
            status: "processing",
            payment_status: "paid",
            total_amount: 4500,
            created_at: "2024-02-16T11:30:00Z",
            order_items: [
              { id: "2", product_id: "2", product_name: "Eyeshadow Palette with Mirror", product_price: 19.99, quantity: 2, subtotal: 39.98 }
            ]
          }
        ]);
        setOrdersLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error loading orders:", err);
      setOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, loadOrders]);

  if (loading || ordersLoading) {
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
          {orders.length === 0 ? (
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
              {orders.map((order) => {
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
                            #{order.order_number}
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
                            {new Date(order.created_at).toLocaleDateString(
                              "en-KE",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                          <span className="font-medium text-foreground">
                            KES {order.total_amount.toLocaleString()}
                          </span>
                          <span>
                            {order.order_items?.length || 0}{" "}
                            {(order.order_items?.length || 0) === 1
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
                    {isExpanded && order.order_items && (
                      <div className="border-t border-border px-4 sm:px-6 py-4 bg-muted/30">
                        {/* Tracking */}
                        {order.tracking_number && (
                          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <span className="font-medium text-foreground">
                                Tracking:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {order.tracking_number}
                              </span>
                            </div>
                            <a
                              href={`https://t.17track.net/en#nums=${encodeURIComponent(order.tracking_number)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              Track Order
                            </a>
                          </div>
                        )}

                        {/* Items */}
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background shrink-0">
                                <Image
                                  src={`/images/products/${item.product_id}.png`}
                                  alt={item.product_name}
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
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} × KES{" "}
                                  {item.product_price.toLocaleString()}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                KES {item.subtotal.toLocaleString()}
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
                            KES {order.total_amount.toLocaleString()}
                          </span>
                        </div>

                        {/* Payment status */}
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Payment
                          </span>
                          <span
                            className={`text-sm font-medium capitalize ${order.payment_status === "paid"
                              ? "text-green-600"
                              : order.payment_status === "failed"
                                ? "text-red-600"
                                : "text-yellow-600"
                              }`}
                          >
                            {order.payment_status}
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

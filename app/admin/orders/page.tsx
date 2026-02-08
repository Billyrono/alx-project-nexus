"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Eye,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/fannoh/admin-header";
import { AdminSidebar } from "@/components/fannoh/admin-sidebar";


interface Order {
  id: string;
  order_number: string;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "unpaid" | "paid" | "refunded" | "failed";
  tracking_number: string | null;
  created_at: string;
}

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>(
    {},
  );
  const [showTrackingInput, setShowTrackingInput] = useState<string | null>(
    null,
  );

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    // Mock data fetch
    setTimeout(() => {
      setOrders([
        { id: "ORD-001", order_number: "ORD-001", customer_full_name: "John Doe", customer_email: "john@example.com", customer_phone: "1234567890", total_amount: 2500, status: "delivered", payment_status: "paid", tracking_number: "TRK123", created_at: "2024-02-15T10:00:00Z" },
        { id: "ORD-002", order_number: "ORD-002", customer_full_name: "Jane Smith", customer_email: "jane@example.com", customer_phone: "0987654321", total_amount: 4500, status: "processing", payment_status: "paid", tracking_number: null, created_at: "2024-02-16T11:30:00Z" },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    // If changing to shipped, show tracking input first
    if (newStatus === "shipped") {
      setShowTrackingInput(orderId);
      // Temporarily update UI status
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      return;
    }

    setUpdating(orderId);
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update");

      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const saveTrackingNumber = async (orderId: string) => {
    const trackingNumber = trackingInputs[orderId]?.trim();
    setUpdating(orderId);
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: "shipped",
          trackingNumber: trackingNumber || null,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update");

      setOrders(
        orders.map((o) =>
          o.id === orderId
            ? {
              ...o,
              status: "shipped" as const,
              tracking_number: trackingNumber || null,
            }
            : o,
        ),
      );
      setShowTrackingInput(null);
      setTrackingInputs((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    } catch (err) {
      console.error("Error saving tracking number:", err);
      alert("Failed to save tracking number. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: Order["payment_status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 pb-12">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground">
                  Orders
                </h1>
                <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
                  Manage customer orders
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={fetchOrders}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border hover:bg-foreground/5 fannoh-transition disabled:opacity-50 text-sm"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border hover:bg-foreground/5 fannoh-transition text-sm">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-card rounded-2xl p-4 sm:p-6 fannoh-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Total Orders
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {orders.length}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-4 sm:p-6 fannoh-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Pending
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "pending").length}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-4 sm:p-6 fannoh-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Shipped
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {orders.filter((o) => o.status === "shipped").length}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-4 sm:p-6 fannoh-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Revenue
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  KES {totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by order number, name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card rounded-2xl fannoh-shadow overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">
                    {orders.length === 0
                      ? "No orders yet"
                      : "No orders match your search"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-foreground/5">
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Customer
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                          Payment
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                          Date
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-border/50 hover:bg-foreground/5 fannoh-transition"
                        >
                          <td className="px-3 sm:px-6 py-4">
                            <p className="font-semibold text-foreground text-sm">
                              {order.order_number}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {order.customer_full_name || "Guest"}
                            </p>
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                            <p className="font-medium text-foreground text-sm">
                              {order.customer_full_name || "Guest"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.customer_email}
                            </p>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <p className="font-semibold text-foreground text-sm">
                              KES {order.total_amount.toLocaleString()}
                            </p>
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}
                            >
                              {order.payment_status.charAt(0).toUpperCase() +
                                order.payment_status.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="space-y-2">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(
                                    order.id,
                                    e.target.value as Order["status"],
                                  )
                                }
                                disabled={updating === order.id}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(order.status)} ${updating === order.id ? "opacity-50" : ""}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              {showTrackingInput === order.id && (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    placeholder="Tracking #"
                                    value={trackingInputs[order.id] || ""}
                                    onChange={(e) =>
                                      setTrackingInputs((prev) => ({
                                        ...prev,
                                        [order.id]: e.target.value,
                                      }))
                                    }
                                    className="w-28 px-2 py-1 text-xs rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                  <button
                                    onClick={() => saveTrackingNumber(order.id)}
                                    disabled={updating === order.id}
                                    className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowTrackingInput(null);
                                      setOrders(
                                        orders.map((o) =>
                                          o.id === order.id
                                            ? {
                                              ...o,
                                              status: "processing" as const,
                                            }
                                            : o,
                                        ),
                                      );
                                    }}
                                    className="px-2 py-1 text-xs border border-border rounded hover:bg-foreground/10"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                              {order.tracking_number &&
                                showTrackingInput !== order.id && (
                                  <p className="text-xs text-muted-foreground">
                                    Tracking: {order.tracking_number}
                                  </p>
                                )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                            <p className="text-sm text-foreground/70">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="p-2 hover:bg-foreground/10 rounded-lg fannoh-transition inline-flex"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-foreground/50" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

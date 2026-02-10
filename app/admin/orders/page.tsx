"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
} from "lucide-react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOrderStatus, Order } from "@/store/slices/ordersSlice";

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingDetails.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shippingDetails.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled") // Assuming non-cancelled are revenue
    .reduce((sum, o) => sum + o.total, 0);

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
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border hover:bg-foreground/5 nexamart-transition text-sm">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-card rounded-2xl p-4 sm:p-6 nexamart-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Total Orders
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {orders.length}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-4 sm:p-6 nexamart-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Pending
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "pending").length}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-4 sm:p-6 nexamart-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Shipped
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {orders.filter((o) => o.status === "shipped").length}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-4 sm:p-6 nexamart-shadow">
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
            <div className="bg-card rounded-2xl nexamart-shadow overflow-hidden">
              {filteredOrders.length === 0 ? (
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
                          className="border-b border-border/50 hover:bg-foreground/5 nexamart-transition"
                        >
                          <td className="px-3 sm:px-6 py-4">
                            <p className="font-semibold text-foreground text-sm">
                              {order.id}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {order.shippingDetails.fullName}
                            </p>
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                            <p className="font-medium text-foreground text-sm">
                              {order.shippingDetails.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.shippingDetails.email}
                            </p>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <p className="font-semibold text-foreground text-sm">
                              KES {order.total.toLocaleString()}
                            </p>
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"
                            >
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <div className="space-y-2">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleUpdateStatus(
                                    order.id,
                                    e.target.value as Order["status"],
                                  )
                                }
                                className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(order.status)}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                            <p className="text-sm text-foreground/70">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <Link
                              href="#"
                              className="p-2 hover:bg-foreground/10 rounded-lg nexamart-transition inline-flex"
                              title="View Details"
                              onClick={(e) => e.preventDefault()} // Placeholder until detail page exists
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

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
} from "lucide-react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";
import { useAppSelector } from "@/store/hooks";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  productsSold: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const orders = useAppSelector((state) => state.orders.orders);

  // Calculate stats from Redux
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Mocking customer count for now since we don't have a Users slice yet, 
  // but we can count unique emails from orders
  const uniqueCustomers = new Set(orders.map(o => o.shippingDetails.email)).size;

  const productsSold = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.items.reduce((acc, item) => acc + item.quantity, 0), 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const ordersThisMonth = orders.filter(o => {
    const date = new Date(o.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const revenueThisMonth = orders
    .filter(o => {
      const date = new Date(o.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && o.status !== 'cancelled';
    })
    .reduce((sum, o) => sum + o.total, 0);

  const stats: DashboardStats = {
    totalOrders,
    totalRevenue,
    totalCustomers: uniqueCustomers || 0, // Fallback if no orders
    productsSold,
    ordersThisMonth,
    revenueThisMonth
  };

  const recentOrders = orders.slice(0, 5); // Get first 5 (already sorted by newest in slice)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 pb-12">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
                Welcome back! Here&apos;s your business overview.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <StatCard
                icon={ShoppingCart}
                label="Total Orders"
                value={stats.totalOrders}
                color="blue"
              />
              <StatCard
                icon={TrendingUp}
                label="Total Revenue"
                value={`KES ${stats.totalRevenue.toLocaleString()}`}
                color="green"
              />
              <StatCard
                icon={Users}
                label="Customers"
                value={stats.totalCustomers}
                color="purple"
              />
              <StatCard
                icon={Package}
                label="Products Sold"
                value={stats.productsSold}
                color="orange"
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">This Month</h3>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Orders</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.ordersThisMonth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Revenue
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      KES {stats.revenueThisMonth.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    Quick Actions
                  </h3>
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <Link
                    href="/admin/products/new"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-primary/10 nexamart-transition text-sm"
                  >
                    + Add New Product
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-primary/10 nexamart-transition text-sm"
                  >
                    View All Orders
                  </Link>
                  <Link
                    href="/admin/customers"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-primary/10 nexamart-transition text-sm"
                  >
                    Manage Customers
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card rounded-2xl nexamart-shadow overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-semibold text-foreground text-lg">
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  className="text-primary hover:text-primary/80 text-sm font-medium nexamart-transition"
                >
                  View All
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No orders yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Customer
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-border/50 hover:bg-foreground/5 nexamart-transition"
                        >
                          <td className="px-3 sm:px-6 py-4 text-sm font-medium text-foreground">
                            {order.id}
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-foreground hidden sm:table-cell">
                            {order.shippingDetails.fullName}
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-sm font-semibold text-foreground">
                            KES {order.total.toLocaleString()}
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <span
                              className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-foreground/70 hidden md:table-cell">
                            {order.date}
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

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

const statColorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-primary/10", text: "text-primary" },
  green: { bg: "bg-primary/10", text: "text-primary" },
  purple: { bg: "bg-primary/10", text: "text-primary" },
  orange: { bg: "bg-primary/10", text: "text-primary" },
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: StatCardProps) {
  const colors = statColorMap[color] || statColorMap.blue;

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 nexamart-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.bg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
        </div>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

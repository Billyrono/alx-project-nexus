"use client";

import React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Eye,
  Plus,
} from "lucide-react";
import { AdminHeader } from "@/components/fannoh/admin-header";
import { AdminSidebar } from "@/components/fannoh/admin-sidebar";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  productsSold: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersGrowth: string;
  revenueGrowth: string;
  customersGrowth: string;
  productsSoldGrowth: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  date: string;
}

// Mock data fallback
const mockStats: DashboardStats = {
  totalOrders: 0,
  totalRevenue: 0,
  totalCustomers: 0,
  productsSold: 0,
  ordersThisMonth: 0,
  revenueThisMonth: 0,
  ordersGrowth: "+0%",
  revenueGrowth: "+0%",
  customersGrowth: "+0%",
  productsSoldGrowth: "+0%",
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        ...mockStats,
        totalOrders: 15,
        totalRevenue: 45000,
        totalCustomers: 8,
        productsSold: 24,
        ordersThisMonth: 5,
        revenueThisMonth: 12000,
      });
      setRecentOrders([
        { id: "ORD-001", customer: "John Doe", total: 2500, status: "delivered", date: "2024-02-15" },
        { id: "ORD-002", customer: "Jane Smith", total: 4500, status: "processing", date: "2024-02-16" },
        { id: "ORD-003", customer: "Alice Johnson", total: 1200, status: "pending", date: "2024-02-17" },
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getStatusColor = (status: RecentOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
                <p className="text-sm">
                  {error} - Showing default values. Configure Supabase to see
                  real data.
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <StatCard
                icon={ShoppingCart}
                label="Total Orders"
                value={loading ? "..." : stats.totalOrders}
                change={stats.ordersGrowth}
                color="blue"
                loading={loading}
              />
              <StatCard
                icon={TrendingUp}
                label="Total Revenue"
                value={
                  loading ? "..." : `KES ${stats.totalRevenue.toLocaleString()}`
                }
                change={stats.revenueGrowth}
                color="green"
                loading={loading}
              />
              <StatCard
                icon={Users}
                label="Customers"
                value={loading ? "..." : stats.totalCustomers}
                change={stats.customersGrowth}
                color="purple"
                loading={loading}
              />
              <StatCard
                icon={Package}
                label="Products Sold"
                value={loading ? "..." : stats.productsSold}
                change={stats.productsSoldGrowth}
                color="orange"
                loading={loading}
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-2xl p-6 fannoh-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">This Month</h3>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Orders</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats.ordersThisMonth
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Revenue
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        `KES ${stats.revenueThisMonth.toLocaleString()}`
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 fannoh-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    Quick Actions
                  </h3>
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <Link
                    href="/admin/products/new"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-primary/10 fannoh-transition text-sm"
                  >
                    + Add New Product
                  </Link>
                  <Link
                    href="/admin/orders"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-primary/10 fannoh-transition text-sm"
                  >
                    View All Orders
                  </Link>
                  <Link
                    href="/admin/customers"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-primary/10 fannoh-transition text-sm"
                  >
                    Manage Customers
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card rounded-2xl fannoh-shadow overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-semibold text-foreground text-lg">
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  className="text-primary hover:text-primary/80 text-sm font-medium fannoh-transition"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="p-6 text-center text-muted-foreground">
                  Loading orders...
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
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-8 text-center text-muted-foreground"
                          >
                            No orders yet. Orders will appear here once
                            customers make purchases.
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-border/50 hover:bg-foreground/5 fannoh-transition"
                          >
                            <td className="px-3 sm:px-6 py-4 text-sm font-medium text-foreground">
                              {order.id}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm text-foreground hidden sm:table-cell">
                              {order.customer}
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
                            <td className="px-3 sm:px-6 py-4">
                              <Link
                                href={`/admin/orders?id=${order.id}`}
                                className="p-2 hover:bg-foreground/10 rounded-lg fannoh-transition inline-block"
                              >
                                <Eye className="w-4 h-4 text-foreground/50" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
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
  change: string;
  color: string;
  loading?: boolean;
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
  change,
  color,
  loading,
}: StatCardProps) {
  const isPositive = change.startsWith("+");
  const changeColor = isPositive
    ? "text-green-600 bg-green-100"
    : "text-red-600 bg-red-100";
  const colors = statColorMap[color] || statColorMap.blue;

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 fannoh-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colors.bg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
        </div>
        <span
          className={`text-xs font-semibold ${changeColor} px-2 py-1 rounded`}
        >
          {change}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-foreground">
        {loading ? <span className="animate-pulse">Loading...</span> : value}
      </p>
    </div>
  );
}

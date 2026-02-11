"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, Loader2, RefreshCw, User } from "lucide-react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";


interface Customer {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export default function CustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    // Mock data
    setTimeout(() => {
      setCustomers([
        { id: "1", full_name: "Juma Otieno", email: "juma@example.com", phone: "0712345678", created_at: "2024-01-01T00:00:00Z", order_count: 5, total_spent: 12500 },
        { id: "2", full_name: "Wanjiku Kamau", email: "wanjiku@example.com", phone: "0723456789", created_at: "2024-01-15T00:00:00Z", order_count: 3, total_spent: 4500 },
        { id: "3", full_name: "Amina Mohamed", email: "amina@example.com", phone: "0734567890", created_at: "2024-02-01T00:00:00Z", order_count: 1, total_spent: 1500 },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm),
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce(
    (sum, c) => sum + (c.total_spent || 0),
    0,
  );
  const avgOrderValue =
    totalCustomers > 0
      ? totalRevenue /
      customers.reduce((sum, c) => sum + (c.order_count || 0), 0) || 0
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 pb-12">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-3xl text-foreground">
                  Customers
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your customer base
                </p>
              </div>
              <button
                onClick={fetchCustomers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-foreground/5 nexamart-transition disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Customers
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {totalCustomers}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-green-600">
                  KES {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <p className="text-sm text-muted-foreground mb-2">
                  Avg Order Value
                </p>
                <p className="text-3xl font-bold text-foreground">
                  KES {avgOrderValue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-card rounded-2xl nexamart-shadow overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading customers...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={fetchCustomers}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">
                    {customers.length === 0
                      ? "No customers yet"
                      : "No customers match your search"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-foreground/5">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Total Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-b border-border/50 hover:bg-foreground/5 nexamart-transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <p className="font-semibold text-foreground">
                                {customer.full_name || "Guest User"}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-foreground">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                {customer.email}
                              </div>
                              {customer.phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="w-4 h-4" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {customer.order_count || 0} orders
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-foreground">
                              KES {(customer.total_spent || 0).toLocaleString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground/70">
                              {new Date(
                                customer.created_at,
                              ).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${customer.email}`}
                                className="p-2 hover:bg-foreground/10 rounded-lg nexamart-transition"
                                title="Send Email"
                              >
                                <Mail className="w-4 h-4 text-foreground/50" />
                              </a>
                              {customer.phone && (
                                <a
                                  href={`tel:${customer.phone}`}
                                  className="p-2 hover:bg-foreground/10 rounded-lg nexamart-transition"
                                  title="Call"
                                >
                                  <Phone className="w-4 h-4 text-foreground/50" />
                                </a>
                              )}
                            </div>
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

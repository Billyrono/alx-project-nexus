"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  X,
  AlertTriangle,
} from "lucide-react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";

import { api, Product } from "@/services/api";

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch products
      const data = await api.getProducts();
      setProducts(data.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
      // Use mock data
      setProducts([
        { id: 1, title: "Essence Mascara Lash Princess", price: 9.99, stock: 5, category: "beauty", thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png", rating: 4.5, review_count: 10 } as any,
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmDelete = async () => {
    if (!deleteModal) return;
    const id = deleteModal.id;
    setDeleting(id);
    // Delete product
    setTimeout(() => {
      setProducts(products.filter((p) => p.id !== id));
      setDeleteModal(null);
      setDeleting(null);
    }, 1000);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0,
  );
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 pb-12">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground">
                  Products
                </h1>
                <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
                  Manage your product catalog
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchProducts}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-foreground/5 nexamart-transition text-sm"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 nexamart-transition font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Link>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                {error}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-card rounded-2xl p-4 sm:p-6 nexamart-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Total Products
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {products.length}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-4 sm:p-6 nexamart-shadow">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Total Stock
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {totalStock}
                </p>
              </div>
              <div className="bg-card rounded-2xl p-4 sm:p-6 nexamart-shadow col-span-2 sm:col-span-1">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  Inventory Value
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  KES {totalValue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-card rounded-2xl nexamart-shadow overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50 bg-foreground/5">
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Category
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                          Stock
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                          Rating
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                          Status
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-border/50 hover:bg-foreground/5 nexamart-transition"
                        >
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                                <Image
                                  src={product.thumbnail || "/placeholder.svg"}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                  priority
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground text-xs sm:text-sm line-clamp-2 max-w-[120px] sm:max-w-[200px]">
                                  {product.title}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize sm:hidden">
                                  {product.category}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">
                            <span className="text-sm text-foreground/70 capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <p className="font-semibold text-foreground text-xs sm:text-sm">
                              KES {product.price.toLocaleString()}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 20
                                ? "bg-green-100 text-green-800"
                                : product.stock > 5
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">
                            <p className="text-sm text-foreground">
                              <span className="text-amber-400">★</span>{" "}
                              {product.rating?.toFixed(1) || "5.0"}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4 hidden md:table-cell">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                            >
                              {product.stock > 0 ? "In Stock" : "Out"}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/admin/products/${product.id}`}
                                className="p-2 hover:bg-foreground/10 rounded-lg nexamart-transition"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 text-foreground/50" />
                              </Link>
                              <button
                                onClick={() => setDeleteModal(product)}
                                disabled={deleting === product.id}
                                className="p-2 hover:bg-red-50 rounded-lg nexamart-transition disabled:opacity-50"
                                title="Delete"
                              >
                                {deleting === product.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                )}
                              </button>
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

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full nexamart-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Delete Product
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-foreground mb-6">
              Are you sure you want to delete{" "}
              <strong>{deleteModal.title}</strong>? This will permanently remove
              the product from your catalog.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting === deleteModal.id}
                className="px-4 py-2 rounded-lg border border-border hover:bg-foreground/5 nexamart-transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting === deleteModal.id}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 nexamart-transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {deleting === deleteModal.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

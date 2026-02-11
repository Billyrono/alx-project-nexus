"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";


const routineSteps = [
  "cleanser",
  "toner",
  "serum",
  "moisturizer",
  "sunscreen",
  "treatment",
];
const skinTypes = ["oily", "dry", "combination", "sensitive", "normal"];
const concerns = [
  "acne",
  "aging",
  "dryness",
  "dullness",
  "hyperpigmentation",
  "redness",
  "pores",
];

export default function NewProductPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    original_price: "",
    routine_step: "serum",
    skin_types: [] as string[],
    concerns: [] as string[],
    size: "",
    image: "",
    in_stock: true,
    quantity_in_stock: "50",
    benefits: "",
    how_to_use: "",
    ingredients: "",
    contraindications: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setError(null);

    // Mock upload
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, image: "https://via.placeholder.com/300" }));
      setUploading(false);
    }, 1000);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const id = formData.id || formData.name.toLowerCase().replace(/\s+/g, "-");

    // Mock creation
    setTimeout(() => {
      router.push("/admin/products");
      setSaving(false);
    }, 1000);
  };

  const toggleArrayField = (
    field: "skin_types" | "concerns",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 pb-12">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link
                href="/admin/products"
                className="p-2 hover:bg-foreground/10 rounded-lg nexamart-transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-serif text-3xl text-foreground">
                  Add New Product
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create a new product in your catalog
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Vitamin C Brightening Serum"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Short product description..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="29.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Original Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          original_price: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="39.99 (if on sale)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Size *
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="30ml"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Routine Step *
                    </label>
                    <select
                      value={formData.routine_step}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          routine_step: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {routineSteps.map((step) => (
                        <option key={step} value={step}>
                          {step.charAt(0).toUpperCase() + step.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Skin Types & Concerns */}
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Target Audience
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Skin Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skinTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleArrayField("skin_types", type)}
                          className={`px-4 py-2 rounded-full text-sm font-medium nexamart-transition ${formData.skin_types.includes(type)
                            ? "bg-primary text-primary-foreground"
                            : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                            }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Skin Concerns
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {concerns.map((concern) => (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => toggleArrayField("concerns", concern)}
                          className={`px-4 py-2 rounded-full text-sm font-medium nexamart-transition ${formData.concerns.includes(concern)
                            ? "bg-primary text-primary-foreground"
                            : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                            }`}
                        >
                          {concern.charAt(0).toUpperCase() + concern.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Inventory
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity_in_stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity_in_stock: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="in_stock"
                      checked={formData.in_stock}
                      onChange={(e) =>
                        setFormData({ ...formData, in_stock: e.target.checked })
                      }
                      className="w-5 h-5"
                    />
                    <label
                      htmlFor="in_stock"
                      className="text-sm font-medium text-foreground"
                    >
                      In Stock
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Product Image
                </h2>
                <div className="space-y-4">
                  {imagePreview || formData.image ? (
                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-border">
                      <Image
                        src={imagePreview || formData.image}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-48 h-48 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload
                      </span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Uploading image...</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: JPG, PNG, WebP, GIF. Max size: 5MB
                  </p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-card rounded-2xl p-6 nexamart-shadow">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Additional Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Benefits (one per line)
                    </label>
                    <textarea
                      value={formData.benefits}
                      onChange={(e) =>
                        setFormData({ ...formData, benefits: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Hydrates skin&#10;Reduces fine lines&#10;Improves radiance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      How to Use
                    </label>
                    <textarea
                      value={formData.how_to_use}
                      onChange={(e) =>
                        setFormData({ ...formData, how_to_use: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Apply 2-3 drops to clean skin, morning and night..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ingredients (one per line — Name: Benefit)
                    </label>
                    <textarea
                      value={formData.ingredients}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ingredients: e.target.value,
                        })
                      }
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={
                        "Vitamin C: Brightens skin and reduces dark spots\nHyaluronic Acid: Deep hydration and plumping\nNiacinamide: Minimizes pores and evens skin tone"
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: Ingredient Name: Benefit description (one per
                      line)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Contraindications (one per line)
                    </label>
                    <textarea
                      value={formData.contraindications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contraindications: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={
                        "Avoid if allergic to citrus extracts\nNot recommended during pregnancy\nDo not use on broken or irritated skin"
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      List any warnings, allergies, or situations where the
                      product should not be used.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4">
                <Link
                  href="/admin/products"
                  className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-foreground/10 nexamart-transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 nexamart-transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Loader2, CheckCircle, Upload, X } from "lucide-react";
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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
      setImagePreview(null);
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

  useEffect(() => {
    const fetchProduct = async () => {
      setTimeout(() => {
        setFormData({
          id: productId,
          name: "Essence Mascara Lash Princess",
          description: "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
          price: "9.99",
          original_price: "12.99",
          routine_step: "beauty",
          skin_types: [],
          concerns: [],
          size: "10ml",
          image: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
          in_stock: true,
          quantity_in_stock: "5",
          benefits: "Volumizing\nLengthening\nCruelty-free",
          how_to_use: "Apply to lashes from root to tip.",
          ingredients: "Water: Hydration\nBeeswax: Structure",
          contraindications: "",
        });
        setLoading(false);
      }, 1000);
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    // Mock update
    setTimeout(() => {
      setSuccess(true);
      // Redirect after short delay to show success message
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  Edit Product
                </h1>
                <p className="text-muted-foreground mt-1">{formData.name}</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Product saved successfully! Redirecting...
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Image
                    </label>
                    <div className="flex items-start gap-4">
                      {imagePreview || formData.image ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                          <Image
                            src={imagePreview || formData.image}
                            alt="Product preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">
                            Upload
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          placeholder="Or enter image URL"
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {uploading && (
                          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Uploading...</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG, WebP, GIF (max 5MB)
                        </p>
                      </div>
                    </div>
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
                        "Vitamin C: Brightens skin and reduces dark spots\nHyaluronic Acid: Deep hydration and plumping"
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
                        "Avoid if allergic to citrus extracts\nNot recommended during pregnancy"
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
                  disabled={saving || success}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 nexamart-transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
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

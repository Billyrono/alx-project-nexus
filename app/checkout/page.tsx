"use client";

import React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Check,
  Lock,
  Truck,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { addOrder } from "@/store/slices/ordersSlice";

type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  buildingApartment: string;
  areaLandmark: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  deliveryInstructions: string;
  shippingMethod: "standard" | "express";
}

interface PaymentFormData {
  method: "card" | "mpesa" | "bank_transfer";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  mpesaPhone?: string;
  accountHolder?: string;
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: "",
    streetAddress: "",
    buildingApartment: "",
    areaLandmark: "",
    city: "",
    county: "Nairobi",
    postalCode: "",
    country: "Kenya",
    deliveryInstructions: "",
    shippingMethod: "standard",
  });

  // Pre-fill shipping data from user's saved address (Mock)
  useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
      }));
    }
  }, [user]);

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    method: "card",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Shipping constants
  const MIN_ORDER_AMOUNT = 400;
  const FREE_SHIPPING_THRESHOLD = 5000;
  const RATES = {
    nairobi: { standard: 150, express: 350 },
    other: { standard: 250, express: 500 },
  };

  // Calculate shipping cost based on location and cart value
  const isNairobi = shippingData.county === "Nairobi";
  const locationRates = isNairobi ? RATES.nairobi : RATES.other;

  // Free shipping logic
  const isFreeShipping = totalAmount >= FREE_SHIPPING_THRESHOLD;

  const shippingCosts = {
    standard: isFreeShipping ? 0 : locationRates.standard,
    express: locationRates.express, // Express is never free unless specified, but user requirement implies "order above 5000 should be free" usually applies to standard. Assuming express is still paid or maybe free? Prompt says "oder above 5000 shoul be free", usually implies standard. sticking to standard free.
  };

  const selectedShippingCost = shippingCosts[shippingData.shippingMethod];
  const subtotal = totalAmount;
  const shippingCost = currentStep !== "cart" ? selectedShippingCost : 0;
  // Prices are post-tax (VAT included)
  const orderTotal = subtotal + shippingCost;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setCurrentStep("payment");
    }
  };

  const validateShippingForm = (): boolean => {
    if (!shippingData.fullName || !shippingData.email || !shippingData.phone) {
      alert("Please fill in all required fields");
      return false;
    }
    if (
      !shippingData.streetAddress ||
      !shippingData.city ||
      !shippingData.postalCode
    ) {
      alert("Please complete your shipping address");
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
        items: items,
        total: orderTotal,
        shippingDetails: {
          ...shippingData,
          country: shippingData.country || 'Kenya', // Ensure country is set
          postalCode: shippingData.postalCode || ''
        },
        paymentMethod: paymentData.method,
        userId: user?.id ? String(user.id) : undefined
      };

      setOrderNumber(newOrder.id);
      dispatch(addOrder(newOrder));

      setIsProcessing(false);
      setCurrentStep("confirmation");
      dispatch(clearCart());
    }, 2000);
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-24 sm:pt-28 pb-12 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-4 sm:mb-8">
              {[
                { step: "cart", label: "Cart" },
                { step: "shipping", label: "Shipping" },
                { step: "payment", label: "Payment" },
                { step: "confirmation", label: "Confirmation" },
              ].map((item, idx) => (
                <div key={item.step} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        item.step === "cart" ||
                        (item.step === "shipping" && currentStep !== "cart") ||
                        (item.step === "payment" &&
                          (currentStep === "payment" ||
                            currentStep === "confirmation")) ||
                        (item.step === "confirmation" &&
                          currentStep === "confirmation")
                      ) {
                        setCurrentStep(item.step as CheckoutStep);
                      }
                    }}
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-medium nexamart-transition ${currentStep === item.step
                      ? "bg-primary text-primary-foreground"
                      : ["cart", "shipping", "payment"].includes(item.step) &&
                        (currentStep === "payment" ||
                          currentStep === "confirmation")
                        ? "bg-primary/20 text-primary cursor-pointer"
                        : "bg-card text-muted-foreground"
                      }`}
                  >
                    {["cart", "shipping", "payment"].includes(item.step) &&
                      (currentStep === "payment" ||
                        currentStep === "confirmation") &&
                      item.step !== currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </button>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${["cart", "shipping"].includes(item.step) &&
                        (currentStep === "payment" ||
                          currentStep === "confirmation")
                        ? "bg-primary"
                        : currentStep === item.step ||
                          (currentStep === "payment" &&
                            item.step === "shipping") ||
                          (currentStep === "confirmation" &&
                            item.step !== "confirmation")
                          ? "bg-primary/30"
                          : "bg-border"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {currentStep === "cart" && "Review your items"}
              {currentStep === "shipping" && "Enter shipping information"}
              {currentStep === "payment" && "Choose payment method"}
              {currentStep === "confirmation" && "Your order is confirmed"}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Cart Review */}
              {currentStep === "cart" && (
                <div className="space-y-6">
                  <h1 className="font-serif text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">
                    Your Cart
                  </h1>

                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        Your cart is empty
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Continue Shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 bg-card rounded-2xl p-6 nexamart-shadow">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 pb-4 border-b border-border/50 last:border-b-0 last:pb-0"
                          >
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={item.thumbnail || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-cover"
                                priority
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground/70">
                                  Qty: {item.quantity}
                                </span>
                                <span className="font-semibold text-foreground">
                                  KES{" "}
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentStep("shipping")}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium nexamart-transition hover:bg-primary/90"
                      >
                        Proceed to Shipping
                      </button>

                      <Link
                        href="/shop"
                        className="block text-center text-primary hover:text-primary/80 font-medium"
                      >
                        Continue Shopping
                      </Link>
                    </>
                  )}
                </div>
              )}

              {/* Shipping Form */}
              {currentStep === "shipping" && (
                <form
                  onSubmit={handleShippingSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <h1 className="font-serif text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">
                    Shipping Information
                  </h1>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingData.fullName}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingData.email}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Kenyatta Avenue, Moi Road"
                      value={shippingData.streetAddress}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          streetAddress: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Building / Apartment
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Sunrise Apartments, Block B, Floor 3"
                        value={shippingData.buildingApartment}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            buildingApartment: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Area / Estate / Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Near Yaya Centre, Kilimani"
                        value={shippingData.areaLandmark}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            areaLandmark: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Nairobi, Mombasa"
                        value={shippingData.city}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        County *
                      </label>
                      <select
                        required
                        value={shippingData.county}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            county: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Nairobi">Nairobi</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Kisumu">Kisumu</option>
                        <option value="Nakuru">Nakuru</option>
                        <option value="Kiambu">Kiambu</option>
                        <option value="Machakos">Machakos</option>
                        <option value="Kajiado">Kajiado</option>
                        <option value="Uasin Gishu">Uasin Gishu</option>
                        <option value="Meru">Meru</option>
                        <option value="Kilifi">Kilifi</option>
                        <option value="Kakamega">Kakamega</option>
                        <option value="Nyeri">Nyeri</option>
                        <option value="Murang'a">Murang&apos;a</option>
                        <option value="Bungoma">Bungoma</option>
                        <option value="Trans Nzoia">Trans Nzoia</option>
                        <option value="Kericho">Kericho</option>
                        <option value="Nyandarua">Nyandarua</option>
                        <option value="Kwale">Kwale</option>
                        <option value="Kirinyaga">Kirinyaga</option>
                        <option value="Embu">Embu</option>
                        <option value="Laikipia">Laikipia</option>
                        <option value="Kitui">Kitui</option>
                        <option value="Makueni">Makueni</option>
                        <option value="Nandi">Nandi</option>
                        <option value="Bomet">Bomet</option>
                        <option value="Narok">Narok</option>
                        <option value="Migori">Migori</option>
                        <option value="Homa Bay">Homa Bay</option>
                        <option value="Kisii">Kisii</option>
                        <option value="Nyamira">Nyamira</option>
                        <option value="Siaya">Siaya</option>
                        <option value="Vihiga">Vihiga</option>
                        <option value="Busia">Busia</option>
                        <option value="Elgeyo Marakwet">Elgeyo Marakwet</option>
                        <option value="Baringo">Baringo</option>
                        <option value="Turkana">Turkana</option>
                        <option value="West Pokot">West Pokot</option>
                        <option value="Samburu">Samburu</option>
                        <option value="Isiolo">Isiolo</option>
                        <option value="Marsabit">Marsabit</option>
                        <option value="Mandera">Mandera</option>
                        <option value="Wajir">Wajir</option>
                        <option value="Garissa">Garissa</option>
                        <option value="Tana River">Tana River</option>
                        <option value="Lamu">Lamu</option>
                        <option value="Taita Taveta">Taita Taveta</option>
                        <option value="Tharaka Nithi">Tharaka Nithi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 00100"
                        value={shippingData.postalCode}
                        onChange={(e) =>
                          setShippingData({
                            ...shippingData,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Delivery Instructions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g., Call on arrival, leave with guard, ring doorbell twice..."
                      value={shippingData.deliveryInstructions}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          deliveryInstructions: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country
                    </label>
                    <select
                      value={shippingData.country}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>Kenya</option>
                      <option>Uganda</option>
                      <option>Tanzania</option>
                    </select>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-4">
                      Shipping Method
                    </label>
                    <div className="space-y-3">
                      {[
                        {
                          value: "standard",
                          label: "Standard (3-5 business days)",
                        },
                        {
                          value: "express",
                          label: "Express (1-2 business days)",
                        },
                      ].map((method) => {
                        const cost =
                          shippingCosts[method.value as "standard" | "express"];

                        return (
                          <label
                            key={method.value}
                            className="flex items-center p-4 border border-border rounded-lg cursor-pointer nexamart-transition hover:bg-card/50"
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={method.value}
                              checked={
                                shippingData.shippingMethod === method.value
                              }
                              onChange={(e) =>
                                setShippingData({
                                  ...shippingData,
                                  shippingMethod: e.target.value as
                                    | "standard"
                                    | "express",
                                })
                              }
                              className="w-4 h-4"
                            />
                            <div className="flex-1 ml-3">
                              <p className="font-medium text-foreground">
                                {method.label}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {cost > 0
                                  ? `KES ${cost.toLocaleString()}`
                                  : "Free"}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("cart")}
                      className="flex-1 px-6 py-3 rounded-full border border-foreground/20 text-foreground font-medium nexamart-transition hover:bg-foreground/5"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium nexamart-transition hover:bg-primary/90"
                    >
                      <span className="sm:hidden">Continue</span>
                      <span className="hidden sm:inline">
                        Continue to Payment
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* Payment Form */}
              {currentStep === "payment" && (
                <form
                  onSubmit={handlePaymentSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <h1 className="font-serif text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">
                    Payment Method
                  </h1>

                  <div className="space-y-3">
                    {[
                      {
                        value: "card",
                        label: "Credit/Debit Card",
                        icon: CreditCard,
                      },
                      { value: "mpesa", label: "M-Pesa", icon: Truck },
                      {
                        value: "bank_transfer",
                        label: "Bank Transfer",
                        icon: Lock,
                      },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.value}
                          className="flex items-center p-4 border border-border rounded-lg cursor-pointer nexamart-transition hover:bg-card/50"
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.value}
                            checked={paymentData.method === method.value}
                            onChange={(e) =>
                              setPaymentData({ method: e.target.value as any })
                            }
                            className="w-4 h-4"
                          />
                          <Icon className="w-5 h-5 ml-3 text-primary" />
                          <span className="ml-3 font-medium text-foreground">
                            {method.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Card Payment */}
                  {paymentData.method === "card" && (
                    <div className="space-y-4 bg-card rounded-lg p-4 sm:p-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          value={paymentData.cardNumber || ""}
                          onChange={(e) => {
                            // Remove non-digits, limit to 16 digits, format as 4x4 with spaces
                            const digits = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16);
                            const formatted = digits.replace(
                              /(\d{4})(?=\d)/g,
                              "$1 ",
                            );
                            setPaymentData({
                              ...paymentData,
                              cardNumber: formatted,
                            });
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-wider"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={paymentData.expiryDate || ""}
                            onChange={(e) => {
                              let value = e.target.value;
                              const prevValue = paymentData.expiryDate || "";

                              // If user is deleting, allow it
                              if (value.length < prevValue.length) {
                                setPaymentData({
                                  ...paymentData,
                                  expiryDate: value,
                                });
                                return;
                              }

                              // Remove non-digits for processing
                              const digits = value.replace(/\D/g, "");

                              if (digits.length === 0) {
                                setPaymentData({
                                  ...paymentData,
                                  expiryDate: "",
                                });
                                return;
                              }

                              // Validate month (01-12)
                              let month = digits.slice(0, 2);
                              if (digits.length === 1) {
                                // If first digit > 1, prepend 0
                                if (parseInt(digits[0]) > 1) {
                                  month = "0" + digits[0];
                                  const formatted = month + "/";
                                  setPaymentData({
                                    ...paymentData,
                                    expiryDate: formatted,
                                  });
                                  return;
                                }
                                setPaymentData({
                                  ...paymentData,
                                  expiryDate: digits,
                                });
                                return;
                              }

                              // Clamp month to 01-12
                              const monthNum = parseInt(month);
                              if (monthNum === 0) month = "01";
                              else if (monthNum > 12) month = "12";

                              if (digits.length <= 2) {
                                setPaymentData({
                                  ...paymentData,
                                  expiryDate: month + "/",
                                });
                                return;
                              }

                              // Year part
                              const year = digits.slice(2, 4);
                              setPaymentData({
                                ...paymentData,
                                expiryDate: month + "/" + year,
                              });
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-wider"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="123"
                            maxLength={4}
                            value={paymentData.cvv || ""}
                            onChange={(e) => {
                              const digits = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4);
                              setPaymentData({ ...paymentData, cvv: digits });
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-wider"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* M-Pesa */}
                  {paymentData.method === "mpesa" && (
                    <div className="bg-card rounded-lg p-6 space-y-4">
                      <p className="text-sm text-foreground/80">
                        Enter your M-Pesa phone number to complete the payment.
                      </p>
                      <input
                        type="tel"
                        placeholder="254712345678"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {paymentData.method === "bank_transfer" && (
                    <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6 space-y-3">
                      <p className="text-sm text-foreground/80">
                        Please transfer the payment to the bank account details
                        that will be provided after confirming your order.
                      </p>
                      <div className="bg-background rounded p-3 text-sm text-foreground/70">
                        Bank details will be sent to your email upon order
                        confirmation.
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("shipping")}
                      className="flex-1 px-6 py-3 rounded-full border border-foreground/20 text-foreground font-medium nexamart-transition hover:bg-foreground/5"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium nexamart-transition hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span className="sm:hidden">Complete</span>
                          <span className="hidden sm:inline">
                            Complete Purchase
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Confirmation */}
              {currentStep === "confirmation" && orderNumber && (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-serif text-3xl text-foreground mb-2">
                      Order Confirmed!
                    </h1>
                    <p className="text-muted-foreground mb-4">
                      Thank you for your purchase
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      Order #{orderNumber}
                    </p>
                  </div>

                  <div className="bg-card rounded-2xl p-6 text-left space-y-3">
                    <p className="text-sm text-muted-foreground">
                      A confirmation email has been sent to{" "}
                      <strong>{shippingData.email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You&apos;ll receive a WhatsApp notification on{" "}
                      <strong>{shippingData.phone}</strong> when your order
                      ships.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Link
                      href="/shop"
                      className="flex-1 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium nexamart-transition hover:bg-primary/90"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      href="/"
                      className="flex-1 px-6 py-3 rounded-full border border-foreground/20 text-foreground font-medium nexamart-transition hover:bg-foreground/5"
                    >
                      Back Home
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            {currentStep !== "confirmation" && (
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-4 sm:p-6 sticky top-28 sm:top-32 nexamart-shadow">
                  <h2 className="font-semibold text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 pb-6 border-b border-border/50">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-foreground/70">
                          {item.title} x {item.quantity}
                        </span>
                        <span className="font-medium text-foreground">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 py-6 border-b border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Subtotal</span>
                      <span className="text-foreground">
                        <span>KES {totalAmount.toLocaleString()}</span>
                      </span>
                    </div>
                    {currentStep !== "cart" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">Shipping</span>
                          <span className="text-foreground">
                            {shippingCost > 0
                              ? `KES ${shippingCost.toLocaleString()}`
                              : "Free"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">VAT (16%)</span>
                          <span className="text-foreground text-sm">
                            KES{" "}
                            {Math.round(
                              (subtotal * 0.16) / 1.16,
                            ).toLocaleString()}{" "}
                            <span className="text-xs text-muted-foreground">
                              (incl.)
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          All prices include 16% VAT
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-6">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      KES{" "}
                      {currentStep === "cart"
                        ? subtotal.toLocaleString()
                        : orderTotal.toLocaleString()}
                    </span>
                  </div>

                  {currentStep === "cart" && items.length === 0 && (
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                      Your cart is empty
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

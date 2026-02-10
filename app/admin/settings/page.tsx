"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Store,
  Truck,
  Mail,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Palette,
  CheckCircle,
} from "lucide-react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";

// Settings storage key
const SETTINGS_KEY = "nexamart_admin_settings";

// Default settings
const defaultStoreSettings = {
  storeName: "NexaMart Marketplace",
  tagline: "Premium Lifestyle Solutions",
  email: "hello@nexamart.com",
  phone: "0700000000",
  address: "Nairobi, Kenya",
  currency: "KES",
  timezone: "Africa/Nairobi",
};

const defaultShippingSettings = {
  freeShippingThreshold: 2000,
  standardShippingCost: 200,
  expressShippingCost: 400,
  processingDays: 2,
  standardDeliveryDays: "3-5",
  expressDeliveryDays: "1-2",
};

const defaultEmailSettings = {
  orderConfirmation: true,
  shippingNotification: true,
  deliveryConfirmation: true,
  newsletterEnabled: true,
  promotionalEmails: true,
};

const defaultPaymentSettings = {
  paystackEnabled: true,
  testMode: true,
  mpesaEnabled: false,
  cashOnDelivery: false,
};

const defaultNotificationSettings = {
  newOrderAlert: true,
  lowStockAlert: true,
  lowStockThreshold: 5,
  customerInquiry: true,
  dailySummary: false,
};

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState(defaultStoreSettings);
  const [shippingSettings, setShippingSettings] = useState(
    defaultShippingSettings,
  );
  const [emailSettings, setEmailSettings] = useState(defaultEmailSettings);
  const [paymentSettings, setPaymentSettings] = useState(
    defaultPaymentSettings,
  );
  const [notificationSettings, setNotificationSettings] = useState(
    defaultNotificationSettings,
  );

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.store)
          setStoreSettings({ ...defaultStoreSettings, ...parsed.store });
        if (parsed.shipping)
          setShippingSettings({
            ...defaultShippingSettings,
            ...parsed.shipping,
          });
        if (parsed.email)
          setEmailSettings({ ...defaultEmailSettings, ...parsed.email });
        if (parsed.payment)
          setPaymentSettings({ ...defaultPaymentSettings, ...parsed.payment });
        if (parsed.notifications)
          setNotificationSettings({
            ...defaultNotificationSettings,
            ...parsed.notifications,
          });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    setLoaded(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    // Save to localStorage
    try {
      const allSettings = {
        store: storeSettings,
        shipping: shippingSettings,
        email: emailSettings,
        payment: paymentSettings,
        notifications: notificationSettings,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(allSettings));

      // Simulate a brief delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Store },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "email", label: "Email", icon: Mail },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 pb-12">
          <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-foreground">
                  Settings
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Configure your store settings
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 disabled:opacity-50 transition-all text-sm w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-border overflow-x-auto scrollbar-hide">
              <nav className="flex gap-4 sm:gap-8 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 border-b-2 transition-colors text-xs sm:text-sm whitespace-nowrap ${activeTab === tab.id
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-card rounded-2xl p-4 sm:p-6 lg:p-8 border border-border">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      Store Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Store Name
                        </label>
                        <input
                          type="text"
                          value={storeSettings.storeName}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              storeName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={storeSettings.tagline}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              tagline: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={storeSettings.email}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={storeSettings.phone}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={storeSettings.address}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Regional Settings
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Currency
                        </label>
                        <select
                          value={storeSettings.currency}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="KES">KES - Kenyan Shilling</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Timezone
                        </label>
                        <select
                          value={storeSettings.timezone}
                          onChange={(e) =>
                            setStoreSettings({
                              ...storeSettings,
                              timezone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="Africa/Nairobi">
                            Africa/Nairobi (EAT)
                          </option>
                          <option value="UTC">UTC</option>
                          <option value="Europe/London">
                            Europe/London (GMT)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping & Order Settings */}
              {activeTab === "shipping" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      Order Rules
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Minimum Order Amount (KES)
                        </label>
                        <input
                          type="number"
                          value={1000}
                          disabled
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Orders below this amount will be blocked
                        </p>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">
                            Small Order Contact
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Allow customers to contact sales for small orders
                          </p>
                        </div>
                        <ToggleSetting
                          label=""
                          description=""
                          checked={true}
                          onChange={() => { }}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg md:col-span-2">
                        <div>
                          <p className="font-medium text-foreground">
                            Product Bundling
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Enable product bundles on shop page
                          </p>
                        </div>
                        <ToggleSetting
                          label=""
                          description=""
                          checked={true}
                          onChange={() => { }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Rates
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Free Shipping Threshold (KES)
                        </label>
                        <input
                          type="number"
                          value={shippingSettings.freeShippingThreshold}
                          onChange={(e) =>
                            setShippingSettings({
                              ...shippingSettings,
                              freeShippingThreshold: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Orders above this amount get free shipping
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Standard Shipping (Nairobi)
                        </label>
                        <input
                          type="number"
                          value={150}
                          onChange={() => { }}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Standard Shipping (Other Counties)
                        </label>
                        <input
                          type="number"
                          value={250}
                          onChange={() => { }}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Express Shipping (Nairobi)
                        </label>
                        <input
                          type="number"
                          value={350}
                          onChange={() => { }}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Express Shipping (Other Counties)
                        </label>
                        <input
                          type="number"
                          value={500}
                          onChange={() => { }}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Delivery Times
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Processing Days
                        </label>
                        <input
                          type="number"
                          value={shippingSettings.processingDays}
                          onChange={(e) =>
                            setShippingSettings({
                              ...shippingSettings,
                              processingDays: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Standard Delivery (Days)
                        </label>
                        <input
                          type="text"
                          value={shippingSettings.standardDeliveryDays}
                          onChange={(e) =>
                            setShippingSettings({
                              ...shippingSettings,
                              standardDeliveryDays: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Express Delivery (Days)
                        </label>
                        <input
                          type="text"
                          value={shippingSettings.expressDeliveryDays}
                          onChange={(e) =>
                            setShippingSettings({
                              ...shippingSettings,
                              expressDeliveryDays: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === "email" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Order Notifications
                    </h2>
                    <div className="space-y-4">
                      <ToggleSetting
                        label="Order Confirmation Email"
                        description="Send email when a customer places an order"
                        checked={emailSettings.orderConfirmation}
                        onChange={(checked) =>
                          setEmailSettings({
                            ...emailSettings,
                            orderConfirmation: checked,
                          })
                        }
                      />
                      <ToggleSetting
                        label="Shipping Notification"
                        description="Send email when order is shipped"
                        checked={emailSettings.shippingNotification}
                        onChange={(checked) =>
                          setEmailSettings({
                            ...emailSettings,
                            shippingNotification: checked,
                          })
                        }
                      />
                      <ToggleSetting
                        label="Delivery Confirmation"
                        description="Send email when order is delivered"
                        checked={emailSettings.deliveryConfirmation}
                        onChange={(checked) =>
                          setEmailSettings({
                            ...emailSettings,
                            deliveryConfirmation: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Marketing Emails
                    </h2>
                    <div className="space-y-4">
                      <ToggleSetting
                        label="Newsletter"
                        description="Enable newsletter subscription feature"
                        checked={emailSettings.newsletterEnabled}
                        onChange={(checked) =>
                          setEmailSettings({
                            ...emailSettings,
                            newsletterEnabled: checked,
                          })
                        }
                      />
                      <ToggleSetting
                        label="Promotional Emails"
                        description="Send promotional and sale notifications"
                        checked={emailSettings.promotionalEmails}
                        onChange={(checked) =>
                          setEmailSettings({
                            ...emailSettings,
                            promotionalEmails: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === "payment" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Methods
                    </h2>
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <ToggleSetting
                          label="Paystack (Active)"
                          description="Accept card and mobile money payments via Paystack"
                          checked={paymentSettings.paystackEnabled}
                          onChange={(checked) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              paystackEnabled: checked,
                            })
                          }
                        />
                        <ToggleSetting
                          label="M-Pesa (Active)"
                          description="Accept M-Pesa mobile payments directly"
                          checked={true}
                          onChange={() => { }}
                        />
                        <ToggleSetting
                          label="Bank Transfer"
                          description="Enable direct bank transfers for large orders"
                          checked={true}
                          onChange={() => { }}
                        />
                        <ToggleSetting
                          label="Cash on Delivery"
                          description="Allow customers to pay on delivery (Nairobi Only)"
                          checked={paymentSettings.cashOnDelivery}
                          onChange={(checked) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              cashOnDelivery: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      API Keys
                    </h2>
                    <div className="bg-accent/30 rounded-lg p-4 border border-border">
                      <p className="text-sm text-muted-foreground">
                        API keys are configured via environment variables for
                        security. Contact your developer to update Paystack
                        keys.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          {paymentSettings.testMode ? "TEST MODE" : "LIVE MODE"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Admin Notifications
                    </h2>
                    <div className="space-y-4">
                      <ToggleSetting
                        label="New Order Alert"
                        description="Get notified when a new order is placed"
                        checked={notificationSettings.newOrderAlert}
                        onChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            newOrderAlert: checked,
                          })
                        }
                      />
                      <ToggleSetting
                        label="Low Stock Alert"
                        description="Get notified when product stock is low"
                        checked={notificationSettings.lowStockAlert}
                        onChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            lowStockAlert: checked,
                          })
                        }
                      />
                      {notificationSettings.lowStockAlert && (
                        <div className="pl-6">
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Low Stock Threshold
                          </label>
                          <input
                            type="number"
                            value={notificationSettings.lowStockThreshold}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                lowStockThreshold: Number(e.target.value),
                              })
                            }
                            className="w-32 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Alert when stock falls below this number
                          </p>
                        </div>
                      )}
                      <ToggleSetting
                        label="Customer Inquiry"
                        description="Get notified when a customer submits a contact form"
                        checked={notificationSettings.customerInquiry}
                        onChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            customerInquiry: checked,
                          })
                        }
                      />
                      <ToggleSetting
                        label="Daily Summary"
                        description="Receive a daily summary email of orders and activity"
                        checked={notificationSettings.dailySummary}
                        onChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            dailySummary: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Toggle Setting Component
function ToggleSetting({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border border-border ${disabled ? "opacity-50" : ""}`}
    >
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"
          }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-0"
            }`}
        />
      </button>
    </div>
  );
}

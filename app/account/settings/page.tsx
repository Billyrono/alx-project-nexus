"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  ChevronLeft,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Camera,
  Trash2,
  Lock,
  Bell,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

type SettingsTab =
  | "profile"
  | "address"
  | "password"
  | "preferences"
  | "privacy";

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [skinType, setSkinType] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Address state
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Kenya");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // General
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setFullName(user.firstName + " " + user.lastName);
      setPhone("");
      const savedSettings = localStorage.getItem(`user_settings_${user.id}`);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setStreetAddress(parsed.streetAddress || "");
        setCity(parsed.city || "");
        setStateProvince(parsed.stateProvince || "");
        setPostalCode(parsed.postalCode || "");
        setCountry(parsed.country || "Kenya");
        setSkinType(parsed.skinType || "");
        setDateOfBirth(parsed.dateOfBirth || "");
        setEmailNotifications(parsed.emailNotifications ?? true);
        setOrderUpdates(parsed.orderUpdates ?? true);
        setPromotionalEmails(parsed.promotionalEmails ?? false);
        setNewsletterSubscribed(parsed.newsletterSubscribed ?? false);
        setAvatarUrl(parsed.avatarUrl || user.image || null);
      } else {
        setAvatarUrl(user.image || null);
      }

      setProfileLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    setMessage(null);

    setTimeout(() => {
      const mockUrl = "https://via.placeholder.com/150";
      setAvatarUrl(mockUrl);
      saveToLocalStorage({ avatarUrl: mockUrl });
      setMessage({ type: "success", text: "Profile picture updated!" });
      setUploadingAvatar(false);
    }, 1000);
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setUploadingAvatar(true);
    // Mock remove
    setTimeout(() => {
      setAvatarUrl(null);
      saveToLocalStorage({ avatarUrl: null });
      setMessage({ type: "success", text: "Profile picture removed." });
      setUploadingAvatar(false);
    }, 1000);
  };

  const saveToLocalStorage = (data: any) => {
    if (!user) return;
    const current = localStorage.getItem(`user_settings_${user.id}`);
    const parsed = current ? JSON.parse(current) : {};
    localStorage.setItem(`user_settings_${user.id}`, JSON.stringify({ ...parsed, ...data }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    // Mock save
    setTimeout(() => {
      saveToLocalStorage({ full_name: fullName, phone, skinType, dateOfBirth });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setSaving(false);
    }, 1000);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    setTimeout(() => {
      saveToLocalStorage({ streetAddress, city, stateProvince, postalCode, country });
      setMessage({ type: "success", text: "Address saved successfully!" });
      setSaving(false);
    }, 1000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setSaving(true);
    setMessage(null);

    // Mock save
    setTimeout(() => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({ type: "success", text: "Password changed successfully!" });
      setSaving(false);
    }, 1000);
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);
    setTimeout(() => {
      saveToLocalStorage({ emailNotifications, orderUpdates, promotionalEmails, newsletterSubscribed });
      setMessage({
        type: "success",
        text: "Preferences saved successfully!",
      });
      setSaving(false);
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
      )
    )
      return;

    if (!confirm("This is your last chance — are you absolutely sure?")) return;

    try {
      await dispatch(logout());
      window.location.href = "/";
    } catch {
      setMessage({
        type: "error",
        text: "Failed to delete account. Please contact support.",
      });
    }
  };

  const handleSignOut = async () => {
    await dispatch(logout());
    window.location.href = "/";
  };

  const tabs = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "address" as SettingsTab, label: "Address", icon: MapPin },
    { id: "password" as SettingsTab, label: "Password", icon: Lock },
    { id: "preferences" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "privacy" as SettingsTab, label: "Privacy", icon: Shield },
  ];

  if (loading || profileLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) return null;

  const isGoogleUser = false; // Simplified for DummyJSON auth

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground">
                Account Settings
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your account details and preferences
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto gap-1 mb-8 border-b border-border pb-px -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMessage(null);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Status message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-3 sm:p-4 rounded-xl mb-6 ${message.type === "success"
                ? "bg-primary/5 text-primary border border-primary/20"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* ==================== PROFILE TAB ==================== */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Profile Picture */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                <h2 className="font-semibold text-foreground mb-4">
                  Profile Picture
                </h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-border">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="Profile picture"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary/40" />
                      )}
                    </div>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-background/60 rounded-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4" />
                        {avatarUrl ? "Change" : "Upload"}
                      </button>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          disabled={uploadingAvatar}
                          className="inline-flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded-xl text-sm hover:text-destructive hover:border-destructive/30 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form
                onSubmit={handleSaveProfile}
                className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-5"
              >
                <h2 className="font-semibold text-foreground">
                  Personal Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-muted-foreground cursor-not-allowed text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0700000000"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Skin Type
                    </label>
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                    >
                      <option value="">Select skin type</option>
                      <option value="oily">Oily</option>
                      <option value="dry">Dry</option>
                      <option value="combination">Combination</option>
                      <option value="sensitive">Sensitive</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ==================== ADDRESS TAB ==================== */}
          {activeTab === "address" && (
            <form
              onSubmit={handleSaveAddress}
              className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Shipping Address
                </h2>
              </div>
              <p className="text-sm text-muted-foreground -mt-2">
                This address will be used as the default for your orders.
              </p>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g., 123 Kenyatta Avenue"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Nairobi"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    State / County
                  </label>
                  <input
                    type="text"
                    value={stateProvince}
                    onChange={(e) => setStateProvince(e.target.value)}
                    placeholder="e.g., Nairobi County"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g., 00100"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  >
                    <option>Kenya</option>
                    <option>Uganda</option>
                    <option>Tanzania</option>
                    <option>Rwanda</option>
                    <option>Ethiopia</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Address
                  </>
                )}
              </button>
            </form>
          )}

          {/* ==================== PASSWORD TAB ==================== */}
          {activeTab === "password" && (
            <div className="space-y-6">
              {isGoogleUser ? (
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-foreground">
                      Password Settings
                    </h2>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                    <p className="text-sm text-foreground">
                      You signed in with Google. Your password is managed by
                      Google and cannot be changed here.
                    </p>
                    <a
                      href="https://myaccount.google.com/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm text-primary hover:underline font-medium"
                    >
                      Manage Google Security Settings →
                    </a>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleChangePassword}
                  className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-foreground">
                      Change Password
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {newPassword && newPassword.length < 8 && (
                      <p className="text-xs text-destructive mt-1">
                        Password must be at least 8 characters
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-destructive mt-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      !newPassword ||
                      newPassword.length < 8 ||
                      newPassword !== confirmPassword
                    }
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ==================== PREFERENCES TAB ==================== */}
          {activeTab === "preferences" && (
            <form onSubmit={handleSavePreferences} className="space-y-6">
              {/* Newsletter Subscription */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">
                    Newsletter Subscription
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground -mt-2">
                  Manage your newsletter subscription. This controls whether you
                  receive our email newsletters with product tips, deals, and
                  updates, and promotions.
                </p>

                <label className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border hover:bg-foreground/5 transition-colors cursor-pointer">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-foreground">
                      Subscribe to Newsletter
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Receive product tips, exclusive deals, new arrivals, and
                      announcements, and special offers
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newsletterSubscribed}
                    onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>

                {!newsletterSubscribed && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    You are currently unsubscribed. You will not receive any
                    newsletter emails from NexaMart Marketplace.
                  </p>
                )}
              </div>

              {/* Order & Account Notifications */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">
                    Order & Account Notifications
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground -mt-2">
                  These emails keep you informed about your orders and account
                  activity.
                </p>

                <label className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border hover:bg-foreground/5 transition-colors cursor-pointer">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-foreground">
                      Order Updates
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Shipping confirmations, delivery updates, and tracking
                      info
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderUpdates}
                    onChange={(e) => setOrderUpdates(e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border hover:bg-foreground/5 transition-colors cursor-pointer">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-foreground">
                      Account Notifications
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Password changes, sign-in alerts, and security updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border hover:bg-foreground/5 transition-colors cursor-pointer">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-foreground">
                      Promotional Offers
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Flash sales, discount codes, and exclusive member deals
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={promotionalEmails}
                    onChange={(e) => setPromotionalEmails(e.target.checked)}
                    className="w-5 h-5"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </>
                )}
              </button>
            </form>
          )}

          {/* ==================== PRIVACY TAB ==================== */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              {/* Account Info */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">
                    Account Information
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border/50 gap-1">
                    <span className="text-muted-foreground">Account Email</span>
                    <span className="text-foreground font-medium">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border/50 gap-1">
                    <span className="text-muted-foreground">
                      Sign-in Method
                    </span>
                    <span className="text-foreground font-medium capitalize">
                      {isGoogleUser ? "Google" : "Email & Password"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-border/50 gap-1">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="text-foreground font-medium">
                      {new Date().getFullYear()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
                    <span className="text-muted-foreground">Account ID</span>
                    <span className="text-foreground font-mono text-xs">
                      {user.id}
                    </span>
                  </div>
                </div>
              </div>
              {/* Connected Accounts */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                <h2 className="font-semibold text-foreground mb-4">
                  Connected Accounts
                </h2>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Google
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isGoogleUser ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${isGoogleUser
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {isGoogleUser ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              {/* Sign Out */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                <h2 className="font-semibold text-foreground mb-2">Sign Out</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign out of your account on this device.
                </p>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-foreground hover:bg-foreground/5 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
              {/* Danger Zone */}
              <div className="bg-card border border-destructive/30 rounded-2xl p-4 sm:p-6">
                <h2 className="font-semibold text-destructive mb-2">
                  Danger Zone
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. All your
                  data, orders, and wishlist will be permanently removed.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

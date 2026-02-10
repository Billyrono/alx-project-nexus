"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";
import {
  Link2,
  Copy,
  Check,
  Instagram,
  MessageCircle,
  Globe,
  Mail,
  Smartphone,
  QrCode,
} from "lucide-react";

const PLATFORM_PRESETS = [
  {
    id: "instagram-bio",
    name: "Instagram Bio",
    icon: Instagram,
    source: "instagram",
    medium: "bio",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    icon: Instagram,
    source: "instagram",
    medium: "story",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "instagram-ad",
    name: "Instagram Ad",
    icon: Instagram,
    source: "instagram",
    medium: "paid",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    source: "whatsapp",
    medium: "share",
    color: "bg-green-500",
  },
  {
    id: "tiktok-bio",
    name: "TikTok Bio",
    icon: Smartphone,
    source: "tiktok",
    medium: "bio",
    color: "bg-black",
  },
  {
    id: "tiktok-ad",
    name: "TikTok Ad",
    icon: Smartphone,
    source: "tiktok",
    medium: "paid",
    color: "bg-black",
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    icon: Globe,
    source: "facebook",
    medium: "post",
    color: "bg-blue-600",
  },
  {
    id: "facebook-ad",
    name: "Facebook Ad",
    icon: Globe,
    source: "facebook",
    medium: "paid",
    color: "bg-blue-600",
  },
  {
    id: "email",
    name: "Email Campaign",
    icon: Mail,
    source: "email",
    medium: "newsletter",
    color: "bg-orange-500",
  },
];

export default function CampaignLinksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("https://nexamart-marketplace.vercel.app");
  const [customSource, setCustomSource] = useState("");
  const [customMedium, setCustomMedium] = useState("");
  const [customCampaign, setCampaignName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateLink = (source: string, medium: string, campaign?: string) => {
    const params = new URLSearchParams();
    params.set("utm_source", source);
    params.set("utm_medium", medium);
    if (campaign) params.set("utm_campaign", campaign);
    return `${baseUrl}?${params.toString()}`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const customLink =
    customSource && customMedium
      ? generateLink(customSource, customMedium, customCampaign)
      : null;

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-foreground">
              Campaign Links
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate tracking links to see which platforms bring the most
              customers
            </p>
          </div>

          {/* Base URL Setting */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <label className="block text-sm font-medium text-foreground mb-2">
              Your Website URL
            </label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://your-website.com"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This is the base URL that your tracking links will point to
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Quick Links
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Click to copy a ready-to-use tracking link for each platform
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PLATFORM_PRESETS.map((platform) => {
                const link = generateLink(platform.source, platform.medium);
                const isCopied = copiedId === platform.id;
                const Icon = platform.icon;

                return (
                  <button
                    key={platform.id}
                    onClick={() => copyToClipboard(link, platform.id)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-left group"
                  >
                    <div
                      className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {platform.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {platform.source}/{platform.medium}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {isCopied ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Link Builder */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Custom Link Builder
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Create a custom tracking link for any campaign
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Source *
                </label>
                <input
                  type="text"
                  value={customSource}
                  onChange={(e) =>
                    setCustomSource(
                      e.target.value.toLowerCase().replace(/\s/g, "-"),
                    )
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., twitter, youtube"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Medium *
                </label>
                <input
                  type="text"
                  value={customMedium}
                  onChange={(e) =>
                    setCustomMedium(
                      e.target.value.toLowerCase().replace(/\s/g, "-"),
                    )
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., bio, ad, post"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Campaign (optional)
                </label>
                <input
                  type="text"
                  value={customCampaign}
                  onChange={(e) =>
                    setCampaignName(
                      e.target.value.toLowerCase().replace(/\s/g, "-"),
                    )
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., summer-sale"
                />
              </div>
            </div>

            {customLink && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={customLink}
                    readOnly
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(customLink, "custom")}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    {copiedId === "custom" ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 sm:p-6">
            <h3 className="font-semibold text-foreground mb-3">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-foreground/70 text-sm">
              <li>Copy a tracking link for the platform you're using</li>
              <li>Share this link instead of your regular website URL</li>
              <li>
                When customers click it, Google Analytics tracks where they came
                from
              </li>
              <li>
                View results in your Analytics dashboard under "Traffic Sources"
              </li>
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}

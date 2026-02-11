"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/nexamart/admin-header";
import { AdminSidebar } from "@/components/nexamart/admin-sidebar";
import {
  Mail,
  Send,
  Users,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

interface Subscriber {
  email: string;
  subscribed_at: string;
  source?: string;
}

export default function NewsletterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<"compose" | "subscribers">(
    "compose",
  );

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setTimeout(() => {
      setSubscribers([
        { email: "subscriber@example.com", subscribed_at: "2024-01-01T00:00:00Z", source: "homepage" },
        { email: "newsletter@example.com", subscribed_at: "2024-02-01T00:00:00Z", source: "footer" }
      ]);
      setSubscriberCount(2);
      setLoadingSubscribers(false);
    }, 1000);
  };

  const handleSend = async () => {
    if (!subject || !heading || !body) {
      setResult({
        success: false,
        message: "Please fill in subject, heading, and body.",
      });
      return;
    }

    if (subscriberCount === 0) {
      setResult({ success: false, message: "No subscribers to send to." });
      return;
    }

    setSending(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        success: true,
        message: `Newsletter sent to ${subscriberCount} of ${subscriberCount} subscribers!`,
      });
      setSubject("");
      setHeading("");
      setBody("");
      setCtaText("");
      setCtaUrl("");
      setSending(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-serif text-foreground mb-2">
              Newsletter
            </h1>
            <p className="text-muted-foreground">
              Send promotional emails to your subscribers
            </p>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loadingSubscribers ? "..." : subscriberCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="text-2xl font-bold text-foreground">Resend</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold text-foreground">Ready</p>
                </div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-secondary/30 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("compose")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "compose"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <FileText className="w-4 h-4" />
              Compose
            </button>
            <button
              onClick={() => setActiveTab("subscribers")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "subscribers"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Users className="w-4 h-4" />
              Subscribers ({subscriberCount})
            </button>
          </div>
          {activeTab === "compose" && (
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
              {/* Result Message */}
              {result && (
                <div
                  className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-3 ${result.success
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-destructive/10 border border-destructive/30 text-destructive"
                    }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0" />
                  )}
                  {result.message}
                </div>
              )}

              <div className="space-y-5">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., This Week's Top Deals"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Heading */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Newsletter Heading *
                  </label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="e.g., New Arrivals You'll Love"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Newsletter Body *
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your newsletter content here... Use line breaks to separate paragraphs."
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                  />
                </div>

                {/* CTA Section */}
                <div className="border-t border-border pt-5">
                  <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Call to Action Button (optional)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        placeholder="e.g., Shop Now"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Button Link
                      </label>
                      <input
                        type="url"
                        value={ctaUrl}
                        onChange={(e) => setCtaUrl(e.target.value)}
                        placeholder="e.g., https://yoursite.com/shop"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-5 py-3 border border-border rounded-xl text-foreground hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? "Hide Preview" : "Preview"}
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={sending || !subject || !heading || !body}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">
                          Sending to {subscriberCount} subscribers...
                        </span>
                        <span className="sm:hidden">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          Send to {subscriberCount} Subscribers
                        </span>
                        <span className="sm:hidden">Send Newsletter</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    EMAIL PREVIEW
                  </h3>
                  <div className="border border-border rounded-xl overflow-hidden max-w-150 mx-auto">
                    {/* Email Header */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #1a1a1a 0%, #333 100%)",
                        padding: "30px",
                        textAlign: "center",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: "28px",
                          color: "#fff",
                          marginBottom: "5px",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        NexaMart Marketplace
                      </h1>
                      <p
                        style={{
                          color: "#B8860B",
                          fontSize: "12px",
                          letterSpacing: "2px",
                          margin: 0,
                        }}
                      >
                        PREMIUM LIFESTYLE SOLUTIONS
                      </p>
                    </div>
                    {/* Email Body */}
                    <div style={{ padding: "30px" }}>
                      <h2
                        style={{
                          color: "#1a1a1a",
                          fontSize: "24px",
                          marginTop: 0,
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        {heading || "Your Heading Here"}
                      </h2>
                      <div
                        style={{
                          color: "#555",
                          fontSize: "16px",
                          lineHeight: "1.8",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: (
                            body ||
                            "Your newsletter content will appear here..."
                          ).replace(/\n/g, "<br>"),
                        }}
                      />
                      {ctaText && ctaUrl && (
                        <div style={{ textAlign: "center", margin: "30px 0" }}>
                          <span
                            style={{
                              display: "inline-block",
                              background: "#B8860B",
                              color: "white",
                              padding: "14px 32px",
                              borderRadius: "8px",
                              fontWeight: 600,
                              fontSize: "16px",
                            }}
                          >
                            {ctaText}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Email Footer */}
                    <div
                      style={{
                        background: "#fafafa",
                        padding: "20px 30px",
                        borderTop: "1px solid #eee",
                        textAlign: "center",
                        color: "#999",
                        fontSize: "12px",
                      }}
                    >
                      <p>
                        You received this because you subscribed to NexaMart
                        Naturals newsletter.
                      </p>
                      <p>
                        &copy; {new Date().getFullYear()} NexaMart Marketplace. All
                        rights reserved.
                      </p>
                      <p>Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subscribers Tab */}
          {activeTab === "subscribers" && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {loadingSubscribers ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Loading subscribers...
                  </p>
                </div>
              ) : subscribers.length === 0 ? (
                <div className="p-12 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    No subscribers yet
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Subscribers will appear here when people sign up via the
                    newsletter form.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                          #
                        </th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                          Email
                        </th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                          Source
                        </th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">
                          Subscribed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub, index) => (
                        <tr
                          key={sub.email}
                          className="border-b border-border last:border-0 hover:bg-secondary/20"
                        >
                          <td className="px-5 py-3 text-sm text-muted-foreground">
                            {index + 1}
                          </td>
                          <td className="px-5 py-3 text-sm text-foreground font-medium">
                            {sub.email}
                          </td>
                          <td className="px-5 py-3 text-sm text-muted-foreground capitalize">
                            {sub.source || "homepage"}
                          </td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">
                            {new Date(sub.subscribed_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

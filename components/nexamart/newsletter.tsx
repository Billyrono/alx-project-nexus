"use client";

import React from "react";

import { useState } from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError(
          "You're already subscribed! Check your inbox for our latest updates.",
        );
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        console.error("Newsletter error:", data);
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsSubscribed(true);
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl leading-tight text-primary-foreground mb-4 text-balance md:text-7xl">
            Join the community
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10">
            Subscribe for exclusive offers, updates, and early access to
            new arrivals.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-8 py-4">
              <Check className="w-5 h-5 text-primary-foreground" />
              <span className="text-primary-foreground">
                Welcome to the NexaMart family!
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                className="flex-1 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-6 py-4 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40 nexamart-transition"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-8 py-4 rounded-full text-sm tracking-wide nexamart-transition hover:bg-primary-foreground/90 disabled:opacity-50"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 nexamart-transition" />
              </button>
            </form>
          )}

          {error && (
            <div className="inline-flex items-center gap-2 mt-4 text-primary-foreground/80">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <p className="text-sm text-primary-foreground/60 mt-6">
            Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}

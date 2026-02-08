"use client";

import React from "react";

import { useState, Suspense } from "react";
import { Header } from "@/components/fannoh/header";
import { Footer } from "@/components/fannoh/footer";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

function ContactFormContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This is a placeholder - connect to your email service when ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B8860B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
          >
            <option value="" className="text-muted-foreground">
              Select a subject...
            </option>
            <option value="product-inquiry">Product Inquiry</option>
            <option value="order-issue">Order Issue / Tracking</option>
            <option value="skincare-advice">Skincare Advice</option>
            <option value="ingredients">Ingredient Question</option>
            <option value="allergies">Allergy / Sensitivity Concern</option>
            <option value="wholesale">Wholesale / Partnership</option>
            <option value="feedback">Feedback / Suggestion</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background resize-none"
          placeholder="Tell us how we can help..."
        />
      </div>

      {submitted && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-green-800 text-sm font-medium">
            Thank you for your message! We'll get back to you within 24 hours.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          "Sending..."
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <main>
      <Header />

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">
              Get in Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl mt-4 mb-6 text-foreground text-balance">
              Contact Fannoh Naturals
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Have questions about our products or need support? We're here to
              help. Reach out and we'll respond within 24 hours.
            </p>
          </div>

          {/* Contact Info & Form */}
          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Email
                    </h3>
                    <a
                      href="mailto:hello@fannohnaturals.com"
                      className="text-muted-foreground hover:text-primary"
                    >
                      hello@fannohnaturals.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-4 mb-4">
                  <MessageCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      WhatsApp
                    </h3>
                    <a
                      href="https://wa.me/254704532124"
                      className="text-muted-foreground hover:text-primary"
                    >
                      +254 704 532 124
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-4 mb-4">
                  <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Phone
                    </h3>
                    <a
                      href="tel:+254704532124"
                      className="text-muted-foreground hover:text-primary"
                    >
                      +254 704 532 124
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-4 mb-4">
                  <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Location
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Nairobi, Kenya
                      <br />
                      East Africa
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">
                  Response Times
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Emails: 24 hours</li>
                  <li>• WhatsApp: 2-4 hours (during business hours)</li>
                  <li>• Phone: 9AM - 5PM EAT</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-muted/30 rounded-2xl p-4 sm:p-6 lg:p-8">
              <Suspense fallback={<div>Loading form...</div>}>
                <ContactFormContent />
              </Suspense>
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="border-t border-border pt-16">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl mb-4 text-foreground">
                Quick Answers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Can't find what you're looking for? Check out our comprehensive
                FAQ.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">
                  Product Questions
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn about ingredients, benefits, and usage instructions.
                </p>
                <a
                  href="/faq"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  View FAQs →
                </a>
              </div>

              <div className="p-6 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">
                  Patch Testing
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  How to safely introduce new products to your routine.
                </p>
                <a
                  href="/patch-test"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Learn More →
                </a>
              </div>

              <div className="p-6 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">
                  Orders & Shipping
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Shipping timelines, tracking, and delivery information.
                </p>
                <a
                  href="/shipping"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  View Details →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

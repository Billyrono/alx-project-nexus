'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Mail, Smartphone, Download, ShoppingBag, Check } from 'lucide-react'
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'FN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  const orderEmail = searchParams.get('email') || 'customer@example.com'

  return (
    <main>
      <Header />

      <section className="min-h-screen bg-background py-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
              <CheckCircle className="w-24 h-24 text-primary relative" />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl mb-4 text-foreground">Thank You!</h1>
            <p className="text-xl text-muted-foreground mb-4">
              Your order has been confirmed.
            </p>
            <p className="text-muted-foreground">
              Order ID: <span className="font-semibold text-foreground">{orderId}</span>
            </p>
          </div>

          {/* Confirmation Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Email Confirmation */}
            <div className="border border-border rounded-xl p-6 bg-muted/30">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email Confirmation</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    A detailed confirmation has been sent to:
                  </p>
                  <p className="font-mono text-sm text-foreground break-all">
                    {orderEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Updates */}
            <div className="border border-border rounded-xl p-6 bg-muted/30">
              <div className="flex items-start gap-4">
                <Smartphone className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">WhatsApp Updates</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    You'll receive shipping and delivery updates via WhatsApp for real-time tracking.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Standard messaging rates apply
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="border-t border-b border-border py-8 mb-12">
            <h2 className="font-serif text-2xl mb-6 text-foreground">What's Next?</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Order Processing</h3>
                  <p className="text-muted-foreground text-sm">
                    We're preparing your order for shipment. This usually takes 1-2 business days.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Shipping Notification</h3>
                  <p className="text-muted-foreground text-sm">
                    Once shipped, you'll receive a tracking number via email and WhatsApp.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Delivery & Enjoyment</h3>
                  <p className="text-muted-foreground text-sm">
                    Your NexaMart Marketplace products will arrive safely. Start your skincare ritual!
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Support & Resources */}
          <div className="bg-muted/50 rounded-xl p-8 mb-12">
            <h3 className="font-serif text-xl mb-6 text-foreground">Customer Support</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Patch Testing</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  New to skincare? Learn how to safely patch test new products before full use.
                </p>
                <Link href="/patch-test" className="text-primary text-sm font-semibold hover:underline">
                  View Patch Test Guide →
                </Link>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">FAQs & Help</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Browse our comprehensive FAQ for product usage, shipping, and more.
                </p>
                <Link href="/faq" className="text-primary text-sm font-semibold hover:underline">
                  Browse FAQs →
                </Link>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 border border-border px-8 py-4 rounded-full font-semibold hover:bg-muted transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Trust Message */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Thank you for choosing NexaMart Marketplace. We're committed to transparency and safety in skincare.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Dermatologist-tested</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Cruelty-free</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Transparently formulated</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}


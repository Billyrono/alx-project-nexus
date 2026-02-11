"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Home,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";

interface PaymentResult {
  success: boolean;
  status: string;
  reference?: string;
  amount?: number;
  currency?: string;
  channel?: string;
  paidAt?: string;
  customer?: {
    email: string;
    name: string | null;
  };
  metadata?: {
    order_id?: string;
    customer_name?: string;
  };
  error?: string;
}
// Main export
export default function VerifyPaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <Header />
          <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl font-medium text-foreground mb-2">
                Loading...
              </h2>
            </div>
          </div>
          <Footer />
        </main>
      }
    >
      <VerifyPaymentContent />
    </Suspense>
  );
}
function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const hasVerified = useRef(false);
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");
  const paymentReference = reference || trxref;

  useEffect(() => {
    if (hasVerified.current) return;

    async function verifyPayment() {
      if (!paymentReference) {
        setResult({
          success: false,
          status: "error",
          error: "No payment reference found",
        });
        setLoading(false);
        return;
      }

      hasVerified.current = true;

      try {
        const response = await fetch(
          `/api/payments/verify?reference=${paymentReference}`,
        );
        const data = await response.json();

        if (data.success) {
          // Clear cart
          dispatch(clearCart());
        }
        setResult(data);
      } catch (error) {
        console.error("Verification error:", error);
        setResult({
          success: false,
          status: "error",
          error: "Failed to verify payment",
        });
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [paymentReference, dispatch]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">
              Verifying your payment...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your transaction
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {result?.success ? (
            // Success State
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-serif text-4xl text-foreground mb-4">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you for your order. We've received your payment and will
                begin processing your order right away.
              </p>
              {/* Order Details */}
              <div className="bg-card border border-border rounded-2xl p-6 text-left mb-8">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-foreground">
                      {result.reference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-medium text-foreground">
                      KES {result.amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Method
                    </span>
                    <span className="text-foreground capitalize">
                      {result.channel?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="text-foreground">
                      {result.paidAt
                        ? new Date(result.paidAt).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "Just now"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-left mb-8">
                <h3 className="font-medium text-foreground mb-3">
                  What happens next?
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary shrink-0">
                      1
                    </span>
                    You'll receive an order confirmation email
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary shrink-0">
                      2
                    </span>
                    We'll prepare your order for shipping
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary shrink-0">
                      3
                    </span>
                    You'll get a tracking number when it ships
                  </li>
                </ol>
              </div>
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            // Error State
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="font-serif text-4xl text-foreground mb-4">
                Payment Failed
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {result?.error ||
                  "We couldn't process your payment. Please try again or contact support if the problem persists."}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

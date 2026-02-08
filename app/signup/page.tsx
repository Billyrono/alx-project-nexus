"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle,
} from "lucide-react";

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!acceptTerms) {
            setError(
                "You must accept the Terms of Service and Privacy Policy to create an account",
            );
            setLoading(false);
            return;
        }

        // Mock API call to DummyJSON /users/add for demo purposes
        // Note: DummyJSON doesn't actually persist users, so we just simulate success
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request
            // On success -> Show confirmation
            setShowConfirmation(true);
        } catch (err) {
            setError("Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setGoogleLoading(true);
        setTimeout(() => {
            setGoogleLoading(false);
            alert("Google Sign Up is not available in this demo version.");
        }, 1000);
    };

    if (showConfirmation) {
        return (
            <main className="min-h-screen flex">
                {/* Left - Image Panel (hidden on mobile) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
                    <Image
                        src="/images/products/serum.jpg"
                        alt="Fannoh Naturals skincare"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
                    <div className="absolute bottom-0 left-0 right-0 p-12">
                        <Link href="/" className="mb-6 inline-block">
                            <Image
                                src="/images/logo.png"
                                alt="Fannoh Naturals"
                                width={160}
                                height={163}
                                className="h-12 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <h2 className="font-serif text-3xl text-white mb-3">
                            Welcome to Fannoh Naturals
                        </h2>
                        <p className="text-white/80 text-sm max-w-md">
                            You&apos;re one step away from premium African botanical skincare.
                        </p>
                    </div>
                </div>

                {/* Right - Confirmation */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 py-6 sm:px-6 sm:py-12">
                    <div className="w-full max-w-md text-center">
                        <Link
                            href="/"
                            className="flex justify-center mb-5 sm:mb-8 lg:hidden"
                        >
                            <Image
                                src="/images/logo.png"
                                alt="Fannoh Naturals"
                                width={160}
                                height={163}
                                className="h-10 sm:h-14 w-auto object-contain"
                            />
                        </Link>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-2 sm:mb-3">
                            Check Your Email
                        </h2>
                        <p className="text-muted-foreground text-sm mb-4 sm:mb-6">
                            This is a demo. No email was sent, but in a real app, a confirmation link would be sent to <strong>{email}</strong>.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex">
            {/* Left - Image Panel (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
                <Image
                    src="/images/products/serum.jpg"
                    alt="Fannoh Naturals skincare"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-12">
                    <Link href="/" className="mb-6 inline-block">
                        <Image
                            src="/images/logo.png"
                            alt="Fannoh Naturals"
                            width={160}
                            height={163}
                            className="h-12 w-auto object-contain brightness-0 invert"
                        />
                    </Link>
                    <h2 className="font-serif text-3xl text-white mb-3">
                        Join Our Skincare Community
                    </h2>
                    <p className="text-white/80 text-sm max-w-md">
                        Get access to exclusive offers, early launches, and personalized
                        skincare recommendations.
                    </p>
                </div>
            </div>

            {/* Right - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 py-6 sm:px-6 sm:py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="flex justify-center mb-4 sm:mb-5 lg:hidden">
                        <Image
                            src="/images/logo.png"
                            alt="Fannoh Naturals"
                            width={160}
                            height={163}
                            className="h-10 sm:h-12 w-auto object-contain"
                        />
                    </Link>

                    <div className="mb-4 hidden lg:block">
                        <h2 className="font-serif text-2xl text-foreground mb-1">
                            Create Account
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Join Fannoh Naturals for exclusive offers
                        </p>
                    </div>
                    <div className="mb-3 sm:mb-4 lg:hidden text-center">
                        <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-1">
                            Create Account
                        </h2>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Join Fannoh Naturals for exclusive offers
                        </p>
                    </div>

                    {/* Google Sign Up - Top */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full border border-border bg-background text-foreground py-2.5 rounded-xl font-medium hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-3 sm:mb-4"
                    >
                        {googleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        )}
                        {googleLoading ? "Signing up..." : "Continue with Google"}
                    </button>

                    {/* Divider */}
                    <div className="relative mb-3 sm:mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-background text-muted-foreground">
                                or sign up with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Full Name + Email - side by side on sm+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-foreground mb-1"
                                >
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        placeholder="Your name"
                                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-foreground mb-1"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password + Confirm - side by side on sm+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-foreground mb-1"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Min 6 chars"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-foreground mb-1"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Re-enter"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="mt-0.5 w-4 h-4"
                            />
                            <span className="text-xs text-muted-foreground leading-relaxed">
                                By creating an account, I agree to Fannoh Naturals&apos;{" "}
                                <Link
                                    href="/terms"
                                    className="text-primary hover:underline"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy"
                                    className="text-primary hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                                . I consent to the collection, use, and processing of my
                                personal data as described therein.
                            </span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !acceptTerms}
                            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="mt-3 sm:mt-4 text-center text-muted-foreground text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </p>

                    <div className="mt-2 text-center lg:hidden">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state) => state.auth);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem("fannoh_remember_username");
        if (saved) {
            setUsername(saved);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (user) {
            router.push("/shop");
        }
    }, [user, router]);

    if (user) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const resultAction = await dispatch(loginUser({ username, password }));

        if (loginUser.fulfilled.match(resultAction)) {
            if (rememberMe) {
                localStorage.setItem("fannoh_remember_username", username);
            } else {
                localStorage.removeItem("fannoh_remember_username");
            }
            router.push("/shop");
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        // Simulate google sign in delay
        setTimeout(() => {
            setGoogleLoading(false);
            alert("Google Sign In is not available in this demo version.");
        }, 1000);
    };

    return (
        <main className="h-screen w-full overflow-hidden flex">
            {/* Left - Image Panel (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-muted h-full">
                <Image
                    src="/images/products/serum.jpg"
                    alt="Shopping collection"
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                        // Fallback if image fails
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.style.backgroundColor = '#e5e5e5';
                    }}
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
                        Your Shopping Experience Deserves the Best
                    </h2>
                    <p className="text-white/80 text-sm max-w-md">
                        Premium products, curated for you.
                    </p>
                </div>
            </div>

            {/* Right - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-4 py-6 sm:px-6 sm:py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="flex justify-center mb-5 sm:mb-8 lg:hidden">
                        <Image
                            src="/images/logo.png"
                            alt="Fannoh Naturals"
                            width={160}
                            height={163}
                            className="h-10 sm:h-14 w-auto object-contain"
                        />
                    </Link>

                    <div className="mb-8 hidden lg:block">
                        <h2 className="font-serif text-3xl text-foreground mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Sign in to your account
                        </p>
                    </div>
                    <div className="mb-4 sm:mb-6 lg:hidden text-center">
                        <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-1 sm:mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Google Sign In - Top (Demo) */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        className="w-full border border-border bg-background text-foreground py-2.5 sm:py-3 rounded-xl font-medium hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4 sm:mb-6"
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
                        {googleLoading ? "Signing in..." : "Continue with Google"}
                    </button>

                    {/* Divider */}
                    <div className="relative mb-4 sm:mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-background text-muted-foreground">
                                or sign in with username
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Username (was Email) */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-foreground mb-1.5"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="e.g. emilys"
                                    className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-foreground"
                                >
                                    Password
                                </label>
                                <Link
                                    href="#"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 sm:pl-12 pr-11 sm:pr-12 py-2.5 sm:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm text-muted-foreground">Remember me</span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-2.5 sm:py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <p className="mt-4 sm:mt-6 text-center text-muted-foreground text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </p>

                    <div className="mt-6 text-center text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        Demo Credentials: <strong>emilys</strong> / <strong>emilyspass</strong>
                    </div>

                    <div className="mt-4 text-center lg:hidden">
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

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { Loader2, ShieldX } from "lucide-react"
import Link from "next/link"

const getAdminEmails = (): string[] => {
    const emails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || ""
    return emails.split(",").map(email => email.trim().toLowerCase()).filter(Boolean)
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAppSelector((state) => state.auth)
    const router = useRouter()
    const [authState, setAuthState] = useState<"loading" | "authorized" | "unauthorized" | "not-logged-in">("loading")

    useEffect(() => {
        if (!loading) {
            if (!user) {
                setAuthState("not-logged-in")
                router.push("/login?redirect=/admin")
            } else {
                const adminEmails = [...getAdminEmails(), "emily.johnson@x.dummyjson.com", "emilys@dummyjson.com"];
                const userEmail = user.email?.toLowerCase() || ""

                if (adminEmails.includes(userEmail)) {
                    setAuthState("authorized")
                } else {
                    setAuthState("unauthorized")
                }
            }
        }
    }, [user, loading, router])

    if (authState === "loading" || authState === "not-logged-in") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Verifying access...</p>
                </div>
            </div>
        )
    }
    if (authState === "unauthorized") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldX className="w-8 h-8 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-serif text-foreground mb-2">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">
                        You don&apos;t have permission to access the admin dashboard.
                        This area is restricted to authorized administrators only.
                    </p>
                    <p className="text-xs text-muted-foreground bg-muted p-2 rounded mb-6">
                        Current User: {user?.email}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            Go to Homepage
                        </Link>
                        <Link
                            href="/account"
                            className="px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
                        >
                            My Account
                        </Link>
                    </div>
                    <p className="text-xs text-muted-foreground mt-8">
                        If you believe this is an error, please contact the site administrator.
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}

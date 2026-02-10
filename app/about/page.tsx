import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-8 text-center">Our Story</h1>
                    <div className="prose prose-stone mx-auto text-muted-foreground">
                        <p className="lead text-lg mb-6">
                            Welcome to <strong>NexaMart Marketplace</strong>, your premier destination for curated lifestyle essentials.
                        </p>
                        <p className="mb-6">
                            Founded in 2024, NexaMart began with a simple mission: to bring high-quality, ethically sourced products to discerning customers who value both style and substance. What started as a small collection has grown into a comprehensive marketplace offering everything from home decor to personal accessories.
                        </p>
                        <p className="mb-6">
                            We believe shopping should be an experience, not just a transaction. That's why every product in our catalog is hand-picked for its quality, durability, and aesthetic appeal.
                        </p>
                        <div className="my-12 relative aspect-video rounded-2xl overflow-hidden bg-muted">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                                <span className="font-serif text-2xl">NexaMart HQ</span>
                            </div>
                        </div>
                        <h2 className="font-serif text-2xl text-foreground mt-12 mb-4">Our Values</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Quality First:</strong> We never compromise on the standards of our products.</li>
                            <li><strong>Customer Focus:</strong> Your satisfaction is at the heart of everything we do.</li>
                            <li><strong>Sustainability:</strong> We actively seek eco-friendly and sustainable product lines.</li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

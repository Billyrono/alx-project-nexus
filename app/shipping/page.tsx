import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-8 text-center">Shipping Information</h1>
                    <div className="prose prose-stone mx-auto text-muted-foreground">
                        <p>
                            At NexaMart, we strive to deliver your orders efficiently and safely.
                        </p>

                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Delivery Areas</h3>
                        <p>
                            We currently ship to all 47 counties within Kenya. Standard delivery is handled by our trusted logistics partners.
                        </p>

                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Shipping Rates</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Nairobi Standard:</strong> KES 200</li>
                            <li><strong>Nairobi Express:</strong> KES 350</li>
                            <li><strong>Upcountry Standard:</strong> KES 350</li>
                        </ul>
                        <p className="mt-4">
                            <em>Free shipping applies to all orders over KES 5,000.</em>
                        </p>

                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Delivery Times</h3>
                        <p>
                            Orders are processed within 24 hours. Delivery timelines are as follows:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Nairobi:</strong> 1-2 Business Days</li>
                            <li><strong>Greater Nairobi:</strong> 2-3 Business Days</li>
                            <li><strong>Rest of Kenya:</strong> 3-5 Business Days</li>
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

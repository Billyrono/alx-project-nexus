import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-8 text-center">Return Policy</h1>
                    <div className="prose prose-stone mx-auto text-muted-foreground">
                        <p>
                            We want you to love your purchase. If you are not completely satisfied, we're here to help.
                        </p>

                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Eligibility</h3>
                        <p>
                            To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
                        </p>

                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Return Window</h3>
                        <p>
                            You have 14 calendar days to return an item from the date you received it.
                        </p>

                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Non-returnable items</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Perishable goods (e.g., food, flowers)</li>
                            <li>Personal care items (e.g., skincare, makeup that has been opened)</li>
                            <li>Gift cards</li>
                        </ul>

                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Refunds</h3>
                        <p>
                            Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
                        </p>
                        <p>
                            If your return is approved, we will initiate a refund to your original method of payment.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

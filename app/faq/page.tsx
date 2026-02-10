import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-3xl mx-auto px-6 lg:px-8">
                    <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 text-center">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground text-center mb-12">
                        Find answers to common questions about shopping at NexaMart.
                    </p>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="item-1" className="bg-card px-6 rounded-2xl border border-border">
                            <AccordionTrigger className="text-foreground hover:no-underline hover:text-primary">How long does shipping take?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Standard shipping takes 3-5 business days within Nairobi, and 5-7 business days for other regions. Express shipping options are available at checkout.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="bg-card px-6 rounded-2xl border border-border">
                            <AccordionTrigger className="text-foreground hover:no-underline hover:text-primary">What is your return policy?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                We accept returns within 14 days of delivery. Items must be unused, in their original packaging, and in the same condition that you received them.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="bg-card px-6 rounded-2xl border border-border">
                            <AccordionTrigger className="text-foreground hover:no-underline hover:text-primary">Do you offer international shipping?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Currently, we only ship within Kenya. We are working on expanding our shipping destinations soon.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="bg-card px-6 rounded-2xl border border-border">
                            <AccordionTrigger className="text-foreground hover:no-underline hover:text-primary">How can I track my order?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Once your order is shipped, you will receive a tracking number via email. You can also view your order status in your account dashboard.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </main>
            <Footer />
        </div>
    );
}

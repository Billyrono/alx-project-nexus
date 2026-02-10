import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-8 text-center">Terms of Service</h1>
                    <div className="prose prose-stone mx-auto text-muted-foreground">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                        <p>
                            Please read these terms and conditions carefully before using Our Service.
                        </p>
                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Interpretation and Definitions</h3>
                        <p>
                            The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                        </p>
                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Acknowledgment</h3>
                        <p>
                            These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                        </p>
                        {/* Simplified for demo */}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

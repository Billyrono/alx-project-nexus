import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-8 text-center">Privacy Policy</h1>
                    <div className="prose prose-stone mx-auto text-muted-foreground">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                        <p>
                            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                        </p>
                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">Collecting and Using Your Personal Data</h3>
                        <p>
                            While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

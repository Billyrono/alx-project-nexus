import { Header } from "@/components/nexamart/header";
import { Footer } from "@/components/nexamart/footer";

export default function SizeGuidePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-8 text-center">Size Guide</h1>
                    <div className="prose prose-stone mx-auto text-muted-foreground">
                        <p className="mb-8">
                            Use this guide to find the perfect fit for your NexaMart purchases.
                        </p>

                        <h3 className="text-foreground mt-8 mb-4 text-xl font-medium">General Sizing</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="py-3 px-4 text-foreground font-medium">Size</th>
                                        <th className="py-3 px-4 text-foreground font-medium">Chest (cm)</th>
                                        <th className="py-3 px-4 text-foreground font-medium">Waist (cm)</th>
                                        <th className="py-3 px-4 text-foreground font-medium">Hips (cm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4">XS</td>
                                        <td className="py-3 px-4">80-84</td>
                                        <td className="py-3 px-4">60-64</td>
                                        <td className="py-3 px-4">86-90</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4">S</td>
                                        <td className="py-3 px-4">84-88</td>
                                        <td className="py-3 px-4">64-68</td>
                                        <td className="py-3 px-4">90-94</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4">M</td>
                                        <td className="py-3 px-4">88-92</td>
                                        <td className="py-3 px-4">68-72</td>
                                        <td className="py-3 px-4">94-98</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4">L</td>
                                        <td className="py-3 px-4">92-96</td>
                                        <td className="py-3 px-4">72-76</td>
                                        <td className="py-3 px-4">98-102</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4">XL</td>
                                        <td className="py-3 px-4">96-100</td>
                                        <td className="py-3 px-4">76-80</td>
                                        <td className="py-3 px-4">102-106</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm mt-4">
                            *Measurements are in centimeters. Fits may vary by style or personal preference.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

import { Header } from "@/components/nexamart/header"
import { Hero } from "@/components/nexamart/hero"
import { FeatureSection } from "@/components/nexamart/feature-section"
import { ProductGrid } from "@/components/nexamart/product-grid"
import { Newsletter } from "@/components/nexamart/newsletter"
import { Footer } from "@/components/nexamart/footer"

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <ProductGrid />
      <FeatureSection />
      <Newsletter />
      <Footer />
    </main>
  )
}


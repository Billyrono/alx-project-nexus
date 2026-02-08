import { Header } from "@/components/fannoh/header"
import { Hero } from "@/components/fannoh/hero"
import { TrustBadges } from "@/components/fannoh/trust-badges"
import { FeatureSection } from "@/components/fannoh/feature-section"
import { ProductGrid } from "@/components/fannoh/product-grid"
import { Testimonials } from "@/components/fannoh/testimonials"
import { CTABanner } from "@/components/fannoh/cta-banner"
import { Newsletter } from "@/components/fannoh/newsletter"
import { Footer } from "@/components/fannoh/footer"

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <ProductGrid />
      <FeatureSection />
      {/* <Newsletter /> */}
      <Footer />
    </main>
  )
}


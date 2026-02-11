import React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { ReduxProvider } from "@/store/ReduxProvider";
import { WhatsAppButton } from "@/components/nexamart/whatsapp-button";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-NVBZ1T2S4V";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "NexaMart Marketplace | Premium Lifestyle & Home Essentials",
    template: "%s | NexaMart Marketplace",
  },
  description:
    "Discover NexaMart Marketplace – Kenya's premier destination for quality home essentials, lifestyle products, and more. Shop with confidence for curated items delivered to your doorstep.",
  keywords: ["NexaMart", "Marketplace", "Kenya", "Online Shopping", "Home Essentials", "Lifestyle", "Premium Products"],
  authors: [{ name: "NexaMart Team" }],
  creator: "NexaMart",
  publisher: "NexaMart Marketplace",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://nexamart-marketplace.vercel.app",
    title: "NexaMart Marketplace | Premium Lifestyle & Home Essentials",
    description: "Discover NexaMart Marketplace – Kenya's premier destination for quality home essentials, lifestyle products, and more.",
    siteName: "NexaMart Marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexaMart Marketplace | Premium Lifestyle & Home Essentials",
    description: "Discover NexaMart Marketplace – Kenya's premier destination for quality home essentials, lifestyle products, and more.",
    creator: "@nexamart",
  },
  applicationName: "NexaMart Marketplace",
  metadataBase: new URL("https://nexamart-marketplace.vercel.app"),
};

export const viewport: Viewport = {
  themeColor: "#E3E1E2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });
            
            gtag('config', '${GA_MEASUREMENT_ID}', {
              'anonymize_ip': true
            });
          `}
        </Script>
      </head>
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <ReduxProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <WhatsAppButton />
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  );
}

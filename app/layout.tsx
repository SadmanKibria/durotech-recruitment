import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Durotech Recruitment | International Staffing Solutions",
    template: "%s | Durotech Recruitment",
  },
  description:
    "Leading international recruitment agency connecting talented professionals with top employers across Europe, Middle East, and Asia. Specialising in construction, healthcare, engineering, food production, and warehousing.",
  keywords: [
    "recruitment agency",
    "international jobs",
    "staffing solutions",
    "construction jobs",
    "healthcare recruitment",
    "engineering jobs",
    "warehousing jobs",
    "food production jobs",
    "Europe jobs",
    "Middle East jobs",
    "Asia jobs",
    "UK recruitment",
    "Dubai jobs",
    "Singapore jobs",
  ],
  authors: [{ name: "Durotech Recruitment" }],
  creator: "Durotech Recruitment",
  publisher: "Durotech Recruitment",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://durotechrecruitment.com",
    siteName: "Durotech Recruitment",
    title: "Durotech Recruitment | International Staffing Solutions",
    description:
      "Leading international recruitment agency connecting talented professionals with top employers across Europe, Middle East, and Asia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Durotech Recruitment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Durotech Recruitment | International Staffing Solutions",
    description:
      "Leading international recruitment agency connecting talented professionals with top employers across Europe, Middle East, and Asia.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://durotechrecruitment.com",
  },
  category: "Recruitment",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EmploymentAgency",
              name: "Durotech Recruitment",
              description:
                "International recruitment agency specialising in construction, healthcare, engineering, food production, and warehousing sectors across Europe, Middle East, and Asia.",
              url: "https://durotechrecruitment.com",
              logo: "https://durotechrecruitment.com/logo.png",
              sameAs: [],
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Recruitment Street",
                addressLocality: "London",
                postalCode: "EC1A 1BB",
                addressCountry: "GB",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+44-20-1234-5678",
                contactType: "customer service",
                availableLanguage: ["English"],
              },
              areaServed: [
                { "@type": "Continent", name: "Europe" },
                { "@type": "Place", name: "Middle East" },
                { "@type": "Continent", name: "Asia" },
              ],
              serviceType: ["Recruitment Services", "Staffing Solutions", "Permanent Placement", "Temporary Staffing"],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

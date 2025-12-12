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
    "Leading international recruitment agency connecting talented professionals with top employers across Europe, Middle East, and Asia. Specialising in construction, healthcare, engineering, food production, and warehousing. Founded by Sadman Kibria.",
  keywords: [
    "recruitment agency",
    "international jobs",
    "staffing solutions",
    "construction jobs",
    "healthcare recruitment",
    "engineering jobs",
    "warehousing jobs",
    "food production jobs",
    "garment industry jobs",
    "Europe jobs",
    "Middle East jobs",
    "Asia jobs",
    "UK recruitment",
    "Dubai jobs",
    "Singapore jobs",
    "visa sponsorship jobs",
    "Durotech",
    "Sadman Kibria",
    "London recruitment agency",
    "international recruitment",
    "overseas jobs",
    "work abroad",
  ],
  authors: [{ name: "Sadman Kibria" }, { name: "Durotech Recruitment" }],
  creator: "Sadman Kibria",
  publisher: "Durotech Recruitment",
  metadataBase: new URL("https://durotech.co.uk"),
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
    url: "https://durotech.co.uk",
    siteName: "Durotech Recruitment",
    title: "Durotech Recruitment | International Staffing Solutions",
    description:
      "Leading international recruitment agency founded by Sadman Kibria. Connecting talented professionals with top employers across Europe, Middle East, and Asia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Durotech Recruitment - International Staffing Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Durotech Recruitment | International Staffing Solutions",
    description:
      "Leading international recruitment agency connecting talented professionals with top employers across Europe, Middle East, and Asia.",
    images: ["/og-image.jpg"],
    creator: "@durotechrecruitment",
  },
  alternates: {
    canonical: "https://durotech.co.uk",
  },
  category: "Recruitment",
  verification: {
    google: "google-site-verification-code",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1E3A5F" },
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
              alternateName: "Durotech",
              founder: {
                "@type": "Person",
                name: "Sadman Kibria",
                jobTitle: "Founder & Director",
              },
              description:
                "International recruitment agency specialising in construction, healthcare, engineering, food production, warehousing, and garment sectors across Europe, Middle East, and Asia.",
              url: "https://durotech.co.uk",
              logo: "https://durotech.co.uk/durotech-logo.png",
              image: "https://durotech.co.uk/og-image.jpg",
              telephone: "+44-20-1234-5678",
              email: "info@durotech.co.uk",
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Business Street",
                addressLocality: "London",
                postalCode: "EC1A 1BB",
                addressCountry: "GB",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "51.5074",
                longitude: "-0.1278",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+44-20-1234-5678",
                contactType: "customer service",
                email: "info@durotech.co.uk",
                availableLanguage: ["English"],
                areaServed: ["GB", "AE", "SA", "SG", "BD", "DE", "PL"],
              },
              areaServed: [
                { "@type": "Continent", name: "Europe" },
                { "@type": "Place", name: "Middle East" },
                { "@type": "Continent", name: "Asia" },
              ],
              serviceType: [
                "International Recruitment",
                "Staffing Solutions",
                "Permanent Placement",
                "Contract Staffing",
                "Visa Sponsorship",
                "Study Abroad Consulting",
              ],
              knowsAbout: [
                "Construction Recruitment",
                "Healthcare Staffing",
                "Engineering Jobs",
                "Warehousing Employment",
                "Food Production Staffing",
                "Garment Industry Recruitment",
              ],
              slogan: "Connecting Talent With Opportunity Worldwide",
              foundingDate: "2009",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "500",
              },
            }),
          }}
        />
        <link rel="canonical" href="https://durotech.co.uk" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

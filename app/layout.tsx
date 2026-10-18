import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Durotech Recruitment | International Staffing & Study Abroad Solutions by Sadman Kibria",
    template: "%s | Durotech Recruitment",
  },
  description:
    "Leading international recruitment agency founded by Sadman Kibria, connecting talented professionals with top employers across Europe, Middle East, and Asia. Specialising in construction, healthcare, engineering, food production, warehousing, and study abroad programs. 15+ years of expertise with 5000+ successful placements.",
  keywords: [
    "Sadman Kibria",
    "Durotech Recruitment",
    "international recruitment agency",
    "overseas jobs",
    "work abroad",
    "visa sponsorship jobs",
    "construction jobs Europe",
    "healthcare jobs UK",
    "engineering jobs Middle East",
    "warehouse jobs",
    "food production jobs",
    "garment industry jobs",
    "study abroad",
    "UK universities",
    "European universities",
    "student visa assistance",
    "London recruitment agency",
    "international staffing solutions",
    "employment agency",
    "job placement services",
    "Dubai jobs",
    "Singapore jobs",
    "Germany jobs",
    "Canada study visa",
    "Australia education",
    "global recruitment",
  ],
  authors: [{ name: "Sadman Kibria", url: "https://durotech.co.uk" }, { name: "Durotech Recruitment" }],
  creator: "Sadman Kibria",
  publisher: "Durotech Recruitment Ltd",
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
    title: "Durotech Recruitment | International Staffing Solutions by Sadman Kibria",
    description:
      "Leading international recruitment agency founded by Sadman Kibria. 15+ years connecting talented professionals with top employers and students with world-class universities across Europe, Middle East, and Asia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Durotech Recruitment - International Staffing Solutions by Sadman Kibria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Durotech Recruitment | International Jobs & Study Abroad",
    description:
      "Founded by Sadman Kibria. Connecting professionals with global employers and students with world-class universities. 15+ years of excellence.",
    images: ["/og-image.jpg"],
    creator: "@durotechrecruitment",
  },
  alternates: {
    canonical: "https://durotech.co.uk",
  },
  category: "Recruitment & Education Services",
  verification: {
    google: "your-google-verification-code",
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
        <link rel="icon" type="image/png" href="/durotech-logo.png" />
        <link rel="apple-touch-icon" href="/durotech-logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EmploymentAgency",
              name: "Durotech Recruitment",
              alternateName: "Durotech",
              legalName: "Durotech Recruitment Ltd",
              founder: {
                "@type": "Person",
                name: "Sadman Kibria",
                jobTitle: "Founder & Director",
                sameAs: ["https://www.linkedin.com/in/sadman-kibria", "https://durotech.co.uk"],
              },
              description:
                "International recruitment and education consultancy specialising in construction, healthcare, engineering, food production, warehousing, garment sectors, and study abroad programs across Europe, Middle East, and Asia.",
              url: "https://durotech.co.uk",
              logo: "https://durotech.co.uk/durotech-logo.png",
              image: "https://durotech.co.uk/og-image.jpg",
              telephone: "+44-7950-206007",
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
                telephone: "+44-7950-206007",
                contactType: "customer service",
                email: "info@durotech.co.uk",
                availableLanguage: ["English", "Arabic", "Bengali", "Polish", "Romanian"],
                areaServed: ["GB", "AE", "SA", "SG", "BD", "DE", "PL", "RO", "PK", "IN"],
              },
              areaServed: [
                { "@type": "Country", name: "United Kingdom" },
                { "@type": "Country", name: "United Arab Emirates" },
                { "@type": "Country", name: "Germany" },
                { "@type": "Country", name: "Poland" },
                { "@type": "Country", name: "Saudi Arabia" },
                { "@type": "Country", name: "Singapore" },
                { "@type": "Country", name: "Canada" },
                { "@type": "Country", name: "Australia" },
              ],
              serviceType: [
                "International Recruitment",
                "Staffing Solutions",
                "Permanent Placement",
                "Contract Staffing",
                "Visa Sponsorship",
                "Study Abroad Consulting",
                "University Application Support",
                "Student Visa Assistance",
              ],
              knowsAbout: [
                "Construction Recruitment",
                "Healthcare Staffing",
                "Engineering Jobs",
                "Warehousing Employment",
                "Food Production Staffing",
                "Garment Industry Recruitment",
                "International Education",
                "Study Abroad Programs",
              ],
              slogan: "Connecting Talent With Opportunity Worldwide",
              foundingDate: "2009",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "500",
                bestRating: "5",
                worstRating: "1",
              },
              priceRange: "$$",
              paymentAccepted: "Cash, Credit Card, Bank Transfer",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
            }),
          }}
        />
        <link rel="canonical" href="https://durotech.co.uk" />
        <meta name="author" content="Sadman Kibria" />
        <meta name="geo.region" content="GB-LND" />
        <meta name="geo.placename" content="London" />
        <meta name="geo.position" content="51.5074;-0.1278" />
        <meta name="ICBM" content="51.5074, -0.1278" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

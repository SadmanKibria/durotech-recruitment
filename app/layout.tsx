import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.durotech.co.uk"),
  title: { default: "Durotech Recruitment | International Jobs & Study Abroad", template: "%s | Durotech Recruitment" },
  description: "Explore international job opportunities, submit your CV, plan your studies abroad and get practical support from Durotech Recruitment.",
  keywords: ["Durotech Recruitment", "international recruitment", "overseas jobs", "work abroad", "study abroad", "global recruitment", "London recruitment"],
  authors: [{ name: "Durotech Recruitment" }],
  creator: "Durotech Recruitment",
  publisher: "Durotech Recruitment",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", locale: "en_GB", url: "/", siteName: "Durotech Recruitment", title: "Durotech Recruitment | International Opportunities", description: "Jobs, study abroad support and responsible international recruitment—all in one place.", images: [{ url: "/professional-team-meeting-diverse-office.jpg", width: 1024, height: 1024, alt: "The Durotech recruitment team" }] },
  twitter: { card: "summary_large_image", title: "Durotech Recruitment", description: "International opportunities with clear, human support.", images: ["/professional-team-meeting-diverse-office.jpg"] },
  category: "Recruitment",
}

export const viewport: Viewport = { themeColor: "#0d1974", width: "device-width", initialScale: 1, maximumScale: 5 }

const organisation = {
  "@context": "https://schema.org",
  "@type": "EmploymentAgency",
  name: "Durotech Recruitment",
  url: "https://www.durotech.co.uk",
  logo: "https://www.durotech.co.uk/durotech-logo.png",
  description: "International recruitment, training and study abroad support.",
  email: "info@durotech.co.uk",
  telephone: "+44 7950 206007",
  address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
  contactPoint: { "@type": "ContactPoint", telephone: "+44 7950 206007", email: "info@durotech.co.uk", contactType: "customer service" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="icon" href="/durotech-logo.png"/><link rel="apple-touch-icon" href="/durotech-logo.png"/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}/></head><body className={`${inter.variable} font-sans antialiased`}>{children}<Analytics/></body></html>
}

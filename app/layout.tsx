import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.durotech.co.uk"),
  title: { default: "Durotech Group | International Jobs & Study Abroad", template: "%s | Durotech Group" },
  description: "Explore international job opportunities, plan your studies abroad and get practical support from Durotech Group.",
  keywords: ["Durotech Group", "Durotech Recruitment", "international recruitment", "overseas jobs", "work abroad", "study abroad", "global recruitment", "London recruitment"],
  authors: [{ name: "Sadman Kibria", url: "https://github.com/SadmanKibria" }],
  creator: "Sadman Kibria",
  publisher: "Durotech Group",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", locale: "en_GB", url: "/", siteName: "Durotech Group", title: "Durotech Group | International Opportunities", description: "Jobs, study abroad support and responsible international recruitment—all in one place.", images: [{ url: "/durotech-logo.png", width: 1200, height: 1200, alt: "Durotech Group" }] },
  twitter: { card: "summary", title: "Durotech Group", description: "International opportunities with clear, human support.", images: ["/durotech-logo.png"] },
  category: "Recruitment",
}

export const viewport: Viewport = { themeColor: "#0d1974", width: "device-width", initialScale: 1, maximumScale: 5 }

const organisation = {
  "@context": "https://schema.org",
  "@type": "EmploymentAgency",
  name: "Durotech Group",
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

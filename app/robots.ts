import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/jobs/*", "/about", "/contact", "/study-abroad", "/submit-cv"],
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/jobs", "/jobs/*", "/about", "/contact", "/study-abroad", "/submit-cv"],
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
    ],
    sitemap: "https://durotech.co.uk/sitemap.xml",
  }
}

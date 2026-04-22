import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | Durotech Recruitment",
  description: "Information about how Durotech Recruitment uses cookies and similar technologies on our website.",
}

export default function CookiePolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
            <p className="mt-4 text-slate-300">
              Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files stored on your device when you visit a website. They help websites function
                properly, remember your preferences, and improve your browsing experience. This policy explains how
                Durotech Recruitment uses cookies and similar technologies.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Types of Cookies We Use</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies are necessary for our website to function properly. They enable core functionality such as
                security, session management, and accessibility features. You cannot opt out of these cookies.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Performance Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies collect anonymous information about how visitors use our website, helping us understand
                which pages are most popular and identify any issues. We use this data to improve our website's
                performance.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Functional Cookies</h3>
              <p className="text-muted-foreground mb-4">
                These cookies remember choices you make (such as language preferences) to provide a more personalised
                experience. They may also be used to remember changes you've made to text size and other customisable
                elements.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Analytics Cookies</h3>
              <p className="text-muted-foreground mb-4">
                We use analytics tools (such as Vercel Analytics) to understand how visitors interact with our website.
                These cookies help us measure and improve the content and user experience of our site.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Some cookies on our website are placed by third-party services that appear on our pages. We do not
                control these cookies and recommend reviewing the privacy policies of these third parties.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>See what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from particular websites</li>
                <li>Block all cookies from being set</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                Note that blocking some cookies may impact your experience on our website and limit the services we can
                provide.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookie Duration</h2>
              <p className="text-muted-foreground mb-4">
                <strong>Session cookies:</strong> These are temporary cookies that expire when you close your browser.
                <br />
                <strong>Persistent cookies:</strong> These remain on your device for a set period or until you delete
                them. Our persistent cookies typically expire within 1-2 years.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Updates to This Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an
                updated revision date.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                For questions about our use of cookies, contact us at:
                <br />
                Email: privacy@durotechrecruitment.com
                <br />
                Phone: +44 7950 206007
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

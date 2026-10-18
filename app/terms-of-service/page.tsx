import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Durotech Recruitment",
  description: "Terms and conditions governing the use of Durotech Recruitment services and website.",
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
            <p className="mt-4 text-slate-300">
              Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using the Durotech Recruitment website and services, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Our Services</h2>
              <p className="text-muted-foreground mb-4">
                Durotech Recruitment provides international recruitment and staffing services, connecting job seekers
                with employers across Europe, the Middle East, and Asia. Our services include job advertising, candidate
                sourcing, CV/resume review, interview coordination, and employment placement assistance.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">When using our services, you agree to:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the confidentiality of any account credentials</li>
                <li>Not misrepresent your qualifications, experience, or right to work</li>
                <li>Not use our services for any unlawful or fraudulent purpose</li>
                <li>Not attempt to gain unauthorised access to our systems</li>
                <li>Not copy, reproduce, or distribute our content without permission</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Job Applications</h2>
              <p className="text-muted-foreground mb-4">
                When you submit a job application through our platform, you confirm that all information provided is
                true and accurate. False or misleading information may result in rejection of your application or
                termination of any employment obtained through our services.
              </p>
              <p className="text-muted-foreground mb-4">
                We reserve the right to verify the accuracy of information provided, including employment history,
                qualifications, and right to work status. You consent to such verification checks.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. No Employment Guarantee</h2>
              <p className="text-muted-foreground mb-4">
                While we strive to match candidates with suitable opportunities, we do not guarantee employment. All
                hiring decisions are made by the employing organisations. We act as an intermediary and are not
                responsible for the final employment outcomes.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Fees and Charges</h2>
              <p className="text-muted-foreground mb-4">
                Our recruitment services are free for job seekers. We do not charge candidates any fees for
                registration, job applications, or placement services. Any request for payment from someone claiming to
                represent Durotech Recruitment should be reported immediately.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on our website, including text, graphics, logos, and software, is the property of Durotech
                Recruitment and is protected by copyright and trademark laws. You may not use, reproduce, or distribute
                our content without written permission.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                To the fullest extent permitted by law, Durotech Recruitment shall not be liable for any indirect,
                incidental, special, or consequential damages arising from your use of our services. Our total liability
                shall not exceed the amount of any fees paid by you to us in the 12 months preceding the claim.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                You agree to indemnify and hold harmless Durotech Recruitment, its officers, directors, employees, and
                agents from any claims, damages, losses, or expenses arising from your violation of these terms or your
                use of our services.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground mb-4">
                These Terms of Service shall be governed by the laws of England and Wales. Any disputes shall be subject
                to the exclusive jurisdiction of the courts of England and Wales, without prejudice to your statutory
                rights under applicable consumer protection laws.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these terms at any time. Material changes will be notified via our
                website or email. Continued use of our services after changes constitutes acceptance of the modified
                terms.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                For questions about these Terms of Service, contact us at:
                <br />
                Durotech Recruitment
                <br />
                123 Recruitment Street, London, EC1A 1BB, UK
                <br />
                Email: legal@durotechrecruitment.com
                <br />
                Phone: +44 20 1234 5678
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

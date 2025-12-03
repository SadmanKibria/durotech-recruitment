import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GDPR Compliance | Durotech Recruitment",
  description:
    "Information about how Durotech Recruitment complies with the General Data Protection Regulation (GDPR).",
}

export default function GDPRPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">GDPR Compliance</h1>
            <p className="mt-4 text-slate-300">Our commitment to data protection and privacy</p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">Our GDPR Commitment</h2>
              <p className="text-muted-foreground mb-4">
                Durotech Recruitment is fully committed to complying with the General Data Protection Regulation (GDPR)
                and protecting the personal data of all individuals we work with. As a recruitment agency operating
                across Europe, the Middle East, and Asia, we understand the importance of data protection and privacy.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Key GDPR Principles We Follow</h2>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>
                  <strong>Lawfulness, Fairness, and Transparency:</strong> We process data lawfully and are transparent
                  about how we use it
                </li>
                <li>
                  <strong>Purpose Limitation:</strong> We only collect data for specified, explicit purposes
                </li>
                <li>
                  <strong>Data Minimisation:</strong> We only collect data that is necessary for our services
                </li>
                <li>
                  <strong>Accuracy:</strong> We keep personal data accurate and up to date
                </li>
                <li>
                  <strong>Storage Limitation:</strong> We retain data only as long as necessary
                </li>
                <li>
                  <strong>Security:</strong> We implement appropriate security measures to protect data
                </li>
                <li>
                  <strong>Accountability:</strong> We take responsibility for GDPR compliance
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights Under GDPR</h2>
              <p className="text-muted-foreground mb-4">As a data subject, you have the following rights:</p>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Right to Access (Article 15)</h3>
                <p className="text-muted-foreground">
                  You can request a copy of all personal data we hold about you. We will provide this within 30 days of
                  your request.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Right to Rectification (Article 16)</h3>
                <p className="text-muted-foreground">
                  You can request that we correct any inaccurate personal data we hold about you.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Right to Erasure (Article 17)</h3>
                <p className="text-muted-foreground">
                  Also known as the 'right to be forgotten', you can request deletion of your personal data in certain
                  circumstances.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Right to Restrict Processing (Article 18)</h3>
                <p className="text-muted-foreground">
                  You can request that we limit how we use your data while complaints or disputes are resolved.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Right to Data Portability (Article 20)</h3>
                <p className="text-muted-foreground">
                  You can request your data in a structured, machine-readable format to transfer to another service.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Right to Object (Article 21)</h3>
                <p className="text-muted-foreground">
                  You can object to processing of your data based on legitimate interests or for direct marketing
                  purposes.
                </p>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4">How to Exercise Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                To exercise any of your GDPR rights, please contact our Data Protection Officer:
              </p>
              <ul className="list-none text-muted-foreground mb-4 space-y-2">
                <li>
                  <strong>Email:</strong> dpo@durotechrecruitment.com
                </li>
                <li>
                  <strong>Post:</strong> Data Protection Officer, Durotech Recruitment, 123 Recruitment Street, London,
                  EC1A 1BB, UK
                </li>
                <li>
                  <strong>Phone:</strong> +44 20 1234 5678
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                We will respond to your request within 30 days. If your request is complex, we may extend this by a
                further 60 days, but we will inform you if this is the case.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">International Data Transfers</h2>
              <p className="text-muted-foreground mb-4">
                As we operate globally, we may transfer your data outside the European Economic Area (EEA). When we do
                so, we ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>Transfers to countries with EU adequacy decisions</li>
                <li>Binding Corporate Rules where applicable</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Data Breach Procedures</h2>
              <p className="text-muted-foreground mb-4">
                In the event of a personal data breach, we will notify the relevant supervisory authority within 72
                hours where feasible. If the breach is likely to result in high risk to your rights and freedoms, we
                will also notify you directly without undue delay.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Complaints</h2>
              <p className="text-muted-foreground mb-4">
                If you believe we have not handled your data in accordance with GDPR, you have the right to lodge a
                complaint with a supervisory authority. In the UK, this is the Information Commissioner's Office (ICO):
              </p>
              <ul className="list-none text-muted-foreground mb-4 space-y-2">
                <li>
                  <strong>Website:</strong> ico.org.uk
                </li>
                <li>
                  <strong>Phone:</strong> 0303 123 1113
                </li>
                <li>
                  <strong>Address:</strong> Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

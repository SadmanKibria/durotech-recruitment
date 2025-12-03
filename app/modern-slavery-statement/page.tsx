import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Modern Slavery Statement | Durotech Recruitment",
  description:
    "Durotech Recruitment's commitment to preventing modern slavery and human trafficking in our operations and supply chains.",
}

export default function ModernSlaveryStatementPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">Modern Slavery Statement</h1>
            <p className="mt-4 text-slate-300">Financial Year 2024-2025</p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                This statement is made pursuant to Section 54 of the Modern Slavery Act 2015 and sets out the steps
                Durotech Recruitment has taken to ensure that modern slavery and human trafficking is not taking place
                in our business or supply chains.
              </p>
              <p className="text-muted-foreground mb-4">
                As an international recruitment agency, we recognise the heightened risk of modern slavery within the
                recruitment sector. We are committed to acting ethically and with integrity in all our business
                relationships and to implementing effective systems and controls to ensure slavery and human trafficking
                is not taking place anywhere in our operations.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Business</h2>
              <p className="text-muted-foreground mb-4">
                Durotech Recruitment is an international recruitment agency providing staffing solutions across Europe,
                the Middle East, and Asia. We operate in the construction, healthcare, engineering, food production, and
                warehousing sectors. Our services include permanent placement, temporary staffing, and workforce
                management solutions.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Policies</h2>
              <p className="text-muted-foreground mb-4">
                We have implemented the following policies to combat modern slavery:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>
                  <strong>Anti-Slavery Policy:</strong> Clear commitment to zero tolerance of slavery and human
                  trafficking
                </li>
                <li>
                  <strong>Recruitment Policy:</strong> Robust vetting procedures for all candidates
                </li>
                <li>
                  <strong>Whistleblowing Policy:</strong> Confidential reporting channels for concerns
                </li>
                <li>
                  <strong>Supplier Code of Conduct:</strong> Requirements for ethical standards from all partners
                </li>
                <li>
                  <strong>Equal Opportunities Policy:</strong> Fair treatment and respect for all workers
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Due Diligence</h2>
              <p className="text-muted-foreground mb-4">
                We undertake due diligence when considering taking on new suppliers and partners, and regularly review
                our existing supply chains. Our due diligence includes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Requiring suppliers to confirm they comply with modern slavery legislation</li>
                <li>Conducting site visits where appropriate</li>
                <li>Reviewing supplier labour practices</li>
                <li>Assessing country-specific risks</li>
                <li>Monitoring and evaluating supplier performance</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Risk Assessment</h2>
              <p className="text-muted-foreground mb-4">
                We have assessed our operations and identified that the highest potential risk areas for modern slavery
                are:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>International labour supply chains, particularly in lower-income regions</li>
                <li>Temporary and agency workers in certain industries</li>
                <li>Subcontracted labour arrangements</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                We have implemented enhanced due diligence procedures in these areas.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Training</h2>
              <p className="text-muted-foreground mb-4">
                All our staff receive training on modern slavery awareness, including how to identify potential signs of
                exploitation and how to report concerns. Specialist training is provided to staff in high-risk areas,
                including recruitment consultants and compliance officers.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Our Commitments</h2>
              <p className="text-muted-foreground mb-4">We are committed to:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Never charging recruitment fees to workers</li>
                <li>Verifying the age and right to work of all candidates</li>
                <li>Ensuring all workers receive written terms of employment</li>
                <li>Paying at least the applicable minimum wage</li>
                <li>Not withholding or retaining identity documents</li>
                <li>Providing safe working conditions</li>
                <li>Respecting workers' freedom to terminate employment</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Measuring Effectiveness</h2>
              <p className="text-muted-foreground mb-4">
                We measure the effectiveness of our anti-slavery measures through:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Regular audits of our recruitment processes</li>
                <li>Monitoring of whistleblowing reports</li>
                <li>Supplier questionnaires and assessments</li>
                <li>Staff training completion rates</li>
                <li>Feedback from workers and clients</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Reporting Concerns</h2>
              <p className="text-muted-foreground mb-4">
                Anyone who suspects modern slavery in our operations or supply chain should report their concerns to our
                designated Modern Slavery Officer at compliance@durotechrecruitment.com or through our confidential
                whistleblowing hotline.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Board Approval</h2>
              <p className="text-muted-foreground mb-4">
                This statement has been approved by the Board of Directors of Durotech Recruitment and will be reviewed
                and updated annually.
              </p>
              <p className="text-muted-foreground mt-8">
                <strong>Signed:</strong> [Director Name]
                <br />
                <strong>Position:</strong> Managing Director
                <br />
                <strong>Date:</strong>{" "}
                {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

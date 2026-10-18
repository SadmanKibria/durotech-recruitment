import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Durotech Recruitment",
  description:
    "Our privacy policy explains how we collect, use, and protect your personal data in compliance with GDPR and international data protection laws.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-4 text-slate-300">
              Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Durotech Recruitment ("we", "our", "us") is committed to protecting your privacy and personal data. This
                privacy policy explains how we collect, use, store, and protect your information when you use our
                services, including our website, job application services, and recruitment processes.
              </p>
              <p className="text-muted-foreground mb-4">
                We operate across Europe, the Middle East, and Asia, and comply with applicable data protection laws in
                all regions, including the General Data Protection Regulation (GDPR), UK Data Protection Act 2018, and
                relevant local laws.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data Controller</h2>
              <p className="text-muted-foreground mb-4">
                Durotech Recruitment is the data controller responsible for your personal data. Our registered office is
                located at 123 Recruitment Street, London, EC1A 1BB, United Kingdom. For data protection inquiries,
                contact our Data Protection Officer at dpo@durotechrecruitment.com.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect the following categories of personal data:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>
                  <strong>Identity Data:</strong> Full name, date of birth, nationality, passport/ID details
                </li>
                <li>
                  <strong>Contact Data:</strong> Email address, phone numbers, postal address
                </li>
                <li>
                  <strong>Professional Data:</strong> CV/resume, work history, qualifications, certifications, skills
                </li>
                <li>
                  <strong>Right to Work Data:</strong> Work permit status, visa information, employment eligibility
                </li>
                <li>
                  <strong>Application Data:</strong> Cover letters, job preferences, salary expectations
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type, device information, cookies
                </li>
                <li>
                  <strong>Communication Data:</strong> Records of correspondence with our team
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We process your personal data for the following purposes:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>To process and manage your job applications</li>
                <li>To match your profile with suitable job opportunities</li>
                <li>To communicate with you about job vacancies and recruitment services</li>
                <li>To verify your identity and right to work</li>
                <li>To share your information with prospective employers (with your consent)</li>
                <li>To comply with legal and regulatory obligations</li>
                <li>To improve our services and website functionality</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Legal Basis for Processing</h2>
              <p className="text-muted-foreground mb-4">We process your data under the following legal bases:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>
                  <strong>Consent:</strong> Where you have given explicit consent for specific purposes
                </li>
                <li>
                  <strong>Contract:</strong> To perform our recruitment services agreement with you
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with employment and immigration laws
                </li>
                <li>
                  <strong>Legitimate Interest:</strong> To operate and improve our recruitment services
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. International Data Transfers</h2>
              <p className="text-muted-foreground mb-4">
                As a global recruitment agency operating in Europe, the Middle East, and Asia, we may transfer your data
                internationally. We ensure appropriate safeguards are in place, including Standard Contractual Clauses
                (SCCs) approved by the European Commission, adequacy decisions, and binding corporate rules where
                applicable.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                We retain your personal data for as long as necessary to fulfill the purposes for which it was
                collected, typically for 3 years from your last interaction with us, unless a longer retention period is
                required by law. You may request deletion of your data at any time (see Your Rights below).
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Under GDPR and applicable data protection laws, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Request correction of inaccurate data
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")
                </li>
                <li>
                  <strong>Restriction:</strong> Request restriction of processing
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to another provider
                </li>
                <li>
                  <strong>Object:</strong> Object to processing based on legitimate interests
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                To exercise these rights, contact us at privacy@durotechrecruitment.com. We will respond within 30 days.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organisational measures to protect your personal data, including
                encryption, secure servers, access controls, and regular security assessments. We require all third
                parties to maintain equivalent security standards.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Third-Party Sharing</h2>
              <p className="text-muted-foreground mb-4">We may share your data with:</p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                <li>Prospective employers (with your explicit consent)</li>
                <li>Background check providers (where legally required)</li>
                <li>Our technology service providers (under strict data processing agreements)</li>
                <li>Legal and regulatory authorities (when required by law)</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Complaints</h2>
              <p className="text-muted-foreground mb-4">
                If you have concerns about how we handle your data, please contact us first. You also have the right to
                lodge a complaint with your local data protection authority. In the UK, this is the Information
                Commissioner's Office (ICO) at ico.org.uk.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                For privacy inquiries or to exercise your rights, contact:
                <br />
                Data Protection Officer
                <br />
                Durotech Recruitment
                <br />
                123 Recruitment Street, London, EC1A 1BB, UK
                <br />
                Email: dpo@durotechrecruitment.com
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

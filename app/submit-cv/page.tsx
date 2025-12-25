import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubmitCVForm } from "@/components/submit-cv-form"
import { FileText, CheckCircle, Globe, Briefcase } from "lucide-react"

export const metadata: Metadata = {
  title: "Submit Your CV - Join Our Talent Pool",
  description:
    "Submit your CV to Durotech Recruitment's talent pool and get matched with international job opportunities in construction, healthcare, engineering, warehousing, and food production. Visa sponsorship available.",
  keywords: [
    "submit CV",
    "upload resume",
    "talent pool",
    "international job opportunities",
    "recruitment database",
    "CV submission",
    "career opportunities",
    "job matching",
    "overseas employment",
  ],
  openGraph: {
    title: "Submit Your CV - Join Our International Talent Pool",
    description: "Upload your CV and get matched with job opportunities across Europe, Middle East, and Asia.",
    url: "https://durotech.co.uk/submit-cv",
  },
  alternates: {
    canonical: "https://durotech.co.uk/submit-cv",
  },
}

export default function SubmitCVPage() {
  const benefits = [
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access positions across 30+ countries in Europe, Middle East, and Asia",
    },
    {
      icon: Briefcase,
      title: "Multiple Industries",
      description: "We recruit for construction, healthcare, engineering, food production, and warehousing",
    },
    {
      icon: CheckCircle,
      title: "Priority Matching",
      description: "Get notified first when a role matching your profile becomes available",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-slate-900 py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Join Our Talent Pool</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance">
                Submit Your CV for
                <span className="text-primary"> Future Opportunities</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Don't see a role that fits? Submit your CV and we'll match you with suitable positions as they become
                available.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-secondary/30 border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4 p-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SubmitCVForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Users, Award, Target, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in every placement, matching the right talent with the right opportunity.",
    },
    {
      icon: Users,
      title: "Partnership",
      description:
        "We build lasting relationships with both candidates and employers based on trust and mutual success.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Our international network spans three continents, connecting talent with opportunities worldwide.",
    },
    {
      icon: Award,
      title: "Integrity",
      description:
        "We operate with transparency and honesty in all our dealings, ensuring fair treatment for everyone.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-foreground py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-background md:text-5xl text-balance">
                About Durotech Recruitment
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                For over 15 years, we have been connecting talented professionals with leading employers across the
                globe. Our expertise spans multiple industries and regions, making us your trusted partner in
                international recruitment.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
                <p className="mt-4 text-muted">
                  Founded in London, Durotech Recruitment began with a simple mission: to bridge the gap between
                  talented professionals and employers who need their skills. What started as a small consultancy has
                  grown into a global recruitment powerhouse.
                </p>
                <p className="mt-4 text-muted">
                  Today, we operate across Europe, the Middle East, and Asia, serving industries that form the backbone
                  of modern economies - construction, healthcare, engineering, food production, and warehousing.
                </p>
                <p className="mt-4 text-muted">
                  Our success is built on understanding both the aspirations of job seekers and the needs of employers,
                  creating matches that benefit everyone involved.
                </p>
              </div>
              <div className="relative">
                <img src="/professional-team-meeting-diverse-office.jpg" alt="Our team" className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Our Values</h2>
              <p className="mt-2 text-muted max-w-2xl mx-auto">The principles that guide everything we do</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="pt-6 text-center">
                    <value.icon className="mx-auto h-12 w-12 text-[#0066cc]" />
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <img src="/global-business-handshake-partnership.jpg" alt="Partnership" className="rounded-lg shadow-lg" />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-foreground">Why Choose Durotech?</h2>
                <ul className="mt-6 space-y-4">
                  {[
                    "Deep industry expertise across 5 key sectors",
                    "Established presence in 30+ countries",
                    "Dedicated support throughout the hiring process",
                    "Rigorous candidate screening and verification",
                    "Cultural integration assistance for international placements",
                    "Competitive salary negotiations on your behalf",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-[#10b981] flex-shrink-0" />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

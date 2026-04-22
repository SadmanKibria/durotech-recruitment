import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Users, Award, Target, CheckCircle, MapPin, Phone, Mail, Building } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Durotech Group",
  description:
    "Learn about Durotech Group, a leading global staffing agency with 15+ years experience connecting professionals with employers across Europe, Middle East, and Asia.",
  openGraph: {
    title: "About Durotech Group",
    description:
      "15+ years of worldwide employment excellence. Connecting talent with opportunities across 30+ countries.",
  },
}

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

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "5,000+", label: "Successful Placements" },
    { number: "30+", label: "Countries Served" },
    { number: "500+", label: "Partner Companies" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1E3A5F] to-[#2C5282] py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white md:text-5xl text-balance">About Durotech Group</h1>
              <p className="mt-6 text-lg text-blue-100 leading-relaxed">
                For over 15 years, we have been connecting talented professionals with leading employers across the
                globe. Our expertise spans multiple industries and regions, making us your trusted partner in worldwide
                employment and professional development.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="bg-[#F5C547] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[#1E3A5F]">{stat.number}</p>
                  <p className="text-sm md:text-base text-[#1E3A5F]/80 mt-2 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-semibold text-[#F5C547] uppercase tracking-wider">Our Story</span>
                <h2 className="mt-2 text-3xl font-bold text-foreground">Building Careers, Transforming Lives</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in London, Durotech Recruitment began with a simple mission: to bridge the gap between
                    talented professionals and employers who need their skills. What started as a small consultancy has
                    grown into a trusted name in international recruitment.
                  </p>
                  <p>
                    Today, we operate across Europe, the Middle East, and Asia, serving industries that form the
                    backbone of modern economies - construction, healthcare, engineering, food production, warehousing,
                    and garments.
                  </p>
                  <p>
                    Our success is built on understanding both the aspirations of job seekers and the needs of
                    employers, creating matches that benefit everyone involved. We also help students achieve their
                    dreams of studying abroad at prestigious universities worldwide.
                  </p>
                </div>
              </div>
              <div className="relative lg:pl-12">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#F5C547]">
                  <div className="w-full h-full bg-gradient-to-br from-[#1E3A5F]/20 to-[#F5C547]/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Building className="h-20 w-20 text-[#1E3A5F] mx-auto mb-4" />
                      <p className="text-2xl font-bold text-[#1E3A5F]">London Head Office</p>
                      <p className="text-muted-foreground mt-2">Serving clients worldwide since 2009</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-[#F5C547] uppercase tracking-wider">Our Values</span>
              <h2 className="mt-2 text-3xl font-bold text-foreground">The Principles That Guide Us</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Everything we do is driven by our commitment to these core values
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card
                  key={value.title}
                  className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-[#1E3A5F]" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-[#F5C547] uppercase tracking-wider">Why Choose Us</span>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Your Success Is Our Priority</h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <ul className="space-y-4">
                {[
                  "Deep industry expertise across 6 key sectors",
                  "Established presence in 30+ countries worldwide",
                  "Dedicated support throughout the recruitment process",
                  "Rigorous candidate screening and verification",
                  "Comprehensive visa and immigration assistance",
                  "Cultural integration support for international placements",
                  "Transparent communication at every stage",
                  "Post-placement support and follow-up",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="mt-0.5 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Industry Partnerships */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-[#F5C547] uppercase tracking-wider">Industry Leaders</span>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Strong Presence in Key Industries</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                We partner with industry leaders to bring expertise and excellence to every placement
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="border-2 border-[#F5C547]/30 hover:border-[#F5C547] transition-colors">
                <CardContent className="pt-8 pb-6 text-center">
                  <h3 className="font-semibold text-foreground mb-3">Construction & Engineering</h3>
                  <p className="text-sm text-muted-foreground mb-4">Skilled trades and infrastructure professionals</p>
                  <p className="text-xs text-slate-500">Connecting specialists with major projects</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#F5C547]/30 hover:border-[#F5C547] transition-colors relative md:scale-105 md:z-10">
                <CardContent className="pt-8 pb-6 text-center">
                  <a href="https://www.alnajmalzaher.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5C547] transition-colors">
                    <h3 className="font-semibold text-foreground mb-3">Featured Partner</h3>
                    <p className="text-sm text-muted-foreground mb-4">Al Najmal Al Zaher</p>
                    <p className="text-xs text-[#F5C547] font-medium">Industry Excellence Partner</p>
                  </a>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#F5C547]/30 hover:border-[#F5C547] transition-colors">
                <CardContent className="pt-8 pb-6 text-center">
                  <h3 className="font-semibold text-foreground mb-3">Healthcare & Wellbeing</h3>
                  <p className="text-sm text-muted-foreground mb-4">Care professionals and medical staff</p>
                  <p className="text-xs text-slate-500">Supporting quality care delivery</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="bg-[#1E3A5F] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-[#F5C547] uppercase tracking-wider">Get In Touch</span>
              <h2 className="mt-2 text-3xl font-bold text-white">Visit Our London Office</h2>
              <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
                Our head office is conveniently located in the heart of London. We welcome both in-person visits and
                remote consultations.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur border-white/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-[#F5C547] flex items-center justify-center flex-shrink-0">
                      <Building className="h-7 w-7 text-[#1E3A5F]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">Durotech Recruitment Ltd</h3>
                      <p className="text-sm text-blue-200 mt-1">London Head Office</p>
                      <div className="mt-6 space-y-4 text-blue-100">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-[#F5C547] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Address</p>
                            <p className="text-sm text-blue-200 mt-1">
                              123 Business Street
                              <br />
                              London, EC1A 1BB
                              <br />
                              United Kingdom
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-[#F5C547] flex-shrink-0" />
                          <div>
                            <p className="font-medium">Phone</p>
                            <a
                            href="tel:+447950206007"
                            className="text-sm text-blue-200 hover:text-white transition-colors"
                          >
                            +44 7950 206007
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-[#F5C547] flex-shrink-0" />
                          <div>
                            <p className="font-medium">Email</p>
                            <a
                              href="mailto:info@durotech.co.uk"
                              className="text-sm text-blue-200 hover:text-white transition-colors"
                            >
                              info@durotech.co.uk
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-sm text-blue-200">
                          <span className="font-medium text-white">Office Hours:</span>
                          <br />
                          Monday - Friday: 9:00 AM - 6:00 PM GMT
                          <br />
                          Saturday - Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

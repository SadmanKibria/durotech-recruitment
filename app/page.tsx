import type React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Globe,
  Users,
  Building2,
  Award,
  Briefcase,
  ChevronRight,
  FileText,
  GraduationCap,
  HardHat,
  Stethoscope,
  Cog,
  Shirt,
  Warehouse,
  Factory,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { createClient } from "@/lib/supabase/server"
import { type Job, INDUSTRIES } from "@/lib/types"

const industryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  construction: HardHat,
  food_production: Factory,
  health: Stethoscope,
  engineering: Cog,
  warehousing: Warehouse,
  garments: Shirt,
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6)

  const jobs = (featuredJobs || []) as Job[]

  const stats = [
    { icon: Users, value: "10,000+", label: "Candidates Placed" },
    { icon: Building2, value: "500+", label: "Partner Companies" },
    { icon: Globe, value: "30+", label: "Countries Served" },
    { icon: Award, value: "15+", label: "Years Experience" },
  ]

  const regions = [
    {
      name: "Europe",
      key: "europe",
      countries: "Germany, Netherlands, Poland, UK, France",
      image: "/european-city-skyline-architecture.jpg",
    },
    {
      name: "Middle East",
      key: "middle_east",
      countries: "UAE, Saudi Arabia, Qatar, Kuwait, Bahrain",
      image: "/dubai-modern-skyline-desert.jpg",
    },
    {
      name: "Asia",
      key: "asia",
      countries: "Singapore, Philippines, Thailand, Vietnam, Malaysia",
      image: "/singapore-modern-city-skyline.jpg",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#1E3A5F] py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5C547]/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge className="bg-[#F5C547] text-[#1E3A5F] hover:bg-[#F5C547]/90 mb-4">
                Global Recruitment & Education Solutions
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
                Your Global Career & Education
                <span className="text-[#F5C547]"> Journey Starts Here</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
                Durotech Recruitment connects talented professionals with leading employers across Europe, the Middle
                East, and Asia. We also help students achieve their dreams of studying at world-class universities.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6 bg-[#F5C547] text-[#1E3A5F] hover:bg-[#F5C547]/90">
                  <Link href="/jobs">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Find Employment
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 border-slate-500 text-white hover:bg-slate-800 bg-transparent"
                >
                  <Link href="/study-abroad">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Study Abroad
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b py-12 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two Services Cards */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Our Services</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                We provide comprehensive recruitment and education services globally
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Employment Card */}
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group">
                <div className="aspect-[16/9] relative bg-[#1E3A5F]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Briefcase className="h-24 w-24 text-[#F5C547]/30" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="bg-[#F5C547] text-[#1E3A5F] mb-3">Employment Services</Badge>
                    <h3 className="text-2xl font-bold text-white">International Recruitment</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Find your dream job in Construction, Healthcare, Engineering, Garments, Food Production, and
                    Warehousing across Europe, Middle East, and Asia.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Visa and work permit assistance
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Accommodation support
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      End-to-end recruitment process
                    </li>
                  </ul>
                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href="/jobs">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Browse Jobs
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href="/submit-cv">
                        <FileText className="mr-2 h-4 w-4" />
                        Submit CV
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Study Abroad Card */}
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group">
                <div className="aspect-[16/9] relative bg-[#1E3A5F]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="h-24 w-24 text-[#F5C547]/30" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="bg-[#F5C547] text-[#1E3A5F] mb-3">Education Services</Badge>
                    <h3 className="text-2xl font-bold text-white">Study Abroad Programs</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Achieve your academic dreams at world-class universities in UK, Germany, Canada, Australia, USA, and
                    more with our expert guidance.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      University selection & application
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Student visa assistance
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Scholarship guidance
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/study-abroad">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Explore Programs
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Opportunities</h2>
                <p className="mt-2 text-muted-foreground">Explore our latest job openings across the globe</p>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex bg-transparent">
                <Link href="/jobs">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {jobs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card className="py-16 border-dashed">
                <CardContent className="text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No jobs available</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Check back soon for new opportunities</p>
                </CardContent>
              </Card>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Button asChild>
                <Link href="/jobs">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Regions Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">We Operate Globally</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Find opportunities in your preferred region
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {regions.map((region) => (
                <Link key={region.key} href={`/jobs?region=${region.key}`} className="group">
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
                    <div className="aspect-[16/10] relative">
                      <img
                        src={region.image || "/placeholder.svg"}
                        alt={region.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/90 via-[#1E3A5F]/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {region.name}
                          <ChevronRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h3>
                        <p className="text-sm text-slate-300 mt-1">{region.countries}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Industries We Serve</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Specialized recruitment across diverse sectors
              </p>
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
              {Object.entries(INDUSTRIES).map(([key, name]) => {
                const IconComponent = industryIcons[key] || Building2
                return (
                  <Link key={key} href={`/jobs?industry=${key}`}>
                    <Card className="p-5 text-center hover:border-primary hover:shadow-md transition-all cursor-pointer h-full group">
                      <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium text-foreground text-sm">{name}</p>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Submit CV CTA Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-br from-[#1E3A5F] to-[#2A4A6F] border-0 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Don't See the Right Role?</h2>
                    <p className="mt-4 text-slate-300 max-w-xl">
                      Submit your CV to our talent pool and we'll match you with suitable positions as they become
                      available. Be the first to know about new opportunities.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button asChild size="lg" className="h-12 px-8 bg-[#F5C547] text-[#1E3A5F] hover:bg-[#F5C547]/90">
                      <Link href="/submit-cv">
                        <FileText className="mr-2 h-5 w-5" />
                        Submit Your CV
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#F5C547] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F]">Ready to Take the Next Step?</h2>
            <p className="mt-4 text-lg text-[#1E3A5F]/80 max-w-2xl mx-auto">
              Whether you're seeking employment or education opportunities abroad, we're here to help you succeed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90">
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Find Jobs
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F]/10 bg-transparent"
              >
                <Link href="/study-abroad">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Study Abroad
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import Link from "next/link"
import { ArrowRight, Globe, Users, Building2, Award, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { createClient } from "@/lib/supabase/server"
import { type Job, INDUSTRIES } from "@/lib/types"

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
      image: "/european-city-skyline.jpg",
    },
    {
      name: "Middle East",
      key: "middle_east",
      countries: "UAE, Saudi Arabia, Qatar, Kuwait, Bahrain",
      image: "/dubai-skyline-desert.png",
    },
    {
      name: "Asia",
      key: "asia",
      countries: "Singapore, Philippines, Thailand, Vietnam, Malaysia",
      image: "/asian-city-skyline-modern.jpg",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-foreground py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0066cc]/20 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-background sm:text-5xl md:text-6xl text-balance">
                Your Global Career
                <span className="text-[#0066cc]"> Starts Here</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
                Durotech Recruitment connects talented professionals with leading employers across Europe, the Middle
                East, and Asia. Find your dream job in construction, healthcare, engineering, and more.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-[#0066cc] hover:bg-[#0052a3] text-white">
                  <Link href="/jobs">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Browse All Jobs
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-muted-foreground text-background hover:bg-background/10 bg-transparent"
                >
                  <Link href="/about">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border py-12 bg-secondary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto h-8 w-8 text-[#0066cc]" />
                  <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Featured Opportunities</h2>
                <p className="mt-2 text-muted">Explore our latest job openings across the globe</p>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex bg-transparent">
                <Link href="/jobs">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-muted" />
                  <h3 className="mt-4 text-lg font-semibold">No jobs available</h3>
                  <p className="mt-2 text-sm text-muted">Check back soon for new opportunities</p>
                </CardContent>
              </Card>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Button asChild className="bg-[#0066cc] hover:bg-[#0052a3] text-white">
                <Link href="/jobs">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Regions Section */}
        <section className="bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">We Operate Globally</h2>
              <p className="mt-2 text-muted max-w-2xl mx-auto">Find opportunities in your preferred region</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {regions.map((region) => (
                <Link key={region.key} href={`/jobs?region=${region.key}`} className="group">
                  <Card className="overflow-hidden transition-transform group-hover:scale-[1.02]">
                    <div className="aspect-video relative">
                      <img
                        src={region.image || "/placeholder.svg"}
                        alt={region.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-background">
                        <h3 className="text-xl font-bold">{region.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{region.countries}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Industries We Serve</h2>
              <p className="mt-2 text-muted max-w-2xl mx-auto">Specialized recruitment across diverse sectors</p>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
              {Object.entries(INDUSTRIES).map(([key, name]) => (
                <Link key={key} href={`/jobs?industry=${key}`}>
                  <Card className="p-6 text-center hover:border-[#0066cc] transition-colors cursor-pointer">
                    <Building2 className="mx-auto h-8 w-8 text-[#0066cc]" />
                    <p className="mt-2 font-medium text-foreground">{name}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0066cc] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Take the Next Step?</h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Browse our current openings and apply today. Your international career awaits.
            </p>
            <Button asChild size="lg" className="mt-8 bg-white text-[#0066cc] hover:bg-white/90">
              <Link href="/jobs">
                Find Your Perfect Job
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

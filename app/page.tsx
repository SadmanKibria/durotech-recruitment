import Link from "next/link"
import { ArrowRight, Globe, Users, Building2, Award, Briefcase, ChevronRight } from "lucide-react"
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

  const industryIcons: Record<string, string> = {
    construction: "hard-hat",
    food_production: "utensils",
    health: "heart-pulse",
    engineering: "cog",
    warehousing: "warehouse",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative bg-slate-900 py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-primary font-medium mb-4">Global Recruitment Solutions</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
                Your Global Career
                <span className="text-primary"> Starts Here</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
                Durotech Recruitment connects talented professionals with leading employers across Europe, the Middle
                East, and Asia. Find your dream job in construction, healthcare, engineering, and more.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6">
                  <Link href="/jobs">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Browse All Jobs
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                >
                  <Link href="/about">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
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

        {/* Featured Jobs Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
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
        <section className="py-16 md:py-20 bg-background">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
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

        {/* Industries Section */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Industries We Serve</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Specialized recruitment across diverse sectors
              </p>
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {Object.entries(INDUSTRIES).map(([key, name]) => (
                <Link key={key} href={`/jobs?industry=${key}`}>
                  <Card className="p-5 text-center hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium text-foreground text-sm">{name}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground">Ready to Take the Next Step?</h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Browse our current openings and apply today. Your international career awaits.
            </p>
            <Button asChild size="lg" className="mt-8 bg-white text-primary hover:bg-white/90 h-12 px-8">
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

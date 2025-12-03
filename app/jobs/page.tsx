import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { createClient } from "@/lib/supabase/server"
import type { Job } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import Link from "next/link"
import { JobFilters } from "@/components/job-filters"

interface JobsPageProps {
  searchParams: Promise<{
    region?: string
    industry?: string
    type?: string
    search?: string
  }>
}

async function JobsList({ searchParams }: { searchParams: JobsPageProps["searchParams"] }) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false })

  if (params.region) {
    query = query.eq("region", params.region)
  }
  if (params.industry) {
    query = query.eq("industry", params.industry)
  }
  if (params.type) {
    query = query.eq("employment_type", params.type)
  }
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,location.ilike.%${params.search}%`,
    )
  }

  const { data: jobs } = await query

  const jobsList = (jobs || []) as Job[]

  if (jobsList.length === 0) {
    return (
      <Card className="py-12">
        <CardContent className="text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
          <p className="mt-2 text-sm text-muted">Try adjusting your filters or check back later</p>
          <Button asChild className="mt-4 bg-[#0066cc] hover:bg-[#0052a3] text-white">
            <Link href="/jobs">Clear Filters</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobsList.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-foreground py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-background">Find Your Perfect Job</h1>
            <p className="mt-2 text-muted-foreground">Browse opportunities across Europe, Middle East, and Asia</p>
          </div>
        </section>

        {/* Filters */}
        <JobFilters currentRegion={params.region} currentIndustry={params.industry} currentType={params.type} />

        {/* Jobs List */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense
              fallback={
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-64 animate-pulse bg-secondary" />
                  ))}
                </div>
              }
            >
              <JobsList searchParams={searchParams} />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

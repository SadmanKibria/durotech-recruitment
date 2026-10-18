import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { createClient } from "@/lib/supabase/server"
import type { Job } from "@/lib/types"
import { JobFilters } from "@/components/job-filters"
import { NoJobsFound, SearchNoResults } from "@/components/empty-states"
import { JobCardGridSkeleton } from "@/components/loading-skeletons"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "International Jobs - Europe, Middle East & Asia",
  description:
    "Browse thousands of job opportunities in construction, healthcare, engineering, warehousing, food production, and garments across 30+ countries. Visa sponsorship available. Apply today with Durotech Recruitment.",
  keywords: [
    "international jobs",
    "overseas jobs",
    "work abroad",
    "construction jobs Europe",
    "healthcare jobs UK",
    "engineering jobs Middle East",
    "warehouse jobs",
    "food production jobs",
    "garment industry jobs",
    "visa sponsorship jobs",
    "Europe jobs",
    "Middle East jobs",
    "Asia jobs",
  ],
  openGraph: {
    title: "Find Your Dream Job Abroad - Durotech Recruitment",
    description:
      "Explore international job opportunities across Europe, Middle East, and Asia with visa sponsorship support.",
    url: "https://durotech.co.uk/jobs",
  },
  alternates: {
    canonical: "https://durotech.co.uk/jobs",
  },
}

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
    if (params.search) {
      return <SearchNoResults query={params.search} />
    }
    return <NoJobsFound />
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        Showing {jobsList.length} {jobsList.length === 1 ? "job" : "jobs"}
        {params.region || params.industry || params.type ? " matching your filters" : " available"}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobsList.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </>
  )
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-secondary/30">
        {/* Hero */}
        <section className="bg-slate-900 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Find Your Perfect Job</h1>
            <p className="mt-2 text-slate-400">Browse opportunities across Europe, Middle East, and Asia</p>
          </div>
        </section>

        {/* Filters */}
        <JobFilters currentRegion={params.region} currentIndustry={params.industry} currentType={params.type} />

        {/* Jobs List */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<JobCardGridSkeleton count={6} />}>
              <JobsList searchParams={searchParams} />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

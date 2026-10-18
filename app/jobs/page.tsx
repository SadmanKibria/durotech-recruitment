import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { createClient } from "@/lib/supabase/server"
import type { Job } from "@/lib/types"
import { JobFilters } from "@/components/job-filters"
import { NoJobsFound, SearchNoResults } from "@/components/empty-states"
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

      <main className="flex-1 bg-[#f7f8fc]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0d1974] py-14 text-white sm:py-20">
          <div className="absolute -right-24 -top-32 size-96 rounded-full border-[54px] border-white/5" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#ffd35a]">Live opportunities</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-.04em] sm:text-6xl">Find work that moves you forward.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-blue-100/75">Clear vacancy details, simple applications and a real team to guide you through the process.</p>
          </div>
        </section>

        {/* Filters */}
        <JobFilters currentRegion={params.region} currentIndustry={params.industry} currentType={params.type} />

        {/* Jobs List */}
        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {await JobsList({ searchParams })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

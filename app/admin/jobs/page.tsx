import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, MapPin, Building2 } from "lucide-react"
import { REGIONS, INDUSTRIES } from "@/lib/types"
import { JobStatusToggle } from "@/components/admin/job-status-toggle"
import { NoJobsPosted } from "@/components/empty-states"
import { DeleteJobButton } from "@/components/admin/delete-job-button"

export default async function AdminJobsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: jobs } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground text-sm">Manage your job postings</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-lg truncate">{job.title}</h3>
                      <Badge variant={job.is_active ? "default" : "secondary"}>
                        {job.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}, {job.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {INDUSTRIES[job.industry as keyof typeof INDUSTRIES]}
                      </span>
                      <span>{REGIONS[job.region as keyof typeof REGIONS]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Posted: {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                    <JobStatusToggle job={job} />
                    <Link href={`/admin/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </Link>
                    <DeleteJobButton jobId={job.id} jobTitle={job.title} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <NoJobsPosted />
        )}
      </div>
    </div>
  )
}

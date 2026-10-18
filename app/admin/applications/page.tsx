import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Download, Eye, Calendar, AlertTriangle } from "lucide-react"
import { APPLICATION_STATUSES } from "@/lib/types"
import { NoApplications } from "@/components/empty-states"
import { SearchBar } from "@/components/admin/search-bar"

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const { status: statusFilter, search } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  let query = supabase.from("applications").select("*, job:jobs(*)").order("created_at", { ascending: false })

  if (statusFilter) query = query.eq("status", statusFilter)
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)

  const { data: applications } = await query

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: "bg-blue-50 text-blue-700 border-blue-200",
      offer_issued: "bg-amber-50 text-amber-700 border-amber-200",
      visa_applied: "bg-purple-50 text-purple-700 border-purple-200",
      visa_approved: "bg-green-50 text-green-700 border-green-200",
      at_embassy: "bg-cyan-50 text-cyan-700 border-cyan-200",
      visa_stamped: "bg-emerald-50 text-emerald-700 border-emerald-200",
      arrived: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-50 text-red-700 border-red-200",
    }
    return colors[status] || "bg-slate-50 text-slate-700 border-slate-200"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-muted-foreground text-sm">Review and manage job applications</p>
      </div>

      <SearchBar placeholder="Search by name, email, or phone..." baseUrl="/admin/applications" />

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <Link href="/admin/applications">
          <Button variant={!statusFilter ? "default" : "outline"} size="sm" className="whitespace-nowrap">
            All
          </Button>
        </Link>
        {Object.entries(APPLICATION_STATUSES).map(([key, label]) => (
          <Link key={key} href={`/admin/applications?status=${key}`}>
            <Button variant={statusFilter === key ? "default" : "outline"} size="sm" className="whitespace-nowrap">
              {label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {applications && applications.length > 0 ? (
          applications.map((app) => (
            <Card key={app.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-lg">{app.name}</h3>
                      <Badge variant="outline" className={getStatusColor(app.status)}>
                        {APPLICATION_STATUSES[app.status as keyof typeof APPLICATION_STATUSES] || app.status}
                      </Badge>
                      {app.is_duplicate && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Duplicate
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-primary">Applied for: {app.job?.title || "Unknown Job"}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {app.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <a href={app.resume_url} target="_blank" rel="noopener noreferrer" download>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Resume</span>
                      </Button>
                    </a>
                    <Link href={`/admin/applications/${app.id}`}>
                      <Button size="sm">
                        <Eye className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <NoApplications filtered={!!statusFilter || !!search} />
        )}
      </div>
    </div>
  )
}

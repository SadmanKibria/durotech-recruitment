import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Download, Eye } from "lucide-react"
import { APPLICATION_STATUSES } from "@/lib/types"

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: statusFilter } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  let query = supabase.from("applications").select("*, job:jobs(*)").order("created_at", { ascending: false })

  if (statusFilter) {
    query = query.eq("status", statusFilter)
  }

  const { data: applications } = await query

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "hired":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground">Review and manage job applications</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Link href="/admin/applications">
          <Button variant={!statusFilter ? "default" : "outline"} size="sm">
            All
          </Button>
        </Link>
        {Object.entries(APPLICATION_STATUSES).map(([key, label]) => (
          <Link key={key} href={`/admin/applications?status=${key}`}>
            <Button variant={statusFilter === key ? "default" : "outline"} size="sm">
              {label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {applications && applications.length > 0 ? (
          applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{app.name}</h3>
                      <Badge className={getStatusColor(app.status)}>
                        {APPLICATION_STATUSES[app.status as keyof typeof APPLICATION_STATUSES]}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-primary">Applied for: {app.job?.title || "Unknown Job"}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {app.phone}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Right to work: {app.right_to_work} | Applied: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    </a>
                    <Link href={`/admin/applications/${app.id}`}>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {statusFilter
                  ? `No ${APPLICATION_STATUSES[statusFilter as keyof typeof APPLICATION_STATUSES]?.toLowerCase()} applications`
                  : "No applications yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

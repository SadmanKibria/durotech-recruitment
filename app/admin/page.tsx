import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, CheckCircle, Clock, ArrowRight, Inbox, TrendingUp, Building2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { APPLICATION_STATUSES } from "@/lib/types"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch stats
  const { count: totalJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true })
  const { count: activeJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
  const { count: totalApplications } = await supabase.from("applications").select("*", { count: "exact", head: true })
  const { count: newApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "applied")

  const { count: totalCVs } = await supabase.from("speculative_cvs").select("*", { count: "exact", head: true })
  const { count: newCVs } = await supabase
    .from("speculative_cvs")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  // Fetch recent applications
  const { data: recentApplications } = await supabase
    .from("applications")
    .select("*, job:jobs(*)")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: companyStats } = await supabase
    .from("applications")
    .select("job:jobs(company_name)")
    .eq("status", "arrived")

  const companyBreakdown: Record<string, number> = {}
  companyStats?.forEach((app) => {
    const company = app.job?.company_name || "Unassigned"
    companyBreakdown[company] = (companyBreakdown[company] || 0) + 1
  })

  const stats = [
    {
      title: "Total Jobs",
      value: totalJobs || 0,
      icon: Briefcase,
      href: "/admin/jobs",
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Active Jobs",
      value: activeJobs || 0,
      icon: CheckCircle,
      href: "/admin/jobs",
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Applications",
      value: totalApplications || 0,
      icon: Users,
      href: "/admin/applications",
      color: "text-violet-600 bg-violet-100",
    },
    {
      title: "New Applications",
      value: newApplications || 0,
      icon: Clock,
      href: "/admin/applications?status=applied",
      color: "text-amber-600 bg-amber-100",
      highlight: (newApplications || 0) > 0,
    },
    {
      title: "Talent Pool",
      value: totalCVs || 0,
      icon: Inbox,
      href: "/admin/talent-pool",
      color: "text-cyan-600 bg-cyan-100",
    },
    {
      title: "New CVs",
      value: newCVs || 0,
      icon: TrendingUp,
      href: "/admin/talent-pool",
      color: "text-pink-600 bg-pink-100",
      highlight: (newCVs || 0) > 0,
    },
  ]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      applied: "bg-blue-50 text-blue-700 border-blue-200",
      offer_issued: "bg-amber-50 text-amber-700 border-amber-200",
      visa_applied: "bg-purple-50 text-purple-700 border-purple-200",
      visa_approved: "bg-green-50 text-green-700 border-green-200",
      at_embassy: "bg-cyan-50 text-cyan-700 border-cyan-200",
      visa_stamped: "bg-emerald-50 text-emerald-700 border-emerald-200",
      arrived: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-50 text-red-700 border-red-200",
    }
    return styles[status] || "bg-slate-50 text-slate-700 border-slate-200"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back!</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button>
            <Briefcase className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Grid - Updated to 6 columns for larger screens */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card
              className={`hover:shadow-md transition-all cursor-pointer h-full ${stat.highlight ? "ring-2 ring-amber-200" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <Link href="/admin/applications">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentApplications && recentApplications.length > 0 ? (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/admin/applications/${app.id}`}
                    className="flex flex-col p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate text-sm">{app.name}</p>
                      <Badge variant="outline" className={`${getStatusBadge(app.status)} text-xs`}>
                        {APPLICATION_STATUSES[app.status as keyof typeof APPLICATION_STATUSES] || app.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{app.job?.title || "Unknown Job"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No applications yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Workers by Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(companyBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(companyBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([company, count]) => (
                    <div key={company} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{company}</span>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {count} worker{count !== 1 ? "s" : ""} arrived
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No workers arrived yet</p>
                <p className="text-xs text-muted-foreground">Workers with "Arrived" status will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

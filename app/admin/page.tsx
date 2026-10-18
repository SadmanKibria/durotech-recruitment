import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, CheckCircle, Clock, ArrowRight, Inbox, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
    .eq("status", "new")

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

  const { data: recentCVs } = await supabase
    .from("speculative_cvs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

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
      title: "Total Applications",
      value: totalApplications || 0,
      icon: Users,
      href: "/admin/applications",
      color: "text-violet-600 bg-violet-100",
    },
    {
      title: "New Applications",
      value: newApplications || 0,
      icon: Clock,
      href: "/admin/applications?status=new",
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
      new: "bg-blue-50 text-blue-700 border-blue-200",
      reviewed: "bg-amber-50 text-amber-700 border-amber-200",
      shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      hired: "bg-purple-50 text-purple-700 border-purple-200",
      contacted: "bg-green-50 text-green-700 border-green-200",
      archived: "bg-slate-50 text-slate-700 border-slate-200",
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
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
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
            <CardTitle className="text-lg">Recent Talent Pool CVs</CardTitle>
            <Link href="/admin/talent-pool">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentCVs && recentCVs.length > 0 ? (
              <div className="space-y-3">
                {recentCVs.map((cv) => (
                  <Link
                    key={cv.id}
                    href={`/admin/talent-pool/${cv.id}`}
                    className="flex flex-col p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate text-sm">{cv.name}</p>
                      <Badge variant="outline" className={`${getStatusBadge(cv.status)} text-xs`}>
                        {cv.status.charAt(0).toUpperCase() + cv.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{cv.email}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {cv.preferred_industry && (
                        <Badge variant="secondary" className="text-xs">
                          {cv.preferred_industry.replace("_", " ")}
                        </Badge>
                      )}
                      {cv.preferred_region && (
                        <Badge variant="secondary" className="text-xs">
                          {cv.preferred_region.replace("_", " ")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(cv.created_at).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Inbox className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No CVs submitted yet</p>
                <p className="text-xs text-muted-foreground">Speculative CVs will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

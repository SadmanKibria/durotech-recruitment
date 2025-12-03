import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, CheckCircle, Clock, ArrowRight } from "lucide-react"
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

  // Fetch recent applications
  const { data: recentApplications } = await supabase
    .from("applications")
    .select("*, job:jobs(*)")
    .order("created_at", { ascending: false })
    .limit(5)

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
  ]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      reviewed: "bg-amber-50 text-amber-700 border-amber-200",
      shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      hired: "bg-purple-50 text-purple-700 border-purple-200",
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

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card
              className={`hover:shadow-md transition-all cursor-pointer ${stat.highlight ? "ring-2 ring-amber-200" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

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
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{app.name}</p>
                      <Badge variant="outline" className={getStatusBadge(app.status)}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{app.email}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      Applied for: {app.job?.title || "Unknown Job"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No applications yet</p>
              <p className="text-xs text-muted-foreground">Applications will appear here when candidates apply</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

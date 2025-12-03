import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

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
    },
    {
      title: "Active Jobs",
      value: activeJobs || 0,
      icon: CheckCircle,
      href: "/admin/jobs",
    },
    {
      title: "Total Applications",
      value: totalApplications || 0,
      icon: Users,
      href: "/admin/applications",
    },
    {
      title: "New Applications",
      value: newApplications || 0,
      icon: Clock,
      href: "/admin/applications?status=new",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentApplications && recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/admin/applications/${app.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">{app.email}</p>
                    <p className="text-sm text-muted-foreground">Applied for: {app.job?.title || "Unknown Job"}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : app.status === "reviewed"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "shortlisted"
                              ? "bg-green-100 text-green-800"
                              : app.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No applications yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

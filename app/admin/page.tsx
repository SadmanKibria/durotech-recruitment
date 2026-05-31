import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, CheckCircle, Clock, ArrowRight, Inbox, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { APPLICATION_STATUSES } from "@/lib/types"
import { DashboardFinancialSummary } from "@/components/admin/dashboard-financial-summary"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminDashboardPage() {
  // This component only runs if middleware allows it through

  const supabase = await createClient()

  let user = null
  let authError = false

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Auth error:", error)
      authError = true
    } else {
      user = data?.user
    }
  } catch (error) {
    console.error("Auth exception:", error)
    authError = true
  }

  // Only redirect if we're certain there's no user (not just a network error)
  if (!user && !authError) {
    redirect("/admin/login")
  }

  // Fetch stats with error handling
  let totalJobs = 0,
    activeJobs = 0,
    totalApplications = 0,
    newApplications = 0,
    totalCVs = 0,
    newCVs = 0
  let recentApplications: any[] = []
  let allApplications: any[] = []
  let totalIncome = 0,
    totalExpenses = 0

  try {
    const [
      jobsResult,
      activeJobsResult,
      applicationsResult,
      newAppsResult,
      cvsResult,
      newCvsResult,
      recentResult,
      allAppsResult,
      paymentsResult,
    ] = await Promise.all([
      supabase.from("jobs").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("applications").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "applied"),
      supabase.from("speculative_cvs").select("*", { count: "exact", head: true }),
      supabase.from("speculative_cvs").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("applications").select("*, job:jobs(*)").order("created_at", { ascending: false }).limit(5),
      supabase.from("applications").select("*, job:jobs(company_name, industry, region)"),
      supabase.from("application_payments").select("*"),
    ])

    totalJobs = jobsResult.count || 0
    activeJobs = activeJobsResult.count || 0
    totalApplications = applicationsResult.count || 0
    newApplications = newAppsResult.count || 0
    totalCVs = cvsResult.count || 0
    newCVs = newCvsResult.count || 0
    recentApplications = recentResult.data || []
    allApplications = allAppsResult.data || []

    // Calculate financial totals
    const payments = paymentsResult.data || []
    totalIncome = payments
      .filter((p: any) => p.payment_type === "incoming")
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
    totalExpenses = payments
      .filter((p: any) => p.payment_type === "outgoing")
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
  } catch (error) {
    console.error("Data fetch error:", error)
  }



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
          <p className="text-muted-foreground text-sm">Welcome back! Here's your recruitment overview.</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button>
            <Briefcase className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card
              className={`hover:shadow-md transition-all cursor-pointer h-full ${stat.highlight ? "ring-2 ring-amber-200 shadow-lg" : ""}`}
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

      {/* Financial Summary */}
      <DashboardFinancialSummary
        payments={
          (paymentsResult?.data as any[]) || []
        }
      />

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
    </div>
  )
}

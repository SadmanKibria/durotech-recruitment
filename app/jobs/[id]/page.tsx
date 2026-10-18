import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, DollarSign, Calendar, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { type Job, REGIONS, INDUSTRIES, EMPLOYMENT_TYPES } from "@/lib/types"

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).eq("is_active", true).single()

  if (!job) {
    notFound()
  }

  const jobData = job as Job

  const industryColors: Record<string, string> = {
    construction: "bg-amber-100 text-amber-800",
    food_production: "bg-green-100 text-green-800",
    health: "bg-red-100 text-red-800",
    engineering: "bg-blue-100 text-blue-800",
    warehousing: "bg-purple-100 text-purple-800",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Back Link */}
        <div className="bg-secondary border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/jobs"
              className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap items-start gap-3 mb-4">
                  <Badge className={industryColors[jobData.industry]}>{INDUSTRIES[jobData.industry]}</Badge>
                  <Badge variant="outline">{EMPLOYMENT_TYPES[jobData.employment_type]}</Badge>
                  <Badge variant="outline">{REGIONS[jobData.region]}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground">{jobData.title}</h1>
                <div className="mt-4 flex flex-wrap gap-4 text-muted">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {jobData.location}, {jobData.country}
                    </span>
                  </div>
                  {jobData.salary_range && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      <span>{jobData.salary_range}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Posted {new Date(jobData.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted whitespace-pre-wrap">{jobData.description}</p>
                </CardContent>
              </Card>

              {jobData.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobData.requirements
                        .split(".")
                        .filter(Boolean)
                        .map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted">
                            <CheckCircle className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                            <span>{req.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {jobData.benefits && (
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobData.benefits.split(",").map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted">
                          <CheckCircle className="h-5 w-5 text-[#0066cc] flex-shrink-0 mt-0.5" />
                          <span>{benefit.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Apply for this Position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Location:</span>
                      <span className="font-medium">{jobData.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Country:</span>
                      <span className="font-medium">{jobData.country}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Type:</span>
                      <span className="font-medium">{EMPLOYMENT_TYPES[jobData.employment_type]}</span>
                    </div>
                    {jobData.salary_range && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Salary:</span>
                        <span className="font-medium">{jobData.salary_range}</span>
                      </div>
                    )}
                  </div>
                  <Button asChild className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white" size="lg">
                    <Link href={`/jobs/${jobData.id}/apply`}>Apply Now</Link>
                  </Button>
                  <p className="text-xs text-center text-muted">No account needed - apply directly</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

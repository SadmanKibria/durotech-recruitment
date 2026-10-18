import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, DollarSign, Calendar, CheckCircle, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/server"
import { type Job, REGIONS, INDUSTRIES, EMPLOYMENT_TYPES } from "@/lib/types"
import { ApplicationForm } from "@/components/application-form"

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
    construction: "bg-amber-100 text-amber-800 border-amber-200",
    food_production: "bg-green-100 text-green-800 border-green-200",
    health: "bg-red-100 text-red-800 border-red-200",
    engineering: "bg-blue-100 text-blue-800 border-blue-200",
    warehousing: "bg-purple-100 text-purple-800 border-purple-200",
  }

  const parseRequirements = (text: string | null) => {
    if (!text) return []
    return text
      .split(/[.\n]/)
      .map((item) => item.replace(/^[-•*]\s*/, "").trim())
      .filter((item) => item.length > 0)
  }

  const parseBenefits = (text: string | null) => {
    if (!text) return []
    return text
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <Header />

      <main className="flex-1">
        {/* Back Link */}
        <div className="bg-background border-b">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/jobs"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all jobs
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Job Header */}
          <div className="bg-background rounded-xl border p-6 sm:p-8 mb-6">
            <div className="flex flex-wrap items-start gap-2 mb-4">
              <Badge className={`${industryColors[jobData.industry]} border`}>{INDUSTRIES[jobData.industry]}</Badge>
              <Badge variant="outline">{EMPLOYMENT_TYPES[jobData.employment_type]}</Badge>
              <Badge variant="outline">{REGIONS[jobData.region]}</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{jobData.title}</h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {jobData.location}, {jobData.country}
                </span>
              </div>
              {jobData.salary_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{jobData.salary_range}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{EMPLOYMENT_TYPES[jobData.employment_type]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Posted{" "}
                  {new Date(jobData.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About this role</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{jobData.description}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              {jobData.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {parseRequirements(jobData.requirements).map((req, index) => (
                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {jobData.benefits && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What we offer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {parseBenefits(jobData.benefits).map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 text-muted-foreground">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Application Form */}
            <div className="lg:col-span-2">
              <Card className="sticky top-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Apply for this position</CardTitle>
                  <p className="text-sm text-muted-foreground">No account needed - submit your application directly</p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <ApplicationForm jobId={jobData.id} jobTitle={jobData.title} />
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

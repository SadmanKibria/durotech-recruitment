import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { type Job, INDUSTRIES, REGIONS } from "@/lib/types"
import { ApplicationForm } from "@/components/application-form"

interface ApplyPageProps {
  params: Promise<{ id: string }>
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params
  redirect(`/jobs/${id}`)

  const supabase = await createClient()

  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).eq("is_active", true).single()

  if (!job) {
    notFound()
  }

  const jobData = job as Job

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-secondary">
        {/* Back Link */}
        <div className="bg-background border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href={`/jobs/${id}`}
              className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Details
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Job Summary */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{jobData.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {jobData.location}, {jobData.country} • {REGIONS[jobData.region]}
                  </CardDescription>
                </div>
                <Badge className="bg-[#0066cc] text-white">{INDUSTRIES[jobData.industry]}</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Application</CardTitle>
              <CardDescription>
                Fill out the form below to apply for this position. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationForm jobId={id} jobTitle={jobData.title} />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

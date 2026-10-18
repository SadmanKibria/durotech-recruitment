import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Mail, Phone, Briefcase, Globe, Home, Utensils, AlertTriangle, User } from "lucide-react"
import { APPLICATION_STATUSES, INDUSTRIES, REGIONS } from "@/lib/types"
import { ApplicationNotes } from "@/components/admin/application-notes"
import { EmailApplicantButton } from "@/components/admin/email-applicant-button"
import { ApplicationReferenceAgent } from "@/components/admin/application-reference-agent"
import { ApplicationManagementForm } from "@/components/admin/application-management-form"

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.error("Auth error:", error)
  }

  if (!user) redirect("/admin/login")

  const { data: application } = await supabase.from("applications").select("*, job:jobs(*)").eq("id", id).single()

  if (!application) notFound()

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: "bg-blue-100 text-blue-800",
      offer_issued: "bg-amber-100 text-amber-800",
      visa_applied: "bg-purple-100 text-purple-800",
      visa_approved: "bg-green-100 text-green-800",
      at_embassy: "bg-cyan-100 text-cyan-800",
      visa_stamped: "bg-emerald-100 text-emerald-800",
      arrived: "bg-green-200 text-green-900",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/applications">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{application.name}</h1>
            {application.is_duplicate && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Duplicate
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Applied for {application.job?.title || "Unknown Position"}</p>
        </div>
        <Badge className={`${getStatusColor(application.status)} text-sm px-3 py-1`}>
          {APPLICATION_STATUSES[application.status as keyof typeof APPLICATION_STATUSES]}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{application.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{application.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Right to Work</p>
                <p className="font-medium">{application.right_to_work}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Citizenship</p>
                <p className="font-medium">{application.citizenship_country || "Not specified"}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center p-2 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Visa Required</p>
                <Badge variant={application.visa_required === "Yes" ? "default" : "secondary"}>
                  {application.visa_required || "No"}
                </Badge>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <Home className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Accommodation</p>
                <Badge variant={application.accommodation_required === "Yes" ? "default" : "secondary"}>
                  {application.accommodation_required || "No"}
                </Badge>
              </div>
              <div className="text-center p-2 bg-muted rounded-lg">
                <Utensils className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Food</p>
                <Badge variant={application.food_required === "Yes" ? "default" : "secondary"}>
                  {application.food_required || "No"}
                </Badge>
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <a href={application.resume_url} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              </a>
              <EmailApplicantButton
                applicantEmail={application.email}
                applicantName={application.name}
                jobTitle={application.job?.title || "the position"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {application.job ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{application.job.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{application.job.company_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{INDUSTRIES[application.job.industry as keyof typeof INDUSTRIES]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {application.job.location}, {application.job.country}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="font-medium">{REGIONS[application.job.region as keyof typeof REGIONS]}</p>
                </div>
                <Link href={`/jobs/${application.job.id}`} target="_blank">
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    View Job Listing
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground">Job details not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Reference / Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationReferenceAgent application={application} />
        </CardContent>
      </Card>

      {application.cover_letter && (
        <Card>
          <CardHeader>
            <CardTitle>Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{application.cover_letter}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Application Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationManagementForm application={application} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationNotes application={application} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Application submitted on {new Date(application.created_at).toLocaleString()}
            {application.updated_at !== application.created_at && (
              <> | Last updated: {new Date(application.updated_at).toLocaleString()}</>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

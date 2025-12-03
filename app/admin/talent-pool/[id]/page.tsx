import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Mail, Phone, MapPin, Briefcase, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { type SpeculativeCV, CV_STATUSES, REGIONS, INDUSTRIES } from "@/lib/types"
import { format } from "date-fns"
import { CVStatusSelect } from "@/components/admin/cv-status-select"
import { CVNotes } from "@/components/admin/cv-notes"

export default async function TalentPoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: cv, error } = await supabase.from("speculative_cvs").select("*").eq("id", id).single()

  if (error || !cv) {
    notFound()
  }

  const speculativeCV = cv as SpeculativeCV

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "contacted":
        return "bg-green-100 text-green-800 border-green-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/talent-pool">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Talent Pool
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{speculativeCV.name}</h1>
            <p className="text-muted-foreground">Speculative CV Submission</p>
          </div>
          <Badge className={`${getStatusColor(speculativeCV.status)} text-sm px-3 py-1`}>
            {CV_STATUSES[speculativeCV.status as keyof typeof CV_STATUSES]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a href={`mailto:${speculativeCV.email}`} className="font-medium text-primary hover:underline">
                  {speculativeCV.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <a href={`tel:${speculativeCV.phone}`} className="font-medium hover:underline">
                  {speculativeCV.phone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Region</p>
                <p className="font-medium">
                  {speculativeCV.preferred_region
                    ? REGIONS[speculativeCV.preferred_region as keyof typeof REGIONS] || speculativeCV.preferred_region
                    : "Any"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Industry</p>
                <p className="font-medium">
                  {speculativeCV.preferred_industry
                    ? INDUSTRIES[speculativeCV.preferred_industry as keyof typeof INDUSTRIES] ||
                      speculativeCV.preferred_industry
                    : "Any"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Right to Work</p>
                <p className="font-medium capitalize">{speculativeCV.right_to_work.replace("_", " ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume & Cover Letter */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Resume</CardTitle>
            <Button asChild size="sm">
              <a href={speculativeCV.resume_url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download CV
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-medium text-foreground">{speculativeCV.resume_filename}</span>
            </p>
            {speculativeCV.cover_letter && (
              <div>
                <h4 className="font-medium mb-2">Cover Letter / Additional Information</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">{speculativeCV.cover_letter}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Update */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <CVStatusSelect cvId={speculativeCV.id} currentStatus={speculativeCV.status} />
          </CardContent>
        </Card>

        {/* Admin Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admin Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <CVNotes cvId={speculativeCV.id} initialNotes={speculativeCV.admin_notes || ""} />
          </CardContent>
        </Card>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Submitted on {format(new Date(speculativeCV.created_at), "MMMM d, yyyy 'at' h:mm a")}
        </div>
      </div>
    </div>
  )
}

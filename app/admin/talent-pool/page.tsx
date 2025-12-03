import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Mail, Eye, Inbox } from "lucide-react"
import Link from "next/link"
import { type SpeculativeCV, CV_STATUSES, REGIONS, INDUSTRIES } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

export default async function TalentPoolPage() {
  const supabase = await createClient()

  const { data: cvs, error } = await supabase
    .from("speculative_cvs")
    .select("*")
    .order("created_at", { ascending: false })

  const speculativeCVs = (cvs || []) as SpeculativeCV[]

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Talent Pool</h1>
          <p className="text-muted-foreground">
            Manage speculative CVs from candidates looking for future opportunities
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {speculativeCVs.length} CVs
        </Badge>
      </div>

      {speculativeCVs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No CVs submitted yet</h3>
            <p className="text-muted-foreground text-center mt-2 max-w-md">
              When candidates submit their CVs for future opportunities, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {speculativeCVs.map((cv) => (
            <Card key={cv.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{cv.name}</h3>
                      <Badge className={getStatusColor(cv.status)}>
                        {CV_STATUSES[cv.status as keyof typeof CV_STATUSES]}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">{cv.email}</p>
                      <p>{cv.phone}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cv.preferred_region && (
                          <Badge variant="outline">
                            {REGIONS[cv.preferred_region as keyof typeof REGIONS] || cv.preferred_region}
                          </Badge>
                        )}
                        {cv.preferred_industry && (
                          <Badge variant="outline">
                            {INDUSTRIES[cv.preferred_industry as keyof typeof INDUSTRIES] || cv.preferred_industry}
                          </Badge>
                        )}
                        <Badge variant="outline">{cv.right_to_work.replace("_", " ")}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted {formatDistanceToNow(new Date(cv.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/talent-pool/${cv.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={cv.resume_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        CV
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={`mailto:${cv.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

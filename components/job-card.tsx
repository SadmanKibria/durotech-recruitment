import Link from "next/link"
import { MapPin, Building2, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Job, REGIONS, INDUSTRIES, EMPLOYMENT_TYPES } from "@/lib/types"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const industryColors: Record<string, string> = {
    construction: "bg-amber-100 text-amber-800",
    food_production: "bg-green-100 text-green-800",
    health: "bg-red-100 text-red-800",
    engineering: "bg-blue-100 text-blue-800",
    warehousing: "bg-purple-100 text-purple-800",
  }

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg text-foreground line-clamp-2">{job.title}</h3>
            <p className="text-sm text-muted mt-1">{job.country}</p>
          </div>
          <Badge className={industryColors[job.industry] || "bg-secondary text-secondary-foreground"}>
            {INDUSTRIES[job.industry]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <div className="space-y-2 text-sm text-muted">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>
              {job.location}, {REGIONS[job.region]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span>{INDUSTRIES[job.industry]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{EMPLOYMENT_TYPES[job.employment_type]}</span>
          </div>
          {job.salary_range && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span>{job.salary_range}</span>
            </div>
          )}
        </div>
        <p className="mt-3 text-sm text-muted line-clamp-2">{job.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

import Link from "next/link"
import { MapPin, Clock, ArrowRight, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Job, REGIONS, INDUSTRIES, EMPLOYMENT_TYPES, CURRENCIES } from "@/lib/types"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const industryColors: Record<string, string> = {
    construction: "bg-amber-50 text-amber-700 border-amber-200",
    food_production: "bg-emerald-50 text-emerald-700 border-emerald-200",
    health: "bg-rose-50 text-rose-700 border-rose-200",
    engineering: "bg-blue-50 text-blue-700 border-blue-200",
    warehousing: "bg-violet-50 text-violet-700 border-violet-200",
    garments: "bg-pink-50 text-pink-700 border-pink-200",
  }

  const currencySymbol = CURRENCIES[job.currency as keyof typeof CURRENCIES]?.split(" ")[0] || job.currency

  return (
    <Card className="flex flex-col h-full group hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{job.company_name || job.country}</p>
          </div>
          <Badge
            variant="outline"
            className={`${industryColors[job.industry] || "bg-secondary"} text-xs flex-shrink-0`}
          >
            {INDUSTRIES[job.industry]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
            <span className="truncate">
              {job.location}, {REGIONS[job.region]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
            <span>{EMPLOYMENT_TYPES[job.employment_type]}</span>
          </div>
          {job.positions_available > 1 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0 text-muted-foreground/70" />
              <span>{job.positions_available} positions</span>
            </div>
          )}
          {job.salary_range && (
            <p className="font-medium text-foreground pt-1">
              {currencySymbol} {job.salary_range}/month
            </p>
          )}
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          variant="outline"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors bg-transparent"
        >
          <Link href={`/jobs/${job.id}`} className="flex items-center justify-center gap-2">
            View & Apply
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

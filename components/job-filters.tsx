"use client"

import { useRouter } from "next/navigation"
import { REGIONS, INDUSTRIES, EMPLOYMENT_TYPES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import Link from "next/link"

interface JobFiltersProps {
  currentRegion?: string
  currentIndustry?: string
  currentType?: string
}

export function JobFilters({ currentRegion, currentIndustry, currentType }: JobFiltersProps) {
  const router = useRouter()

  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href)
    if (value && value !== "all") {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
    router.push(url.pathname + url.search)
  }

  const hasFilters = currentRegion || currentIndustry || currentType

  return (
    <section className="border-b border-slate-200 bg-white py-5 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-[#fafbff] p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={currentRegion || "all"} onValueChange={(value) => handleFilterChange("region", value)}>
              <SelectTrigger className="w-[140px] sm:w-[160px] h-9">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Object.entries(REGIONS).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={currentIndustry || "all"} onValueChange={(value) => handleFilterChange("industry", value)}>
              <SelectTrigger className="w-[140px] sm:w-[160px] h-9">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {Object.entries(INDUSTRIES).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={currentType || "all"} onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger className="w-[140px] sm:w-[160px] h-9">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(EMPLOYMENT_TYPES).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button asChild variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground">
                <Link href="/jobs" className="flex items-center gap-1">
                  <X className="h-3.5 w-3.5" />
                  Clear
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

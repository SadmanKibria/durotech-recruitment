"use client"

import { REGIONS, INDUSTRIES, EMPLOYMENT_TYPES } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import Link from "next/link"

interface JobFiltersProps {
  currentRegion?: string
  currentIndustry?: string
  currentType?: string
}

export function JobFilters({ currentRegion, currentIndustry, currentType }: JobFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    const url = new URL(window.location.href)
    if (value) {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
    window.location.href = url.toString()
  }

  return (
    <section className="border-b border-border py-6 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <select
            name="region"
            defaultValue={currentRegion || ""}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            onChange={(e) => handleFilterChange("region", e.target.value)}
          >
            <option value="">All Regions</option>
            {Object.entries(REGIONS).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>

          <select
            name="industry"
            defaultValue={currentIndustry || ""}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            onChange={(e) => handleFilterChange("industry", e.target.value)}
          >
            <option value="">All Industries</option>
            {Object.entries(INDUSTRIES).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>

          <select
            name="type"
            defaultValue={currentType || ""}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            onChange={(e) => handleFilterChange("type", e.target.value)}
          >
            <option value="">All Types</option>
            {Object.entries(EMPLOYMENT_TYPES).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>

          {(currentRegion || currentIndustry || currentType) && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/jobs">Clear All</Link>
            </Button>
          )}
        </form>
      </div>
    </section>
  )
}

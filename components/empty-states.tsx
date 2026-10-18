"use client"

import type React from "react"

import { Briefcase, FileText, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          {icon || <AlertCircle className="h-8 w-8 text-muted-foreground" />}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
        {action &&
          (action.href ? (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          ))}
      </CardContent>
    </Card>
  )
}

export function NoJobsFound() {
  return (
    <EmptyState
      icon={<Briefcase className="h-8 w-8 text-muted-foreground" />}
      title="No jobs found"
      description="We couldn't find any jobs matching your criteria. Try adjusting your filters or check back later for new opportunities."
      action={{ label: "Clear Filters", href: "/jobs" }}
    />
  )
}

export function NoApplications({ filtered }: { filtered?: boolean }) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      title={filtered ? "No matching applications" : "No applications yet"}
      description={
        filtered
          ? "No applications match your current filter. Try selecting a different status."
          : "When candidates apply for jobs, their applications will appear here."
      }
      action={filtered ? { label: "View All Applications", href: "/admin/applications" } : undefined}
    />
  )
}

export function NoJobsPosted() {
  return (
    <EmptyState
      icon={<Briefcase className="h-8 w-8 text-muted-foreground" />}
      title="No jobs posted yet"
      description="Start attracting candidates by posting your first job opening."
      action={{ label: "Post Your First Job", href: "/admin/jobs/new" }}
    />
  )
}

export function SearchNoResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      title="No results found"
      description={`We couldn't find any results for "${query}". Try different keywords or browse all jobs.`}
      action={{ label: "Browse All Jobs", href: "/jobs" }}
    />
  )
}

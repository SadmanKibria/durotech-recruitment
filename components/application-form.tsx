"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2, CheckCircle } from "lucide-react"

interface ApplicationFormProps {
  jobId: string
  jobTitle: string
}

export function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append("jobId", jobId)
    formData.append("jobTitle", jobTitle)

    if (resumeFile) {
      formData.append("resume", resumeFile)
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application")
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-[#10b981]" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">Application Submitted!</h3>
        <p className="mt-2 text-muted max-w-md mx-auto">
          Thank you for applying. We have sent a confirmation email to your inbox. Our team will review your application
          and get back to you soon.
        </p>
        <Button onClick={() => router.push("/jobs")} className="mt-6 bg-[#0066cc] hover:bg-[#0052a3] text-white">
          Browse More Jobs
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" required placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" name="email" type="email" required placeholder="john@example.com" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="+1 234 567 8900" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rightToWork">Right to Work *</Label>
          <Select name="rightToWork" required>
            <SelectTrigger>
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="citizen">Citizen</SelectItem>
              <SelectItem value="permanent_resident">Permanent Resident</SelectItem>
              <SelectItem value="work_visa">Work Visa</SelectItem>
              <SelectItem value="require_sponsorship">Require Sponsorship</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">Resume/CV (PDF) *</Label>
        <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
          <input
            id="resume"
            name="resumeInput"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setResumeFile(file)
              }
            }}
          />
          <label htmlFor="resume" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted" />
            {resumeFile ? (
              <span className="text-sm font-medium text-foreground">{resumeFile.name}</span>
            ) : (
              <>
                <span className="text-sm font-medium text-foreground">Click to upload your resume</span>
                <span className="text-xs text-muted">PDF, DOC, or DOCX (Max 10MB)</span>
              </>
            )}
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
        <Textarea
          id="coverLetter"
          name="coverLetter"
          rows={5}
          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
        />
      </div>

      {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  )
}

"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2, CheckCircle, FileText, X, AlertCircle, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { generateMathChallenge, validateSubmissionTiming, checkRateLimit, recordSubmission } from "@/lib/security"

interface ApplicationFormProps {
  jobId: string
  jobTitle: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const [formStartTime, setFormStartTime] = useState<number>(0)
  const [mathChallenge, setMathChallenge] = useState<{ question: string; answer: number } | null>(null)
  const [mathAnswer, setMathAnswer] = useState("")
  const [honeypot, setHoneypot] = useState("")

  useEffect(() => {
    setFormStartTime(Date.now())
    setMathChallenge(generateMathChallenge())
  }, [])

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Please upload a PDF or Word document (.pdf, .doc, .docx)"
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileError = validateFile(file)
      if (fileError) {
        setFieldErrors((prev) => ({ ...prev, resume: fileError }))
        setResumeFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        setFieldErrors((prev) => {
          const { resume, ...rest } = prev
          return rest
        })
        setResumeFile(file)
      }
    }
  }

  const removeFile = () => {
    setResumeFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {}

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const rightToWork = formData.get("rightToWork") as string

    if (!name?.trim()) {
      errors.name = "Full name is required"
    } else if (name.trim().length < 2) {
      errors.name = "Please enter your full name"
    }

    if (!email?.trim()) {
      errors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!phone?.trim()) {
      errors.phone = "Phone number is required"
    } else if (phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Please enter a valid phone number"
    }

    if (!rightToWork) {
      errors.rightToWork = "Please select your right to work status"
    }

    if (!resumeFile) {
      errors.resume = "Please upload your resume/CV"
    }

    if (!mathAnswer.trim()) {
      errors.math = "Please answer the security question"
    } else if (mathChallenge && Number.parseInt(mathAnswer) !== mathChallenge.answer) {
      errors.math = "Incorrect answer. Please try again."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (honeypot) {
      // Bot detected - silently succeed
      setIsSuccess(true)
      return
    }

    if (!validateSubmissionTiming(formStartTime)) {
      setError("Please take your time to fill out the form properly.")
      return
    }

    if (!checkRateLimit("application_submission", 5, 60 * 60 * 1000)) {
      setError("Too many submissions. Please try again later.")
      return
    }

    const formData = new FormData(e.currentTarget)

    if (!validateForm(formData)) {
      return
    }

    setIsSubmitting(true)
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

      recordSubmission("application")
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Application Submitted!</h3>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Thank you for applying for <span className="font-medium text-foreground">{jobTitle}</span>. We've sent a
          confirmation email to your inbox. Our team will review your application and get back to you soon.
        </p>
        <Button onClick={() => router.push("/jobs")} className="mt-6">
          Browse More Jobs
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            className={fieldErrors.name ? "border-destructive" : ""}
          />
          {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            className={fieldErrors.email ? "border-destructive" : ""}
          />
          {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 234 567 8900"
            className={fieldErrors.phone ? "border-destructive" : ""}
          />
          {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="rightToWork">
            Right to Work <span className="text-destructive">*</span>
          </Label>
          <Select name="rightToWork">
            <SelectTrigger className={fieldErrors.rightToWork ? "border-destructive" : ""}>
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
          {fieldErrors.rightToWork && <p className="text-xs text-destructive">{fieldErrors.rightToWork}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">
          Resume/CV <span className="text-destructive">*</span>
        </Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            fieldErrors.resume
              ? "border-destructive bg-destructive/5"
              : "border-input hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input
            ref={fileInputRef}
            id="resume"
            name="resumeInput"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          {resumeFile ? (
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-md">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{resumeFile.name}</span>
                <span className="text-xs text-muted-foreground">({(resumeFile.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button type="button" onClick={removeFile} className="p-1 hover:bg-muted rounded-full transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <label htmlFor="resume" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Click to upload your resume</span>
              <span className="text-xs text-muted-foreground">PDF, DOC, or DOCX (Max 5MB)</span>
            </label>
          )}
        </div>
        {fieldErrors.resume && <p className="text-xs text-destructive">{fieldErrors.resume}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverLetter">
          Cover Letter <span className="text-muted-foreground text-xs">(Optional)</span>
        </Label>
        <Textarea
          id="coverLetter"
          name="coverLetter"
          rows={4}
          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
          className="resize-none"
        />
      </div>

      <div className="space-y-2 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <Label htmlFor="math" className="text-sm font-medium">
            Security Check *
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{mathChallenge?.question}</p>
        <Input
          id="math"
          type="number"
          value={mathAnswer}
          onChange={(e) => setMathAnswer(e.target.value)}
          placeholder="Enter your answer"
          className={`max-w-32 ${fieldErrors.math ? "border-destructive" : ""}`}
        />
        {fieldErrors.math && <p className="text-xs text-destructive">{fieldErrors.math}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11" size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Application...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this application, you agree to our{" "}
        <a href="/privacy-policy" className="text-primary hover:underline">
          privacy policy
        </a>{" "}
        and{" "}
        <a href="/terms-of-service" className="text-primary hover:underline">
          terms of service
        </a>
        .
      </p>
    </form>
  )
}

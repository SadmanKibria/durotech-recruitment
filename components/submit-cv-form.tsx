"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react"
import { REGIONS, INDUSTRIES } from "@/lib/types"
import {
  generateMathChallenge,
  validateSubmissionTiming,
  isValidEmail,
  isValidPhone,
  checkRateLimit,
  recordSubmission,
} from "@/lib/security"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function SubmitCVForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [formStartTime, setFormStartTime] = useState<number>(0)

  // Bot protection
  const [mathChallenge, setMathChallenge] = useState<{ question: string; answer: number } | null>(null)
  const [mathAnswer, setMathAnswer] = useState("")
  const [honeypot, setHoneypot] = useState("") // Hidden field - bots will fill this

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_region: "",
    preferred_industry: "",
    right_to_work: "",
    cover_letter: "",
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormStartTime(Date.now())
    setMathChallenge(generateMathChallenge())
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }
    if (!formData.right_to_work) newErrors.right_to_work = "Please select your right to work status"
    if (!resumeFile) newErrors.resume = "Please upload your CV/Resume"

    // Validate math challenge
    if (!mathAnswer.trim()) {
      newErrors.math = "Please answer the security question"
    } else if (mathChallenge && Number.parseInt(mathAnswer) !== mathChallenge.answer) {
      newErrors.math = "Incorrect answer. Please try again."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, resume: "Please upload a PDF or Word document" }))
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, resume: "File size must be less than 5MB" }))
      return
    }

    setResumeFile(file)
    setFileName(file.name)
    setErrors((prev) => ({ ...prev, resume: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Bot checks
    if (honeypot) {
      // Bot detected - silently fail
      setSuccess(true)
      return
    }

    if (!validateSubmissionTiming(formStartTime)) {
      setError("Please take your time to fill out the form properly.")
      return
    }

    if (!checkRateLimit("cv_submission", 3, 60 * 60 * 1000)) {
      setError("Too many submissions. Please try again later.")
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Upload resume
      const fileFormData = new FormData()
      fileFormData.append("file", resumeFile!)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: fileFormData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload resume")
      }

      const { url: resumeUrl } = await uploadResponse.json()

      // Submit CV data
      const response = await fetch("/api/speculative-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          resume_url: resumeUrl,
          resume_filename: resumeFile!.name,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit CV")
      }

      recordSubmission("cv")
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-800">CV Submitted Successfully!</h3>
            <p className="mt-2 text-green-700 max-w-md mx-auto">
              Thank you for submitting your CV. Our team will review your profile and contact you when a suitable
              position becomes available.
            </p>
            <Button onClick={() => router.push("/jobs")} className="mt-6">
              Browse Current Openings
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your CV</CardTitle>
        <CardDescription>
          Fill in your details and upload your CV. We'll keep your information on file and contact you when a matching
          opportunity arises.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Honeypot field - hidden from users, bots will fill it */}
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
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 7123 456789"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="right_to_work">Right to Work *</Label>
              <Select
                value={formData.right_to_work}
                onValueChange={(value) => setFormData({ ...formData, right_to_work: value })}
              >
                <SelectTrigger className={errors.right_to_work ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="citizen">Citizen</SelectItem>
                  <SelectItem value="permanent_resident">Permanent Resident</SelectItem>
                  <SelectItem value="work_visa">Work Visa</SelectItem>
                  <SelectItem value="require_sponsorship">Require Sponsorship</SelectItem>
                </SelectContent>
              </Select>
              {errors.right_to_work && <p className="text-sm text-destructive">{errors.right_to_work}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferred_region">Preferred Region</Label>
              <Select
                value={formData.preferred_region}
                onValueChange={(value) => setFormData({ ...formData, preferred_region: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Region</SelectItem>
                  {Object.entries(REGIONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_industry">Preferred Industry</Label>
              <Select
                value={formData.preferred_industry}
                onValueChange={(value) => setFormData({ ...formData, preferred_industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Industry</SelectItem>
                  {Object.entries(INDUSTRIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">CV/Resume * (PDF or Word, max 5MB)</Label>
            <div className="relative">
              <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
              <label
                htmlFor="resume"
                className={`flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  errors.resume
                    ? "border-destructive bg-destructive/5"
                    : fileName
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <Upload className={`h-5 w-5 ${fileName ? "text-primary" : "text-muted-foreground"}`} />
                <span className={fileName ? "text-primary font-medium" : "text-muted-foreground"}>
                  {fileName || "Click to upload your CV"}
                </span>
              </label>
            </div>
            {errors.resume && <p className="text-sm text-destructive">{errors.resume}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_letter">Cover Letter / Additional Information</Label>
            <Textarea
              id="cover_letter"
              value={formData.cover_letter}
              onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
              placeholder="Tell us about your experience, skills, and what type of role you're looking for..."
              rows={4}
            />
          </div>

          {/* Security Question */}
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
              className={`max-w-32 ${errors.math ? "border-destructive" : ""}`}
            />
            {errors.math && <p className="text-sm text-destructive">{errors.math}</p>}
          </div>

          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit My CV"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to our{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

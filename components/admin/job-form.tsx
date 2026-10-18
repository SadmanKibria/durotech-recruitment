"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { REGIONS, INDUSTRIES, EMPLOYMENT_TYPES, CURRENCIES } from "@/lib/types"
import type { Job } from "@/lib/types"

interface JobFormProps {
  job?: Job
}

function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function JobForm({ job }: JobFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!job

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: job?.title || "",
    description: job?.description || "",
    country: job?.country || "",
    region: job?.region || "",
    industry: job?.industry || "",
    employment_type: job?.employment_type || "",
    salary_range: job?.salary_range || "",
    currency: job?.currency || "GBP",
    positions_available: job?.positions_available || 1,
    company_name: job?.company_name || "",
    requirements: job?.requirements || "",
    benefits: job?.benefits || "",
    is_active: job?.is_active ?? true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required"
    } else if (formData.title.length < 3) {
      newErrors.title = "Job title must be at least 3 characters"
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required"
    }

    if (!formData.region) {
      newErrors.region = "Please select a region"
    }

    if (!formData.industry) {
      newErrors.industry = "Please select an industry"
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }

    if (!formData.employment_type) {
      newErrors.employment_type = "Please select employment type"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required"
    } else if (formData.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters"
    }

    if (formData.positions_available < 1) {
      newErrors.positions_available = "At least 1 position required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    const data = {
      ...formData,
      title: capitalizeWords(formData.title.trim()),
      company_name: capitalizeWords(formData.company_name.trim()),
      country: capitalizeWords(formData.country.trim()),
      description: capitalizeFirstLetter(formData.description.trim()),
      requirements: formData.requirements ? capitalizeFirstLetter(formData.requirements.trim()) : null,
      benefits: formData.benefits ? capitalizeFirstLetter(formData.benefits.trim()) : null,
      location: capitalizeWords(formData.country.trim()), // Set location same as country
      updated_at: new Date().toISOString(),
    }

    if (isEditing) {
      const { error } = await supabase.from("jobs").update(data).eq("id", job.id)
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.from("jobs").insert(data)
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    }

    setSuccess(true)
    setTimeout(() => {
      router.push("/admin/jobs")
      router.refresh()
    }, 1000)
  }

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Job" : "Create New Job"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Job {isEditing ? "updated" : "created"} successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Senior Construction Manager"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              <p className="text-xs text-muted-foreground">Will be automatically capitalised</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                placeholder="e.g., ABC Construction Ltd"
                className={errors.company_name ? "border-red-500" : ""}
              />
              {errors.company_name && <p className="text-xs text-red-500">{errors.company_name}</p>}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select value={formData.region} onValueChange={(value) => handleChange("region", value)}>
                <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REGIONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-xs text-red-500">{errors.region}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleChange("industry", value)}>
                <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INDUSTRIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-xs text-red-500">{errors.industry}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="e.g., United Kingdom"
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type *</Label>
              <Select
                value={formData.employment_type}
                onValueChange={(value) => handleChange("employment_type", value)}
              >
                <SelectTrigger className={errors.employment_type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EMPLOYMENT_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employment_type && <p className="text-xs text-red-500">{errors.employment_type}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="positions_available">Positions *</Label>
              <Input
                id="positions_available"
                type="number"
                min="1"
                value={formData.positions_available}
                onChange={(e) => handleChange("positions_available", Number.parseInt(e.target.value) || 1)}
                className={errors.positions_available ? "border-red-500" : ""}
              />
              {errors.positions_available && <p className="text-xs text-red-500">{errors.positions_available}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CURRENCIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range">Monthly Salary</Label>
              <Input
                id="salary_range"
                value={formData.salary_range}
                onChange={(e) => handleChange("salary_range", e.target.value)}
                placeholder="e.g., 2,000 - 3,000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and expectations..."
              rows={6}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder="List the qualifications, skills, and experience required for this role..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Write as a paragraph or use full stops to separate points</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => handleChange("benefits", e.target.value)}
              placeholder="Describe the benefits and perks offered with this position..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Write as a paragraph or use full stops to separate points</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading || success}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Success!
                </>
              ) : isEditing ? (
                "Update Job"
              ) : (
                "Create Job"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

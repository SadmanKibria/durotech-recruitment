"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Upload } from "lucide-react"
import { REGIONS, INDUSTRIES } from "@/lib/types"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function ManualCVForm() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_region: "",
    preferred_industry: "",
    right_to_work: "",
    cover_letter: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB")
      return
    }

    setCvFile(file)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.name || !formData.email || !formData.phone || !cvFile) {
        throw new Error("Please fill in all required fields and upload a CV")
      }

      // Upload CV file
      const fileFormData = new FormData()
      fileFormData.append("file", cvFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: fileFormData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload CV file")
      }

      const { url: resumeUrl } = await uploadResponse.json()

      // Insert CV data
      const { error: insertError } = await supabase.from("speculative_cvs").insert([
        {
          ...formData,
          resume_url: resumeUrl,
          resume_filename: cvFile.name,
          status: "new",
        },
      ])

      if (insertError) throw insertError

      router.push("/admin/talent-pool")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+44 7123 456789"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="right_to_work">Right to Work *</Label>
          <Select
            value={formData.right_to_work}
            onValueChange={(value) => setFormData({ ...formData, right_to_work: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="citizen">Citizen</SelectItem>
              <SelectItem value="permanent_resident">Permanent Resident</SelectItem>
              <SelectItem value="work_visa">Work Visa</SelectItem>
              <SelectItem value="require_sponsorship">Require Sponsorship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
        <Label htmlFor="resume">CV File * (PDF or Word, max 10MB)</Label>
        <div className="flex gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="flex-1"
          />
          {cvFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setCvFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
            >
              Clear
            </Button>
          )}
        </div>
        {cvFile && <p className="text-xs text-muted-foreground">Selected: {cvFile.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_letter">Notes / Cover Letter</Label>
        <Textarea
          id="cover_letter"
          value={formData.cover_letter}
          onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
          placeholder="Additional information about the candidate..."
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Add to Talent Pool
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

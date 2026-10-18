"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Save, DollarSign, FileText, Upload, Check, AlertCircle } from "lucide-react"
import { APPLICATION_STATUSES } from "@/lib/types"
import type { Application } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { sendStatusUpdateEmail } from "@/lib/maileroo"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function ApplicationManagementForm({ application }: { application: Application }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [status, setStatus] = useState(application.status)
  const [visaStatus, setVisaStatus] = useState(application.visa_status || "")
  const [referenceAgent, setReferenceAgent] = useState(application.reference_agent || "")
  const [totalAgreedAmount, setTotalAgreedAmount] = useState(application.total_agreed_amount?.toString() || "")

  // Payment form
  const [paymentType, setPaymentType] = useState("incoming")
  const [paymentCategory, setPaymentCategory] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentCurrency, setPaymentCurrency] = useState("GBP")
  const [paymentDescription, setPaymentDescription] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])

  // CV upload
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Check if status changed
      const statusChanged = status !== application.status

      const { error: updateError } = await supabase
        .from("applications")
        .update({
          status,
          visa_status: visaStatus || null,
          reference_agent: referenceAgent || null,
          total_agreed_amount: totalAgreedAmount ? Number.parseFloat(totalAgreedAmount) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id)

      if (updateError) throw updateError

      // Send email notification if status changed
      if (statusChanged) {
        await sendStatusUpdateEmail(
          application.email,
          application.name,
          application.job?.title || "Position",
          status
        ).catch((err) => {
          console.error("Failed to send status update email:", err)
          // Don't fail the status update if email fails
        })
      }

      setSuccess(true)
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayment = async () => {
    if (!paymentCategory || !paymentAmount || !paymentDescription) {
      setError("Please fill in all payment fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: paymentError } = await supabase.from("application_payments").insert({
        application_id: application.id,
        payment_type: paymentType,
        category: paymentCategory,
        amount: Number.parseFloat(paymentAmount),
        currency: paymentCurrency,
        description: paymentDescription,
        payment_date: paymentDate,
      })

      if (paymentError) throw paymentError

      // Add to activity log
      await supabase.from("application_notes").insert({
        application_id: application.id,
        note_type: "payment",
        content: `${paymentType === "incoming" ? "Received" : "Paid"} ${paymentCurrency} ${paymentAmount} - ${paymentCategory}: ${paymentDescription}`,
        created_by: "Admin",
      })

      // Reset payment form
      setPaymentCategory("")
      setPaymentAmount("")
      setPaymentDescription("")
      setPaymentDate(new Date().toISOString().split("T")[0])

      setSuccess(true)
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add payment")
    } finally {
      setLoading(false)
    }
  }

  const handleCVUpload = async () => {
    if (!cvFile) {
      setError("Please select a file")
      return
    }

    if (cvFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB")
      return
    }

    setUploadProgress(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", cvFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || "Failed to upload file")
      }

      const { url: resumeUrl } = await uploadResponse.json()

      // Update application with new CV
      const { error: updateError } = await supabase
        .from("applications")
        .update({
          resume_url: resumeUrl,
          resume_filename: cvFile.name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id)

      if (updateError) throw updateError

      // Add note to activity log
      await supabase.from("application_notes").insert({
        application_id: application.id,
        note_type: "document",
        content: `CV/Resume updated: ${cvFile.name}`,
        created_by: "Admin",
      })

      setCvFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      setSuccess(true)
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("[CV_UPLOAD_ERROR]", err)
      setError(err instanceof Error ? err.message : "Failed to upload CV")
    } finally {
      setUploadProgress(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Changes saved successfully!</AlertDescription>
        </Alert>
      )}

      {/* Status & Core Fields */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="status">Application Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(APPLICATION_STATUSES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visaStatus">Visa Status</Label>
          <Input
            id="visaStatus"
            value={visaStatus}
            onChange={(e) => setVisaStatus(e.target.value)}
            placeholder="e.g., In Process, Approved"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referenceAgent">
            <DollarSign className="h-3 w-3 inline mr-1" />
            Reference / Agent
          </Label>
          <Input
            id="referenceAgent"
            value={referenceAgent}
            onChange={(e) => setReferenceAgent(e.target.value)}
            placeholder="e.g., Global Recruitment"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalAgreedAmount">
            <DollarSign className="h-3 w-3 inline mr-1" />
            Total Agreed Amount (£)
          </Label>
          <Input
            id="totalAgreedAmount"
            type="number"
            step="0.01"
            value={totalAgreedAmount}
            onChange={(e) => setTotalAgreedAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* CV Upload */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Upload/Replace CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button onClick={handleCVUpload} disabled={!cvFile || uploadProgress}>
              {uploadProgress ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload
            </Button>
          </div>
          {cvFile && <p className="text-xs text-muted-foreground">Selected: {cvFile.name}</p>}
          <p className="text-xs text-muted-foreground">Accepted: PDF, DOC, DOCX (max 10MB)</p>
        </CardContent>
      </Card>

      {/* Payment Entry */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Add Payment Record
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Payment Type</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incoming">Incoming (Received)</SelectItem>
                  <SelectItem value="outgoing">Outgoing (Paid)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={paymentCategory}
                onChange={(e) => setPaymentCategory(e.target.value)}
                placeholder="e.g., Visa Fee, Recruitment Fee"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={paymentCurrency} onValueChange={setPaymentCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="BDT">BDT (৳)</SelectItem>
                  <SelectItem value="AED">AED (د.إ)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={paymentDescription}
              onChange={(e) => setPaymentDescription(e.target.value)}
              placeholder="Describe this payment..."
              rows={2}
            />
          </div>

          <Button onClick={handleAddPayment} disabled={loading} variant="secondary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

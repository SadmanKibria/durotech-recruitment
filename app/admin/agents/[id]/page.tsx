"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, Save, Trash2, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import { use } from "react"

type Agent = {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  commission_rate: number
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

type ApplicationSummary = {
  total: number
  totalAgreed: number
  byStatus: Record<string, number>
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [applicationSummary, setApplicationSummary] = useState<ApplicationSummary>({ total: 0, totalAgreed: 0, byStatus: {} })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    commission_rate: "",
    is_active: true,
    notes: "",
  })

  useEffect(() => {
    async function fetchAgent() {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        router.push("/admin/agents")
        return
      }

      setAgent(data)
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        company: data.company || "",
        commission_rate: data.commission_rate?.toString() || "",
        is_active: data.is_active ?? true,
        notes: data.notes || "",
      })

      // Fetch application summary for this agent
      const { data: applications } = await supabase
        .from("applications")
        .select("status, total_agreed_amount")
        .eq("agent_id", id)

      if (applications) {
        const summary: ApplicationSummary = {
          total: applications.length,
          totalAgreed: applications.reduce((sum, app) => sum + (app.total_agreed_amount || 0), 0),
          byStatus: {}
        }
        applications.forEach(app => {
          summary.byStatus[app.status] = (summary.byStatus[app.status] || 0) + 1
        })
        setApplicationSummary(summary)
      }

      setLoading(false)
    }
    fetchAgent()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    if (!formData.name.trim()) {
      setError("Agent name is required")
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from("agents")
      .update({
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        commission_rate: formData.commission_rate ? Number.parseFloat(formData.commission_rate) : 0,
        is_active: formData.is_active,
        notes: formData.notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this agent? Applications will be unassigned from this agent.")) {
      return
    }

    setDeleting(true)

    // First unassign all applications from this agent
    await supabase
      .from("applications")
      .update({ agent_id: null })
      .eq("agent_id", id)

    // Then delete the agent
    const { error: deleteError } = await supabase
      .from("agents")
      .delete()
      .eq("id", id)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
    } else {
      router.push("/admin/agents")
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!agent) return null

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/agents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            <Badge variant={agent.is_active ? "default" : "secondary"}>
              {agent.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          {agent.company && (
            <p className="text-muted-foreground mt-1">{agent.company}</p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              {applicationSummary.total}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Agreed Amount</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              £{applicationSummary.totalAgreed.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Commission Due</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2 text-amber-600">
              <DollarSign className="h-5 w-5" />
              £{((applicationSummary.totalAgreed * (agent.commission_rate || 0)) / 100).toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">
              Based on {agent.commission_rate || 0}% commission rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">Changes saved successfully!</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">
                  Agent Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="agent@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+44 7123 456789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company / Agency</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., Global Recruitment Ltd"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission_rate">Commission Rate (%)</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                  placeholder="e.g., 10"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional notes about this agent..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between sm:col-span-2 p-4 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="is_active" className="font-medium">Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Inactive agents won't appear in assignment dropdowns
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Agent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Status Breakdown */}
      {applicationSummary.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(applicationSummary.byStatus).map(([status, count]) => (
                <Badge key={status} variant="outline" className="text-sm">
                  {status.replace(/_/g, " ")}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

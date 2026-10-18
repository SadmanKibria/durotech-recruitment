"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Plus,
  User,
  RefreshCw,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  UserCheck,
  Plane,
} from "lucide-react"
import { APPLICATION_STATUSES, PAYMENT_CATEGORIES, CURRENCIES } from "@/lib/types"
import type { Application, ApplicationNote, ApplicationPayment } from "@/lib/types"

interface Props {
  application: Application
}

export function ApplicantManagementForm({ application }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // State for reference/agent
  const [referenceAgent, setReferenceAgent] = useState(application.reference_agent || "")
  const [savingReference, setSavingReference] = useState(false)

  // State for status
  const [status, setStatus] = useState(application.status)
  const [savingStatus, setSavingStatus] = useState(false)

  // State for notes
  const [notes, setNotes] = useState<ApplicationNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [noteType, setNoteType] = useState("general")
  const [adminName, setAdminName] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const [fetchingNotes, setFetchingNotes] = useState(true)

  // State for payments
  const [payments, setPayments] = useState<ApplicationPayment[]>([])
  const [fetchingPayments, setFetchingPayments] = useState(true)
  const [addingPayment, setAddingPayment] = useState(false)
  const [newPayment, setNewPayment] = useState({
    payment_type: "incoming" as "incoming" | "outgoing",
    category: "",
    amount: "",
    currency: "GBP",
    description: "",
    payment_date: new Date().toISOString().split("T")[0],
  })

  const noteTypes = [
    { value: "general", label: "General Note", icon: MessageSquare, color: "bg-slate-100 text-slate-700" },
    { value: "interview", label: "Interview", icon: Phone, color: "bg-blue-50 text-blue-700" },
    { value: "document", label: "Document", icon: FileText, color: "bg-purple-50 text-purple-700" },
    { value: "communication", label: "Communication", icon: Mail, color: "bg-green-50 text-green-700" },
    { value: "status_change", label: "Status Change", icon: RefreshCw, color: "bg-amber-50 text-amber-700" },
    { value: "warning", label: "Warning", icon: AlertTriangle, color: "bg-red-50 text-red-700" },
    { value: "milestone", label: "Milestone", icon: CheckCircle, color: "bg-emerald-50 text-emerald-700" },
    { value: "visa_update", label: "Visa Update", icon: Plane, color: "bg-cyan-50 text-cyan-700" },
    { value: "payment", label: "Payment", icon: DollarSign, color: "bg-yellow-50 text-yellow-700" },
  ]

  // Fetch notes
  const fetchNotes = async () => {
    setFetchingNotes(true)
    const { data } = await supabase
      .from("application_notes")
      .select("*")
      .eq("application_id", application.id)
      .order("created_at", { ascending: false })
    if (data) setNotes(data)
    setFetchingNotes(false)
  }

  // Fetch payments
  const fetchPayments = async () => {
    setFetchingPayments(true)
    const { data } = await supabase
      .from("application_payments")
      .select("*")
      .eq("application_id", application.id)
      .order("payment_date", { ascending: false })
    if (data) setPayments(data)
    setFetchingPayments(false)
  }

  useEffect(() => {
    fetchNotes()
    fetchPayments()
  }, [application.id])

  // Save reference/agent
  const handleSaveReference = async () => {
    setSavingReference(true)
    const { error } = await supabase
      .from("applications")
      .update({ reference_agent: referenceAgent.trim(), updated_at: new Date().toISOString() })
      .eq("id", application.id)

    if (!error && adminName.trim()) {
      await supabase.from("application_notes").insert({
        application_id: application.id,
        note_type: "general",
        content: `Reference/Agent updated to: ${referenceAgent.trim() || "(cleared)"}`,
        created_by: adminName.trim() || "Admin",
      })
      fetchNotes()
    }
    setSavingReference(false)
    router.refresh()
  }

  // Save status
  const handleSaveStatus = async () => {
    if (status === application.status) return
    setSavingStatus(true)

    const { error } = await supabase
      .from("applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", application.id)

    if (!error) {
      await supabase.from("application_notes").insert({
        application_id: application.id,
        note_type: "status_change",
        content: `Status changed from "${APPLICATION_STATUSES[application.status]}" to "${APPLICATION_STATUSES[status]}"`,
        created_by: adminName.trim() || "Admin",
      })
      fetchNotes()
    }
    setSavingStatus(false)
    router.refresh()
  }

  // Add note
  const handleAddNote = async () => {
    if (!newNote.trim() || !adminName.trim()) return
    setAddingNote(true)

    const { error } = await supabase.from("application_notes").insert({
      application_id: application.id,
      note_type: noteType,
      content: newNote.trim(),
      created_by: adminName.trim(),
    })

    if (!error) {
      setNewNote("")
      fetchNotes()
    }
    setAddingNote(false)
  }

  // Add payment
  const handleAddPayment = async () => {
    if (!newPayment.category || !newPayment.amount || !adminName.trim()) return
    setAddingPayment(true)

    const { error } = await supabase.from("application_payments").insert({
      application_id: application.id,
      payment_type: newPayment.payment_type,
      category: newPayment.category,
      amount: Number.parseFloat(newPayment.amount),
      currency: newPayment.currency,
      description: newPayment.description.trim() || null,
      payment_date: newPayment.payment_date,
    })

    if (!error) {
      // Also log as a note
      await supabase.from("application_notes").insert({
        application_id: application.id,
        note_type: "payment",
        content: `${newPayment.payment_type === "incoming" ? "Received" : "Paid"} ${newPayment.currency} ${newPayment.amount} for ${newPayment.category}${newPayment.description ? ` - ${newPayment.description}` : ""}`,
        created_by: adminName.trim(),
      })

      setNewPayment({
        payment_type: "incoming",
        category: "",
        amount: "",
        currency: "GBP",
        description: "",
        payment_date: new Date().toISOString().split("T")[0],
      })
      fetchPayments()
      fetchNotes()
    }
    setAddingPayment(false)
  }

  // Delete payment
  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm("Are you sure you want to delete this payment record?")) return
    await supabase.from("application_payments").delete().eq("id", paymentId)
    fetchPayments()
  }

  const getNoteConfig = (type: string) => noteTypes.find((n) => n.value === type) || noteTypes[0]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const totalIncoming = payments.filter((p) => p.payment_type === "incoming").reduce((sum, p) => sum + p.amount, 0)
  const totalOutgoing = payments.filter((p) => p.payment_type === "outgoing").reduce((sum, p) => sum + p.amount, 0)

  const getStatusColor = (s: string) => {
    const colors: Record<string, string> = {
      applied: "bg-blue-50 text-blue-700 border-blue-200",
      offer_issued: "bg-amber-50 text-amber-700 border-amber-200",
      visa_applied: "bg-purple-50 text-purple-700 border-purple-200",
      visa_approved: "bg-green-50 text-green-700 border-green-200",
      at_embassy: "bg-cyan-50 text-cyan-700 border-cyan-200",
      visa_stamped: "bg-emerald-50 text-emerald-700 border-emerald-200",
      arrived: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-50 text-red-700 border-red-200",
    }
    return colors[s] || "bg-slate-50 text-slate-700"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Applicant Management
        </CardTitle>
        <CardDescription>Manage status, reference, notes, and payments for this applicant</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Admin Name - Required for all actions */}
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border-2 border-dashed border-primary/30">
          <Label htmlFor="adminName" className="text-sm font-semibold">
            Your Name (Required for all actions) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="adminName"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder="Enter your name before making changes"
            className="mt-2"
          />
        </div>

        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
          </TabsList>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label>Application Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Application["status"])}>
                <SelectTrigger className={getStatusColor(status)}>
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
              <Button
                onClick={handleSaveStatus}
                disabled={savingStatus || status === application.status || !adminName.trim()}
                className="w-full"
              >
                {savingStatus ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Status
              </Button>
              {!adminName.trim() && (
                <p className="text-xs text-amber-600">Please enter your name above to update status</p>
              )}
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Note type" />
                  </SelectTrigger>
                  <SelectContent>
                    {noteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter note content..."
                rows={3}
              />
              <Button
                onClick={handleAddNote}
                disabled={addingNote || !newNote.trim() || !adminName.trim()}
                className="w-full"
              >
                {addingNote ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Note
              </Button>
            </div>

            {/* Notes Timeline */}
            <div className="max-h-[400px] overflow-y-auto space-y-3 mt-4">
              {fetchingNotes ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : notes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No notes yet</p>
              ) : (
                notes.map((note) => {
                  const config = getNoteConfig(note.note_type)
                  const { date, time } = formatDate(note.created_at)
                  return (
                    <div key={note.id} className="p-3 border rounded-lg bg-card">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${config.color}`}>
                          <config.icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {date} {time}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {note.created_by}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4 mt-4">
            {/* Payment Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <ArrowDownLeft className="h-4 w-4" />
                  <span className="text-xs font-medium">Total Received</span>
                </div>
                <p className="text-lg font-bold text-green-800 mt-1">£{totalIncoming.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-xs font-medium">Total Paid Out</span>
                </div>
                <p className="text-lg font-bold text-red-800 mt-1">£{totalOutgoing.toFixed(2)}</p>
              </div>
            </div>

            {/* Add Payment Form */}
            <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
              <Label className="text-sm font-semibold">Add Payment Record</Label>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={newPayment.payment_type}
                  onValueChange={(v) => setNewPayment({ ...newPayment, payment_type: v as "incoming" | "outgoing" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incoming">Incoming (Received)</SelectItem>
                    <SelectItem value="outgoing">Outgoing (Paid)</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newPayment.category}
                  onValueChange={(v) => setNewPayment({ ...newPayment, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAYMENT_CATEGORIES).map(([key, label]) => (
                      <SelectItem key={key} value={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                />
                <Select
                  value={newPayment.currency}
                  onValueChange={(v) => setNewPayment({ ...newPayment, currency: v })}
                >
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
                <Input
                  type="date"
                  value={newPayment.payment_date}
                  onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
                />
              </div>
              <Input
                placeholder="Description (optional)"
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
              />
              <Button
                onClick={handleAddPayment}
                disabled={addingPayment || !newPayment.category || !newPayment.amount || !adminName.trim()}
                className="w-full"
              >
                {addingPayment ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Payment
              </Button>
            </div>

            {/* Payments List */}
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {fetchingPayments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : payments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No payments recorded</p>
              ) : (
                payments.map((payment) => (
                  <div
                    key={payment.id}
                    className={`p-3 border rounded-lg flex items-center justify-between ${
                      payment.payment_type === "incoming"
                        ? "bg-green-50/50 border-green-200"
                        : "bg-red-50/50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {payment.payment_type === "incoming" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{payment.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.payment_date).toLocaleDateString("en-GB")}
                          {payment.description && ` - ${payment.description}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${payment.payment_type === "incoming" ? "text-green-700" : "text-red-700"}`}
                      >
                        {payment.currency} {payment.amount.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Reference Tab */}
          <TabsContent value="reference" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label htmlFor="reference">Reference / Agent</Label>
              <Input
                id="reference"
                value={referenceAgent}
                onChange={(e) => setReferenceAgent(e.target.value)}
                placeholder="Enter referrer or agent name"
              />
              <p className="text-xs text-muted-foreground">
                Record who referred this applicant or the recruitment agent involved
              </p>
              <Button onClick={handleSaveReference} disabled={savingReference || !adminName.trim()} className="w-full">
                {savingReference ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Reference
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

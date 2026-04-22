"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Loader2,
  Plus,
  MessageSquare,
  RefreshCw,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Phone,
  Mail,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { Application } from "@/lib/types"

type PaymentRecord = {
  id: string
  application_id: string
  payment_type: string
  category: string
  amount: number
  currency: string
  description: string
  payment_date: string
  created_at: string
}

type ActivityItem = {
  id: string
  type: "note" | "payment"
  created_at: string
  note_type?: string
  content?: string
  created_by?: string
  payment_type?: string
  category?: string
  amount?: number
  currency?: string
  description?: string
  payment_date?: string
}

export function ApplicationNotes({ application }: { application: Application }) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [newNote, setNewNote] = useState("")
  const [noteType, setNoteType] = useState("general")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Auto-detect admin user
  useEffect(() => {
    async function getAdminUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setAdminEmail(user.email)
      }
    }
    getAdminUser()
  }, [])

  const noteTypes = [
    {
      value: "general",
      label: "General Note",
      icon: MessageSquare,
      color: "bg-slate-100 text-slate-700 border-slate-300",
    },
    { value: "interview", label: "Interview Update", icon: Phone, color: "bg-blue-50 text-blue-700 border-blue-200" },
    {
      value: "document",
      label: "Document Update",
      icon: FileText,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      value: "communication",
      label: "Communication Log",
      icon: Mail,
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      value: "status_change",
      label: "Status Change",
      icon: RefreshCw,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    { value: "warning", label: "Warning/Issue", icon: AlertTriangle, color: "bg-red-50 text-red-700 border-red-200" },
    {
      value: "milestone",
      label: "Milestone Achieved",
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      value: "payment",
      label: "Payment Record",
      icon: DollarSign,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ]

  const fetchActivities = async () => {
    setFetching(true)

    const [notesResult, paymentsResult] = await Promise.all([
      supabase
        .from("application_notes")
        .select("*")
        .eq("application_id", application.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("application_payments")
        .select("*")
        .eq("application_id", application.id)
        .order("created_at", { ascending: false }),
    ])

    // Combine and sort by created_at
    const combined: ActivityItem[] = [
      ...(notesResult.data || []).map((note) => ({ ...note, type: "note" as const })),
      ...(paymentsResult.data || []).map((payment) => ({ ...payment, type: "payment" as const })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setActivities(combined)
    setFetching(false)
  }

  useEffect(() => {
    fetchActivities()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchActivities()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [application.id])

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setLoading(true)
    const { error } = await supabase.from("application_notes").insert({
      application_id: application.id,
      note_type: noteType,
      content: newNote.trim(),
      created_by: adminEmail || "Admin",
    })

    if (!error) {
      setNewNote("")
      fetchActivities()
      router.refresh()
    }
    setLoading(false)
  }

  const getNoteConfig = (type: string) => {
    return noteTypes.find((n) => n.value === type) || noteTypes[0]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      GBP: "£",
      USD: "$",
      EUR: "€",
      BDT: "৳",
      AED: "د.إ",
      SAR: "﷼",
      PLN: "zł",
    }
    return symbols[currency] || currency
  }

  return (
    <div className="space-y-6">
      {/* Add New Note Form */}
      <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="noteType">Note Type</Label>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="bg-background max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {noteTypes
                  .filter((t) => t.value !== "payment")
                  .map((type) => (
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

          <div className="space-y-2">
            <Label htmlFor="noteContent">
              Note Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="noteContent"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter detailed notes about this applicant. Be specific and include dates, names, and outcomes where relevant..."
              rows={4}
              className="resize-none bg-background"
            />
          </div>

          <Button
            onClick={handleAddNote}
            disabled={loading || !newNote.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Note to Activity Log
          </Button>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Activity Log ({activities.length} entries)
          </h4>
          <Button variant="ghost" size="sm" onClick={fetchActivities} disabled={fetching}>
            <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-8">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground">Add notes or payment records to track this application</p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {activities.map((activity, index) => {
                if (activity.type === "payment") {
                  const isIncoming = activity.payment_type === "incoming"
                  const IconComponent = isIncoming ? TrendingUp : TrendingDown
                  const color = isIncoming
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                  const { date, time } = formatDate(activity.created_at)
                  const paymentDateFormatted = activity.payment_date
                    ? new Date(activity.payment_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : null

                  return (
                    <div key={activity.id} className="relative pl-12">
                      <div
                        className={`absolute left-0 top-2 w-10 h-10 rounded-full flex items-center justify-center ${color} border-2 bg-background`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>

                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs ${color}`}>
                                <DollarSign className="h-3 w-3 mr-1" />
                                {isIncoming ? "Payment Received" : "Payment Made"}
                              </Badge>
                              {index === 0 && <Badge className="text-xs bg-primary">Latest</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span className="font-medium">{date}</span>
                              <span>at</span>
                              <span>{time}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold">
                                {getCurrencySymbol(activity.currency || "")}
                                {activity.amount?.toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground">{activity.currency}</span>
                            </div>
                            <p className="text-sm font-medium">{activity.category}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            {paymentDateFormatted && (
                              <p className="text-xs text-muted-foreground">Payment date: {paymentDateFormatted}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                }

                // Render note
                const config = getNoteConfig(activity.note_type || "general")
                const IconComponent = config.icon
                const { date, time } = formatDate(activity.created_at)

                return (
                  <div key={activity.id} className="relative pl-12">
                    <div
                      className={`absolute left-0 top-2 w-10 h-10 rounded-full flex items-center justify-center ${config.color} border-2 bg-background`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${config.color}`}>
                              {config.label}
                            </Badge>
                            {index === 0 && <Badge className="text-xs bg-primary">Latest</Badge>}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="font-medium">{date}</span>
                            <span>at</span>
                            <span>{time}</span>
                          </div>
                        </div>

                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{activity.content}</p>

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Added by: <span className="text-foreground">{activity.created_by}</span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

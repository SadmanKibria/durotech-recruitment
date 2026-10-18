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
} from "lucide-react"
import type { Application, ApplicationNote } from "@/lib/types"

export function ApplicationNotes({ application }: { application: Application }) {
  const [notes, setNotes] = useState<ApplicationNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [noteType, setNoteType] = useState("general")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [adminName, setAdminName] = useState("")
  const router = useRouter()
  const supabase = createClient()

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
  ]

  const fetchNotes = async () => {
    setFetching(true)
    const { data } = await supabase
      .from("application_notes")
      .select("*")
      .eq("application_id", application.id)
      .order("created_at", { ascending: false })

    if (data) setNotes(data)
    setFetching(false)
  }

  useEffect(() => {
    fetchNotes()
  }, [application.id])

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    if (!adminName.trim()) {
      alert("Please enter your name before adding a note")
      return
    }

    setLoading(true)
    const { error } = await supabase.from("application_notes").insert({
      application_id: application.id,
      note_type: noteType,
      content: newNote.trim(),
      created_by: adminName.trim(),
    })

    if (!error) {
      setNewNote("")
      fetchNotes()
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
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter your name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noteType">Note Type</Label>
              <Select value={noteType} onValueChange={setNoteType}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
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
            disabled={loading || !newNote.trim() || !adminName.trim()}
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
            Activity Log ({notes.length} entries)
          </h4>
          <Button variant="ghost" size="sm" onClick={fetchNotes} disabled={fetching}>
            <RefreshCw className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-8">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No activity notes yet</p>
              <p className="text-xs text-muted-foreground">
                Add the first note to start tracking this applicant's progress
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {notes.map((note, index) => {
                const config = getNoteConfig(note.note_type)
                const IconComponent = config.icon
                const { date, time } = formatDate(note.created_at)

                return (
                  <div key={note.id} className="relative pl-12">
                    {/* Timeline dot */}
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

                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>

                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Added by: <span className="text-foreground">{note.created_by}</span>
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

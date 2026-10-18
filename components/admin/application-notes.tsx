"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, MessageSquare, AlertCircle, RefreshCw, User } from "lucide-react"
import type { Application, ApplicationNote } from "@/lib/types"

export function ApplicationNotes({ application }: { application: Application }) {
  const [notes, setNotes] = useState<ApplicationNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const router = useRouter()
  const supabase = createClient()

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

    setLoading(true)
    const { error } = await supabase.from("application_notes").insert({
      application_id: application.id,
      note_type: "manual",
      content: newNote.trim(),
      created_by: "Admin",
    })

    if (!error) {
      setNewNote("")
      fetchNotes()
      router.refresh()
    }
    setLoading(false)
  }

  const getNoteIcon = (type: string) => {
    switch (type) {
      case "status_change":
        return <RefreshCw className="h-3 w-3" />
      case "system":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <MessageSquare className="h-3 w-3" />
    }
  }

  const getNoteColor = (type: string) => {
    switch (type) {
      case "status_change":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "system":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-4">
      {/* Add new note */}
      <div className="space-y-2">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this applicant..."
          rows={3}
          className="resize-none"
        />
        <Button onClick={handleAddNote} disabled={loading || !newNote.trim()} size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          Add Note
        </Button>
      </div>

      {/* Notes timeline */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Activity Log ({notes.length})
        </h4>

        {fetching ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-lg p-3 bg-card">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className={`text-xs ${getNoteColor(note.note_type)}`}>
                    {getNoteIcon(note.note_type)}
                    <span className="ml-1 capitalize">{note.note_type.replace("_", " ")}</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {note.created_by}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

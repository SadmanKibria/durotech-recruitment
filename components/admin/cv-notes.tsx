"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

interface CVNotesProps {
  cvId: string
  initialNotes: string
}

export function CVNotes({ cvId, initialNotes }: CVNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setIsSaving(true)
    setSaved(false)

    const { error } = await supabase
      .from("speculative_cvs")
      .update({ admin_notes: notes, updated_at: new Date().toISOString() })
      .eq("id", cvId)

    setIsSaving(false)

    if (!error) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this candidate..."
        rows={4}
      />
      <div className="flex items-center gap-2">
        <Button onClick={handleSave} disabled={isSaving} size="sm">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Notes
        </Button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </div>
  )
}

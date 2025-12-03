"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Application } from "@/lib/types"

export function ApplicationNotes({ application }: { application: Application }) {
  const [notes, setNotes] = useState(application.admin_notes || "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from("applications")
      .update({ admin_notes: notes, updated_at: new Date().toISOString() })
      .eq("id", application.id)

    if (!error) {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add private notes about this applicant..."
        rows={4}
      />
      <Button onClick={handleSave} disabled={loading} size="sm">
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Save Notes
      </Button>
    </div>
  )
}

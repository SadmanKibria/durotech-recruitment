"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"
import type { Application } from "@/lib/types"

export function ApplicationReferenceAgent({ application }: { application: Application }) {
  const [value, setValue] = useState(application.reference_agent || "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from("applications")
      .update({ reference_agent: value || null, updated_at: new Date().toISOString() })
      .eq("id", application.id)

    if (!error && value !== application.reference_agent) {
      await supabase.from("application_notes").insert({
        application_id: application.id,
        note_type: "update",
        content: `Reference/Agent updated to: ${value || "(cleared)"}`,
        created_by: "Admin",
      })
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex gap-3">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter reference or agent name..."
        className="flex-1"
      />
      <Button onClick={handleSave} disabled={loading || value === (application.reference_agent || "")}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save
          </>
        )}
      </Button>
    </div>
  )
}

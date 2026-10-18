"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { APPLICATION_STATUSES } from "@/lib/types"
import type { Application } from "@/lib/types"

export function ApplicationStatusSelect({ application }: { application: Application }) {
  const [status, setStatus] = useState(application.status)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async () => {
    if (status === application.status) return

    setLoading(true)

    const { error } = await supabase
      .from("applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", application.id)

    if (!error) {
      // Log the status change
      await supabase.from("application_notes").insert({
        application_id: application.id,
        note_type: "status_change",
        content: `Status changed from "${APPLICATION_STATUSES[application.status as keyof typeof APPLICATION_STATUSES]}" to "${APPLICATION_STATUSES[status as keyof typeof APPLICATION_STATUSES]}"`,
        created_by: "Admin",
      })
      router.refresh()
    }
    setLoading(false)
  }

  const getStatusColor = (s: string) => {
    const colors: Record<string, string> = {
      applied: "bg-blue-50 border-blue-200",
      offer_issued: "bg-amber-50 border-amber-200",
      visa_applied: "bg-purple-50 border-purple-200",
      visa_approved: "bg-green-50 border-green-200",
      at_embassy: "bg-cyan-50 border-cyan-200",
      visa_stamped: "bg-emerald-50 border-emerald-200",
      arrived: "bg-green-100 border-green-300",
      rejected: "bg-red-50 border-red-200",
    }
    return colors[s] || ""
  }

  return (
    <div className="flex gap-3">
      <Select value={status} onValueChange={(v) => setStatus(v as Application["status"])}>
        <SelectTrigger className={`flex-1 ${getStatusColor(status)}`}>
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
      <Button onClick={handleUpdate} disabled={loading || status === application.status}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
      </Button>
    </div>
  )
}

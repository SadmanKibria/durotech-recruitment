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
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex gap-3">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="flex-1">
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

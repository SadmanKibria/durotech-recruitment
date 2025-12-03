"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CV_STATUSES } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface CVStatusSelectProps {
  cvId: string
  currentStatus: string
}

export function CVStatusSelect({ cvId, currentStatus }: CVStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    setStatus(newStatus)

    const { error } = await supabase
      .from("speculative_cvs")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", cvId)

    setIsUpdating(false)

    if (!error) {
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(CV_STATUSES).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  )
}

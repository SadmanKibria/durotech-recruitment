"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Job } from "@/lib/types"

export function JobStatusToggle({ job }: { job: Job }) {
  const [isActive, setIsActive] = useState(job.is_active)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleToggle = async () => {
    setLoading(true)
    const newStatus = !isActive

    const { error } = await supabase
      .from("jobs")
      .update({ is_active: newStatus, updated_at: new Date().toISOString() })
      .eq("id", job.id)

    if (!error) {
      setIsActive(newStatus)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Switch id={`status-${job.id}`} checked={isActive} onCheckedChange={handleToggle} disabled={loading} />
      <Label htmlFor={`status-${job.id}`} className="text-sm">
        {isActive ? "Active" : "Inactive"}
      </Label>
    </div>
  )
}

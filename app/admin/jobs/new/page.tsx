import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JobForm } from "@/components/admin/job-form"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function NewJobPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Post New Job</h1>
        <p className="text-muted-foreground">Create a new job listing</p>
      </div>
      <JobForm />
    </div>
  )
}

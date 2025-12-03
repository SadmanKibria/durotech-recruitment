import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { JobForm } from "@/components/admin/job-form"

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).single()

  if (!job) {
    notFound()
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Job</h1>
        <p className="text-muted-foreground">Update job listing details</p>
      </div>
      <JobForm job={job} />
    </div>
  )
}

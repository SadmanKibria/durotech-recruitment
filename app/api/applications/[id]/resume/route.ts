import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStoredResumePath, RESUME_BUCKET } from "@/lib/resume-storage"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()

  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const admin = createAdminClient()
  const { data: application } = await admin
    .from("applications")
    .select("resume_url")
    .eq("id", id)
    .single()

  if (!application?.resume_url) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 })
  }

  const path = getStoredResumePath(application.resume_url)
  if (!path) {
    return NextResponse.redirect(application.resume_url)
  }

  const { data, error } = await admin.storage.from(RESUME_BUCKET).createSignedUrl(path, 60)
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Unable to open CV" }, { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}

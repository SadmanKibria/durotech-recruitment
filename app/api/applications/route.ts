import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendApplicationConfirmation, sendAdminNotification } from "@/lib/maileroo"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const jobId = formData.get("jobId") as string
    const jobTitle = formData.get("jobTitle") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const rightToWork = formData.get("rightToWork") as string
    const coverLetter = formData.get("coverLetter") as string | null
    const resume = formData.get("resume") as File
    const visaRequired = (formData.get("visaRequired") as string) || "No"
    const citizenshipCountry = formData.get("citizenshipCountry") as string
    const accommodationRequired = (formData.get("accommodationRequired") as string) || "No"
    const foodRequired = (formData.get("foodRequired") as string) || "No"

    if (!jobId || !name || !email || !phone || !rightToWork || !resume) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024
    if (resume.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    let resumeUrl = ""
    let resumeFilename = ""

    try {
      const blob = await put(`resumes/${Date.now()}-${resume.name}`, resume, { access: "public" })
      resumeUrl = blob.url
      resumeFilename = resume.name
    } catch (uploadError) {
      console.error("Blob upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 })
    }

    const supabase = createAdminClient()

    const { data: existingApplications } = await supabase
      .from("applications")
      .select("id, job_id")
      .eq("email", email.toLowerCase().trim())

    const isDuplicate = existingApplications && existingApplications.length > 0
    const duplicateIds = existingApplications?.map((app) => app.id) || []

    const { data: application, error: dbError } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        name,
        email: email.toLowerCase().trim(),
        phone,
        right_to_work: rightToWork,
        visa_required: visaRequired,
        citizenship_country: citizenshipCountry,
        accommodation_required: accommodationRequired,
        food_required: foodRequired,
        resume_url: resumeUrl,
        resume_filename: resumeFilename,
        cover_letter: coverLetter || null,
        status: "applied",
        is_duplicate: isDuplicate,
        duplicate_application_ids: isDuplicate ? duplicateIds : null,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save application" }, { status: 500 })
    }

    if (isDuplicate) {
      await supabase.from("application_notes").insert({
        application_id: application.id,
        note_type: "system",
        content: `Duplicate applicant detected. This email has ${duplicateIds.length} other application(s).`,
        created_by: "System",
      })
    }

    sendApplicationConfirmation(email, name, jobTitle).catch(console.error)
    sendAdminNotification(name, email, jobTitle, application.id).catch(console.error)

    return NextResponse.json({ success: true, applicationId: application.id })
  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

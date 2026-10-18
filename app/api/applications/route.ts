import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
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

    // Validate required fields
    if (!jobId || !name || !email || !phone || !rightToWork || !resume) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload resume to Vercel Blob
    const blob = await put(`resumes/${Date.now()}-${resume.name}`, resume, {
      access: "public",
    })

    // Save application to database
    const supabase = await createClient()

    const { data: application, error: dbError } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        name,
        email,
        phone,
        right_to_work: rightToWork,
        resume_url: blob.url,
        resume_filename: resume.name,
        cover_letter: coverLetter || null,
        status: "new",
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save application" }, { status: 500 })
    }

    // Send confirmation email to applicant
    try {
      await sendApplicationConfirmation(email, name, jobTitle)
    } catch (emailError) {
      console.error("Failed to send applicant confirmation:", emailError)
    }

    // Send notification email to admin
    try {
      await sendAdminNotification(name, email, jobTitle, application.id)
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError)
    }

    return NextResponse.json({ success: true, applicationId: application.id })
  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

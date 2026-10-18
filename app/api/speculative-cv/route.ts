import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sanitizeInput, isValidEmail, isValidPhone } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      preferred_region,
      preferred_industry,
      right_to_work,
      resume_url,
      resume_filename,
      cover_letter,
    } = body

    // Server-side validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !right_to_work || !resume_url) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Please provide a valid phone number" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase.from("speculative_cvs").insert({
      name: sanitizeInput(name),
      email: sanitizeInput(email.toLowerCase()),
      phone: sanitizeInput(phone),
      preferred_region: preferred_region && preferred_region !== "any" ? preferred_region : null,
      preferred_industry: preferred_industry && preferred_industry !== "any" ? preferred_industry : null,
      right_to_work,
      resume_url,
      resume_filename: sanitizeInput(resume_filename),
      cover_letter: cover_letter ? sanitizeInput(cover_letter) : null,
      status: "new",
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to submit CV. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}

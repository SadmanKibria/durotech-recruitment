import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendCustomEmail } from "@/lib/maileroo"

export async function POST(request: NextRequest) {
  try {
    // Verify admin is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, subject, message } = await request.json() as { to?: string; subject?: string; message?: string }

    if (!to?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (subject.length > 160 || message.length > 10000) {
      return NextResponse.json({ error: "Email content is too long" }, { status: 400 })
    }

    const result = await sendCustomEmail(to, subject.trim(), message.trim())

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 502 })
    }
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

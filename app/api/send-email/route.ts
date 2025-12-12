import { type NextRequest, NextResponse } from "next/server"

interface MailerooResponse {
  success: boolean
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, from } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = process.env.MAILEROO_API_KEY
    const fromEmail = process.env.FROM_EMAIL || "noreply@durotech.co.uk"

    if (!apiKey) {
      console.error("MAILEROO_API_KEY not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const response = await fetch("https://smtp.maileroo.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        from: from || fromEmail,
        to,
        subject,
        html,
      }),
    })

    const result = (await response.json()) as MailerooResponse

    if (!response.ok) {
      console.error("Maileroo error:", result)
      return NextResponse.json({ error: result.message || "Failed to send email" }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

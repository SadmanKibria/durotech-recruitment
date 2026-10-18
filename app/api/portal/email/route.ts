import { NextResponse } from "next/server"
import { getPortalSession } from "@/lib/portal/backend"
import { sendCustomEmail } from "@/lib/maileroo"

export async function POST(request: Request) {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json().catch(() => ({})) as { to?: string; cc?: string; subject?: string; message?: string }
  const to = String(body.to ?? "").trim().toLowerCase()
  const subject = String(body.subject ?? "").trim()
  const message = String(body.message ?? "").trim()
  const cc = String(body.cc ?? "").split(/[,;]/).map(value => value.trim().toLowerCase()).filter(Boolean)
  if (!to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !subject || !message) return NextResponse.json({ error: "Enter a valid recipient, subject and message." }, { status: 400 })
  if (cc.length > 5 || cc.some(address => !address.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))) return NextResponse.json({ error: "Enter up to five valid CC email addresses." }, { status: 400 })
  if (subject.length > 160 || message.length > 10000) return NextResponse.json({ error: "Email content is too long." }, { status: 400 })
  const result = await sendCustomEmail(to, subject, message, cc)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 502 })
  return NextResponse.json({ success: true, sentBy: session.currentUser })
}

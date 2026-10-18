import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string }
  const email = String(body.email ?? "").trim().toLowerCase()
  const password = String(body.password ?? "")
  if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 })

  const { data: staff } = await createAdminClient().from("portal_staff").select("email").eq("email", email).maybeSingle()
  if (!staff) return NextResponse.json({ error: "This email is not authorised for the Durotech portal." }, { status: 403 })

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return NextResponse.json({ error: "Incorrect email address or password." }, { status: 401 })
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "private, no-store" } })
}

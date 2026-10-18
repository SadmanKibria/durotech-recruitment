import { NextResponse } from "next/server"
import { copyPortalCookies, getPortalSession, portalBackendFetch } from "@/lib/portal/backend"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

const allowedRegions = new Set(["europe", "middle_east", "asia"])
const allowedIndustries = new Set(["construction", "food_production", "health", "engineering", "warehousing", "garments"])
const allowedEmploymentTypes = new Set(["full_time", "part_time", "contract", "temporary"])

function text(value: unknown, max = 5000) {
  return String(value ?? "").trim().slice(0, max)
}

function mapJob(job: Record<string, unknown>) {
  return {
    id: String(job.id), title: String(job.title), description: String(job.description), location: String(job.location), country: String(job.country),
    region: job.region, industry: job.industry, employmentType: job.employment_type, salaryRange: String(job.salary_range ?? ""), currency: String(job.currency ?? "GBP"),
    positionsAvailable: Number(job.positions_available ?? 1), companyName: String(job.company_name ?? ""), requirements: String(job.requirements ?? ""), benefits: String(job.benefits ?? ""),
    active: Boolean(job.is_active), createdAt: String(job.created_at), updatedAt: String(job.updated_at),
  }
}

export async function GET() {
  const upstream = await portalBackendFetch("/api/data")
  const responseText = await upstream.text()
  if (!upstream.ok) {
    const response = new NextResponse(responseText, { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "application/json", "cache-control": "private, no-store" } })
    return copyPortalCookies(upstream, response)
  }
  const portal = JSON.parse(responseText) as Record<string, unknown>
  let jobs: Record<string, unknown>[] = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const result = await createAdminClient().from("jobs").select("*").order("created_at", { ascending: false })
    if (result.error) return NextResponse.json({ error: "Job listings could not be loaded." }, { status: 500 })
    jobs = (result.data ?? []) as Record<string, unknown>[]
  }
  const response = NextResponse.json({ ...portal, jobs: jobs.map(job => mapJob(job)) }, { headers: { "cache-control": "private, no-store" } })
  return copyPortalCookies(upstream, response)
}

export async function POST(request: Request) {
  const raw = await request.text()
  let body: Record<string, unknown>
  try { body = JSON.parse(raw) as Record<string, unknown> } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }) }
  const action = text(body.action, 40)
  if (!action.endsWith("_job")) {
    const upstream = await portalBackendFetch("/api/data", { method: "POST", body: raw, headers: { "content-type": "application/json" } })
    const response = new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "application/json", "cache-control": "private, no-store" } })
    return copyPortalCookies(upstream, response)
  }

  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 })
  const db = createAdminClient()
  const id = text(body.id, 80)

  if (action === "toggle_job") {
    if (!id) return NextResponse.json({ error: "Choose a valid job." }, { status: 400 })
    const { error } = await db.from("jobs").update({ is_active: Boolean(body.active), updated_at: new Date().toISOString() }).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  if (action === "delete_job") {
    if (session.role !== "admin") return NextResponse.json({ error: "Only an administrator can delete jobs." }, { status: 403 })
    if (!id) return NextResponse.json({ error: "Choose a valid job." }, { status: 400 })
    const { error } = await db.from("jobs").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  if (action === "save_job") {
    const title = text(body.title, 140), description = text(body.description, 12000), location = text(body.location, 120), country = text(body.country, 100)
    const region = text(body.region, 30), industry = text(body.industry, 40), employmentType = text(body.employmentType, 30)
    if (!title || !description || !location || !country || !allowedRegions.has(region) || !allowedIndustries.has(industry) || !allowedEmploymentTypes.has(employmentType)) return NextResponse.json({ error: "Complete all required job details." }, { status: 400 })
    const values = {
      title, description, location, country, region, industry, employment_type: employmentType,
      salary_range: text(body.salaryRange, 120) || null, currency: text(body.currency, 10) || "GBP",
      positions_available: Math.max(1, Math.min(10000, Number(body.positionsAvailable) || 1)), company_name: text(body.companyName, 160) || null,
      requirements: text(body.requirements, 8000) || null, benefits: text(body.benefits, 8000) || null, is_active: body.active !== false && body.active !== "false",
      updated_at: new Date().toISOString(),
    }
    const result = id ? await db.from("jobs").update(values).eq("id", id) : await db.from("jobs").insert(values)
    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "Unknown job action." }, { status: 400 })
}

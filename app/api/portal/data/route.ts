import { NextResponse } from "next/server"
import { getPortalSession, type PortalSession } from "@/lib/portal/backend"
import { createAdminClient } from "@/lib/supabase/admin"
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/portal/types"

export const dynamic = "force-dynamic"

const allowedRegions = new Set(["europe", "middle_east", "asia"])
const allowedIndustries = new Set(["construction", "food_production", "health", "engineering", "warehousing", "garments"])
const allowedEmploymentTypes = new Set(["full_time", "part_time", "contract", "temporary"])

type CandidateRow = { id:number; reference:string; name:string; phone:string; email:string; passport_number:string; nationality:string; destination_country:string; job_title:string; status:ApplicationStatus; visa_required:boolean; accommodation:boolean; food:boolean; arrival_date:string|null; agent_id:number|null; employer_id:number|null; agreed_amount:number; notes:string; created_at:string; updated_at:string; agent:{name:string}|null; employer:{name:string}|null }
type AgentRow = { id:number; name:string; country:string; contact_name:string; phone:string; email:string; commission_pct:number; active:boolean }
type EmployerRow = { id:number; name:string; country:string; contact_name:string; phone:string; email:string; active:boolean }
type TransactionRow = { id:number; candidate_id:number; direction:"incoming"|"outgoing"; category:string; amount:number; paid_at:string; note:string; created_at:string; candidate:{name:string;reference:string}|null }
type ActivityRow = { id:number; user_email:string; user_name:string; action:string; entity_type:string; entity_id:string; details:string; created_at:string }
type StaffRow = { id:string; email:string; name:string; role:"admin"|"secretary"; created_at:string }

function text(value: unknown, max = 5000) { return String(value ?? "").trim().slice(0, max) }
function numericId(value: unknown) { const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? parsed : null }
function pence(value: unknown) { const amount = Number(value); if (!Number.isFinite(amount) || amount < 0) throw new Error("INVALID_AMOUNT"); return Math.round(amount * 100) }
function error(message: string, status = 400) { return NextResponse.json({ error: message }, { status }) }

function mapJob(job: Record<string, unknown>) {
  return {
    id:String(job.id), title:String(job.title), description:String(job.description), location:String(job.location), country:String(job.country),
    region:job.region, industry:job.industry, employmentType:job.employment_type, salaryRange:String(job.salary_range ?? ""), currency:String(job.currency ?? "GBP"),
    positionsAvailable:Number(job.positions_available ?? 1), companyName:String(job.company_name ?? ""), requirements:String(job.requirements ?? ""), benefits:String(job.benefits ?? ""),
    active:Boolean(job.is_active), createdAt:String(job.created_at), updatedAt:String(job.updated_at),
  }
}

async function audit(session: PortalSession, action: string, entityType: string, entityId: string | number, details: string) {
  const { error: auditError } = await createAdminClient().from("portal_activity").insert({ user_email:session.email, user_name:session.currentUser, action, entity_type:entityType, entity_id:String(entityId), details })
  if (auditError) throw auditError
}

export async function GET() {
  const session = await getPortalSession()
  if (!session) return error("Your session has expired. Please sign in again.", 401)
  const db = createAdminClient()
  const [candidateResult, agentResult, employerResult, transactionResult, activityResult, staffResult, jobResult] = await Promise.all([
    db.from("portal_candidates").select("*,agent:portal_agents(name),employer:portal_employers(name)").order("updated_at", { ascending:false }),
    db.from("portal_agents").select("*").order("name"),
    db.from("portal_employers").select("*").order("name"),
    db.from("portal_transactions").select("*,candidate:portal_candidates(name,reference)").order("paid_at", { ascending:false }).order("id", { ascending:false }),
    db.from("portal_activity").select("*").order("id", { ascending:false }).limit(250),
    db.from("portal_staff").select("id,email,name,role,created_at").order("role").order("name"),
    db.from("jobs").select("*").order("created_at", { ascending:false }),
  ])
  const failed = [candidateResult, agentResult, employerResult, transactionResult, activityResult, staffResult, jobResult].find(result => result.error)
  if (failed?.error) return error("Portal records could not be loaded.", 500)

  const transactions = ((transactionResult.data ?? []) as TransactionRow[]).map(row => ({ id:row.id, candidateId:row.candidate_id, candidateName:row.candidate?.name ?? "", reference:row.candidate?.reference ?? "", direction:row.direction, category:row.category, amount:row.amount, paidAt:row.paid_at, note:row.note, createdAt:row.created_at }))
  const totals = new Map<number, { incoming:number; outgoing:number }>()
  transactions.forEach(row => { const total = totals.get(row.candidateId) ?? { incoming:0, outgoing:0 }; total[row.direction] += row.amount; totals.set(row.candidateId, total) })
  const candidates = ((candidateResult.data ?? []) as CandidateRow[]).map(row => ({ id:row.id, reference:row.reference, name:row.name, phone:row.phone, email:row.email, passportNumber:row.passport_number, nationality:row.nationality, destinationCountry:row.destination_country, jobTitle:row.job_title, status:row.status, visaRequired:row.visa_required ? 1 : 0, accommodation:row.accommodation ? 1 : 0, food:row.food ? 1 : 0, arrivalDate:row.arrival_date, agentId:row.agent_id, agentName:row.agent?.name ?? null, employerId:row.employer_id, employerName:row.employer?.name ?? null, agreedAmount:row.agreed_amount, incoming:totals.get(row.id)?.incoming ?? 0, outgoing:totals.get(row.id)?.outgoing ?? 0, notes:row.notes, createdAt:row.created_at, updatedAt:row.updated_at }))
  const agents = ((agentResult.data ?? []) as AgentRow[]).map(row => ({ id:row.id, name:row.name, country:row.country, contactName:row.contact_name, phone:row.phone, email:row.email, commissionPct:Number(row.commission_pct), active:row.active ? 1 : 0 }))
  const employers = ((employerResult.data ?? []) as EmployerRow[]).map(row => ({ id:row.id, name:row.name, country:row.country, contactName:row.contact_name, phone:row.phone, email:row.email, active:row.active ? 1 : 0 }))
  const activity = ((activityResult.data ?? []) as ActivityRow[]).map(row => ({ id:row.id, userEmail:row.user_email, userName:row.user_name, action:row.action, entityType:row.entity_type, entityId:row.entity_id, details:row.details, createdAt:row.created_at }))
  const staff = ((staffResult.data ?? []) as StaffRow[]).map(row => ({ id:row.id, email:row.email, name:row.name, role:row.role, createdAt:row.created_at }))
  const jobs = ((jobResult.data ?? []) as Record<string, unknown>[]).map(mapJob)
  return NextResponse.json({ role:session.role, currentUser:session.currentUser, candidates, agents, employers, transactions, activity, staff, jobs }, { headers:{ "cache-control":"private, no-store" } })
}

export async function POST(request: Request) {
  const session = await getPortalSession()
  if (!session) return error("Your session has expired. Please sign in again.", 401)
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body) return error("Invalid request.")
  const action = text(body.action, 40)
  if (action.startsWith("delete_") && session.role !== "admin") return error("Only an administrator can delete records.", 403)
  const db = createAdminClient()

  try {
    if (action === "save_candidate") {
      const candidateId = numericId(body.id), name = text(body.name, 120), status = text(body.status, 40) as ApplicationStatus
      if (!name || !APPLICATION_STATUSES.includes(status)) return error("Complete the candidate name and status.")
      const values = { name, phone:text(body.phone,50), email:text(body.email,160).toLowerCase(), passport_number:text(body.passportNumber,80), nationality:text(body.nationality,80), destination_country:text(body.destinationCountry,80), job_title:text(body.jobTitle,120), status, visa_required:body.visaRequired === "1", accommodation:body.accommodation === "1", food:body.food === "1", arrival_date:text(body.arrivalDate,20) || null, agent_id:numericId(body.agentId), employer_id:numericId(body.employerId), agreed_amount:pence(body.agreedAmount), notes:text(body.notes,1000), updated_at:new Date().toISOString() }
      if (candidateId) { const result = await db.from("portal_candidates").update(values).eq("id", candidateId); if (result.error) throw result.error; await audit(session,"updated candidate","candidate",candidateId,`${name} was updated`) }
      else { const result = await db.from("portal_candidates").insert({ ...values, reference:"" }).select("id,reference").single(); if (result.error) throw result.error; await audit(session,"added candidate","candidate",result.data.id,`${name} added as ${result.data.reference}`) }
      return NextResponse.json({ ok:true })
    }
    if (action === "update_status") {
      const candidateId = numericId(body.id), status = text(body.status,40) as ApplicationStatus
      if (!candidateId || !APPLICATION_STATUSES.includes(status)) return error("Invalid candidate or status.")
      const { data:candidate } = await db.from("portal_candidates").select("name").eq("id",candidateId).maybeSingle()
      const result = await db.from("portal_candidates").update({ status, updated_at:new Date().toISOString() }).eq("id",candidateId); if (result.error) throw result.error
      await audit(session,"updated status","candidate",candidateId,`${candidate?.name ?? "Candidate"} moved to ${status}`)
      return NextResponse.json({ ok:true })
    }
    if (action === "save_agent") {
      const agentId = numericId(body.id), name = text(body.name,120); if (!name) return error("Agent name is required.")
      const values = { name, country:text(body.country,80), contact_name:text(body.contactName,120), phone:text(body.phone,50), email:text(body.email,160).toLowerCase(), commission_pct:Number(body.commissionPct) || 0, updated_at:new Date().toISOString() }
      const result = agentId ? await db.from("portal_agents").update(values).eq("id",agentId) : await db.from("portal_agents").insert(values); if (result.error) throw result.error
      await audit(session,agentId ? "updated agent" : "added agent","agent",agentId ?? "new",`${name} ${agentId ? "updated" : "added"}`)
      return NextResponse.json({ ok:true })
    }
    if (action === "save_employer") {
      const employerId = numericId(body.id), name = text(body.name,120); if (!name) return error("Employer name is required.")
      const values = { name, country:text(body.country,80), contact_name:text(body.contactName,120), phone:text(body.phone,50), email:text(body.email,160).toLowerCase(), updated_at:new Date().toISOString() }
      const result = employerId ? await db.from("portal_employers").update(values).eq("id",employerId) : await db.from("portal_employers").insert(values); if (result.error) throw result.error
      await audit(session,employerId ? "updated employer" : "added employer","employer",employerId ?? "new",`${name} ${employerId ? "updated" : "added"}`)
      return NextResponse.json({ ok:true })
    }
    if (action === "add_transaction") {
      const candidateId = numericId(body.candidateId), direction = body.direction === "outgoing" ? "outgoing" : "incoming", amount = pence(body.amount)
      if (!candidateId || amount <= 0) return error("Choose a candidate and enter a valid amount.")
      const { data:candidate } = await db.from("portal_candidates").select("name").eq("id",candidateId).maybeSingle(); if (!candidate) return error("Candidate not found.",404)
      const result = await db.from("portal_transactions").insert({ candidate_id:candidateId, direction, category:text(body.category,80), amount, paid_at:text(body.paidAt,20), note:text(body.note,300) }).select("id").single(); if (result.error) throw result.error
      await audit(session,direction === "incoming" ? "recorded payment" : "recorded expense","transaction",result.data.id,`${direction === "incoming" ? "Payment" : "Expense"} of £${(amount / 100).toFixed(2)} for ${candidate.name}`)
      return NextResponse.json({ ok:true })
    }
    if (action === "delete_candidate") {
      const candidateId = numericId(body.id); if (!candidateId) return error("Invalid candidate.")
      const { data:candidate } = await db.from("portal_candidates").select("name").eq("id",candidateId).maybeSingle()
      const result = await db.from("portal_candidates").delete().eq("id",candidateId); if (result.error) throw result.error
      await audit(session,"deleted candidate","candidate",candidateId,`${candidate?.name ?? "Candidate"} deleted`)
      return NextResponse.json({ ok:true })
    }

    const jobId = text(body.id,80)
    if (action === "toggle_job") {
      if (!jobId) return error("Choose a valid job.")
      const result = await db.from("jobs").update({ is_active:Boolean(body.active), updated_at:new Date().toISOString() }).eq("id",jobId); if (result.error) throw result.error
      await audit(session,"updated job","job",jobId,`Job listing ${body.active ? "published" : "paused"}`)
      return NextResponse.json({ ok:true })
    }
    if (action === "delete_job") {
      if (!jobId) return error("Choose a valid job.")
      const result = await db.from("jobs").delete().eq("id",jobId); if (result.error) throw result.error
      await audit(session,"deleted job","job",jobId,"Job listing deleted")
      return NextResponse.json({ ok:true })
    }
    if (action === "save_job") {
      const title=text(body.title,140), description=text(body.description,12000), location=text(body.location,120), country=text(body.country,100), region=text(body.region,30), industry=text(body.industry,40), employmentType=text(body.employmentType,30)
      if (!title || !description || !location || !country || !allowedRegions.has(region) || !allowedIndustries.has(industry) || !allowedEmploymentTypes.has(employmentType)) return error("Complete all required job details.")
      const values = { title, description, location, country, region, industry, employment_type:employmentType, salary_range:text(body.salaryRange,120) || null, currency:text(body.currency,10) || "GBP", positions_available:Math.max(1,Number(body.positionsAvailable) || 1), company_name:text(body.companyName,160) || null, requirements:text(body.requirements,8000) || null, benefits:text(body.benefits,8000) || null, is_active:body.active !== false && body.active !== "false", updated_at:new Date().toISOString() }
      const result = jobId ? await db.from("jobs").update(values).eq("id",jobId) : await db.from("jobs").insert(values).select("id").single(); if (result.error) throw result.error
      await audit(session,jobId ? "updated job" : "added job","job",jobId || result.data?.id || "new",`${title} ${jobId ? "updated" : "added"}`)
      return NextResponse.json({ ok:true })
    }
    return error("Unknown action.")
  } catch (cause) {
    if (cause instanceof Error && cause.message === "INVALID_AMOUNT") return error("Enter a valid amount.")
    console.error("Portal request failed", cause)
    return error("The request could not be completed.", 500)
  }
}

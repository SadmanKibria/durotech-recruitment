import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export type PortalRole = "admin" | "secretary"

export type PortalSession = {
  id: string
  email: string
  currentUser: string
  role: PortalRole
}

export async function getPortalSession(): Promise<PortalSession | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const email = data.user?.email?.toLowerCase()
  if (!data.user || !email) return null

  const { data: staff } = await createAdminClient()
    .from("portal_staff")
    .select("id,email,name,role")
    .eq("email", email)
    .maybeSingle()

  if (!staff) return null
  return { id: staff.id, email: staff.email, currentUser: staff.name, role: staff.role as PortalRole }
}

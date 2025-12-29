import { createClient } from "@/lib/supabase/server"
import type { AdminRole } from "@/lib/types"

export async function getAdminRole(): Promise<AdminRole | null> {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: adminUser } = await supabase.from("admin_users").select("role").eq("user_id", user.id).single()

    return adminUser?.role || null
  } catch (error) {
    console.error("[ADMIN_ROLE_ERROR]", error)
    return null
  }
}

export function canDelete(role: AdminRole | null): boolean {
  if (!role) return false
  return role === "superadmin"
}

export function canAccessFinancials(role: AdminRole | null): boolean {
  if (!role) return false
  return role === "superadmin" || role === "manager"
}

export function canManageAdmins(role: AdminRole | null): boolean {
  if (!role) return false
  return role === "superadmin"
}

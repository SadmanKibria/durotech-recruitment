import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Just check if we have a user for UI purposes
  let user = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.error("[v0] Admin layout auth error:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        <div className="flex">
          <AdminSidebar user={user} />
          <main className="flex-1 p-8 ml-64">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

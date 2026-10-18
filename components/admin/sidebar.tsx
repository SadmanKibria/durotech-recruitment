"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Briefcase, LayoutDashboard, FileText, Users, LogOut, Plus, ExternalLink, Inbox, Building2, UserCog } from "lucide-react"
import type { User } from "@supabase/supabase-js"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: FileText },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/talent-pool", label: "Talent Pool", icon: Inbox },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/agents", label: "Agents", icon: UserCog },
]

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r flex flex-col z-50">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-primary flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg block leading-tight">Durotech</span>
            <span className="text-xs text-muted-foreground">Admin Portal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="pt-4 space-y-2">
          <Link href="/admin/jobs/new">
            <Button className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </Link>

          <Link href="/" target="_blank">
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Website
            </Button>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="mb-3 p-2 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium text-muted-foreground mb-0.5">Signed in as</p>
          <p className="text-xs truncate font-medium">{user.email}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}

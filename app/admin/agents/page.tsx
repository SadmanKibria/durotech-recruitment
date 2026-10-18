import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Phone, Mail, Building2, Percent, UserCog } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AgentsPage() {
  const supabase = await createClient()

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.error("Auth error:", error)
  }

  if (!user) redirect("/admin/login")

  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false })

  // Get application counts for each agent
  const { data: applicationCounts } = await supabase
    .from("applications")
    .select("agent_id")
  
  const agentApplicationCounts: Record<string, number> = {}
  applicationCounts?.forEach((app) => {
    if (app.agent_id) {
      agentApplicationCounts[app.agent_id] = (agentApplicationCounts[app.agent_id] || 0) + 1
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground mt-1">
            Manage recruitment agents who source talents for your company
          </p>
        </div>
        <Link href="/admin/agents/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </Link>
      </div>

      {agents && agents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Link key={agent.id} href={`/admin/agents/${agent.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      {agent.company && (
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3" />
                          {agent.company}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant={agent.is_active ? "default" : "secondary"}>
                      {agent.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agent.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {agent.email}
                    </div>
                  )}
                  {agent.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {agent.phone}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-sm">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{agent.commission_rate || 0}%</span>
                      <span className="text-muted-foreground">commission</span>
                    </div>
                    <Badge variant="outline">
                      {agentApplicationCounts[agent.id] || 0} applications
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCog className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No agents yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add recruitment agents who source talents for your company
            </p>
            <Link href="/admin/agents/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Agent
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

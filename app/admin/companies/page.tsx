import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Mail, Phone, Edit } from "lucide-react"
import Link from "next/link"

export default async function CompaniesPage() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.error("Auth error:", error)
  }

  if (!user) redirect("/admin/login")

  const supabase = await createClient()
  const { data: companies } = await supabase.from("companies").select("*").order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-muted-foreground text-sm">Manage client companies</p>
        </div>
        <Link href="/admin/companies/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies?.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base line-clamp-1">{company.name}</CardTitle>
                  </div>
                </div>
                <Link href={`/admin/companies/${company.id}/edit`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {company.contact_person && <p className="text-muted-foreground">Contact: {company.contact_person}</p>}
              {company.contact_email && (
                <a
                  href={`mailto:${company.contact_email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{company.contact_email}</span>
                </a>
              )}
              {company.contact_phone && (
                <a href={`tel:${company.contact_phone}`} className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {company.contact_phone}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!companies || companies.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No companies added yet</p>
            <Link href="/admin/companies/new">
              <Button className="mt-4 bg-transparent" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Company
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

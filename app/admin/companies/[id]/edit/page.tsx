import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyForm } from "@/components/admin/company-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DeleteCompanyButton } from "@/components/admin/delete-company-button"

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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
  const { data: company } = await supabase.from("companies").select("*").eq("id", id).single()

  if (!company) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/companies">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <DeleteCompanyButton companyId={id} companyName={company.name} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Company</CardTitle>
          <CardDescription>Update company information</CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm company={company} />
        </CardContent>
      </Card>
    </div>
  )
}

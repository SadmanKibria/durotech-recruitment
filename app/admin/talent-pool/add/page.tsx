import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ManualCVForm } from "@/components/admin/manual-cv-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AddCVManuallyPage() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.error("Auth error:", error)
  }

  if (!user) redirect("/admin/login")

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/talent-pool">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Talent Pool
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add CV Manually</CardTitle>
          <CardDescription>Manually add a candidate CV to your talent pool</CardDescription>
        </CardHeader>
        <CardContent>
          <ManualCVForm />
        </CardContent>
      </Card>
    </div>
  )
}

import { redirect } from "next/navigation"

export default function AuthLoginPage() {
  // Redirect to the admin login page
  redirect("/admin/login")
}

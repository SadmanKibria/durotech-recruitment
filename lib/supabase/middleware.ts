import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const { pathname } = request.nextUrl
  const isAdminLogin = pathname === "/admin/login"
  const isAdminRoute = pathname.startsWith("/admin")

  try {
    await supabase.auth.getSession()
  } catch (error) {
    console.error("[v0] Session refresh error:", error)
  }

  // Only enforce auth on admin routes (not login page)
  if (isAdminRoute && !isAdminLogin) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin/login"
        url.searchParams.set("redirectedFrom", pathname)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("[v0] Auth check error:", error)
    }
  }

  if (isAdminLogin) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("[v0] Login redirect check error:", error)
    }
  }

  return supabaseResponse
}

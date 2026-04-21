import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase credentials are missing, allow public routes but block admin routes
  if (!supabaseUrl || !supabaseAnonKey) {
    const { pathname } = request.nextUrl
    const isAdminRoute = pathname.startsWith("/admin")
    
    // Block admin routes when Supabase is not configured
    if (isAdminRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
    
    // Allow all other routes
    return supabaseResponse
  }

  let response = supabaseResponse

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { pathname } = request.nextUrl
  const isAdminLogin = pathname === "/admin/login"
  const isAdminRoute = pathname.startsWith("/admin")

  // Refresh session for all routes
  try {
    await supabase.auth.getSession()
  } catch {
    // Session refresh failed - continue without auth
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
    } catch {
      // Auth check failed - redirect to login
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in users away from login page
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
    } catch {
      // Auth check failed - allow access to login page
    }
  }

  return response
}

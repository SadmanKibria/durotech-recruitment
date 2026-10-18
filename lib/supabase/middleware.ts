import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

type CookieUpdate = { name: string; value: string; options?: Record<string, unknown> }

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  const refresh = async (url?: string, key?: string, cookieName?: string) => {
    if (!url || !key) return null
    const client = createServerClient(url, key, {
      ...(cookieName ? { cookieOptions: { name: cookieName } } : {}),
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (items: CookieUpdate[]) => {
          items.forEach(({ name, value }) => request.cookies.set(name, value))
          const next = NextResponse.next({ request })
          response.cookies.getAll().forEach(cookie => next.cookies.set(cookie))
          items.forEach(({ name, value, options }) => next.cookies.set(name, value, options))
          response = next
        },
      },
    })
    await client.auth.getUser().catch(() => null)
    return client
  }

  const publicClient = await refresh(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const isAdminLogin = pathname === "/admin/login"
  const isAdminRoute = pathname.startsWith("/admin")
  if (isAdminRoute && !publicClient) return NextResponse.redirect(new URL("/", request.url))
  if (isAdminRoute && !isAdminLogin) {
    const { data } = await publicClient!.auth.getUser()
    if (!data.user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("redirectedFrom", pathname)
      return NextResponse.redirect(url)
    }
  }
  if (isAdminLogin && publicClient) {
    const { data } = await publicClient.auth.getUser()
    if (data.user) return NextResponse.redirect(new URL("/admin", request.url))
  }

  response.headers.set("Cache-Control", "private, no-store")
  return response
}

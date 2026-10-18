import { NextResponse } from "next/server"
import { copyPortalCookies, portalBackendFetch } from "@/lib/portal/backend"

export async function POST(request: Request) {
  const upstream = await portalBackendFetch("/api/auth/logout", { method: "POST" })
  return copyPortalCookies(upstream, NextResponse.redirect(new URL("/portal/login", request.url), 303))
}

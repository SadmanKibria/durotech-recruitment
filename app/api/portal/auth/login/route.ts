import { NextResponse } from "next/server"
import { copyPortalCookies, portalBackendFetch } from "@/lib/portal/backend"

export async function POST(request: Request) {
  const upstream = await portalBackendFetch("/api/auth/login", { method: "POST", body: await request.text(), headers: { "content-type": "application/json" } })
  const response = new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": "application/json", "cache-control": "private, no-store" } })
  return copyPortalCookies(upstream, response)
}

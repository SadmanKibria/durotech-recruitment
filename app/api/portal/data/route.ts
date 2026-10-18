import { NextResponse } from "next/server"
import { copyPortalCookies, portalBackendFetch } from "@/lib/portal/backend"

export const dynamic = "force-dynamic"

async function proxy(request: Request) {
  const body = request.method === "GET" ? undefined : await request.text()
  const upstream = await portalBackendFetch("/api/data", { method: request.method, body, headers: { "content-type": request.headers.get("content-type") || "application/json" } })
  const response = new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "application/json", "cache-control": "private, no-store" } })
  return copyPortalCookies(upstream, response)
}

export const GET = proxy
export const POST = proxy

import { cookies } from "next/headers"

const PORTAL_ORIGIN = process.env.PORTAL_BACKEND_URL || "https://durotech-recruitment-portal.vercel.app"

export async function portalBackendFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ")
  const headers = new Headers(init.headers)
  if (cookieHeader) headers.set("cookie", cookieHeader)
  headers.set("accept", "application/json")
  return fetch(`${PORTAL_ORIGIN}${path}`, { ...init, headers, cache: "no-store", redirect: "manual" })
}

export async function getPortalSession() {
  const response = await portalBackendFetch("/api/data")
  if (!response.ok) return null
  return response.json() as Promise<{ currentUser: string; role: "admin" | "secretary" }>
}

export function copyPortalCookies(source: Response, target: Response) {
  const getSetCookie = (source.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie
  const cookies = getSetCookie ? getSetCookie.call(source.headers) : source.headers.get("set-cookie") ? [source.headers.get("set-cookie")!] : []
  cookies.forEach(value => target.headers.append("set-cookie", value))
  return target
}

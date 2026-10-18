import type { SupabaseClient } from "@supabase/supabase-js"

export const RESUME_BUCKET = "candidate-cvs"
const STORAGE_PREFIX = `supabase://${RESUME_BUCKET}/`

export function sanitiseFilename(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() || "pdf"
  const stem = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "candidate-cv"

  return `${stem}.${extension}`
}

export function createResumePath(filename: string) {
  return `applications/${crypto.randomUUID()}-${sanitiseFilename(filename)}`
}

export function toStoredResumeUrl(path: string) {
  return `${STORAGE_PREFIX}${path}`
}

export function getStoredResumePath(value: string) {
  return value.startsWith(STORAGE_PREFIX) ? value.slice(STORAGE_PREFIX.length) : null
}

export async function uploadResume(supabase: SupabaseClient, file: File) {
  const path = createResumePath(file.name)
  const { error } = await supabase.storage.from(RESUME_BUCKET).upload(path, await file.arrayBuffer(), {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  })

  if (error) throw error
  return toStoredResumeUrl(path)
}

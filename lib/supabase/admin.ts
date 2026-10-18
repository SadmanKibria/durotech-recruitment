import { createClient } from "@supabase/supabase-js"

// Admin client using service role key - bypasses RLS
// Use this for operations that need to work without user authentication
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

import { createClient } from "@supabase/supabase-js";

// Service-role client that bypasses RLS.
// Use ONLY in server-side routes where there is no user session
// (e.g. verification links clicked by external clients, Stripe webhooks).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key);
}

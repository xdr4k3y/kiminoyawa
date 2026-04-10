import { createClient } from "@supabase/supabase-js";

function firstDefined(names) {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  throw new Error(`Missing environment variable. Tried: ${names.join(", ")}`);
}

export function createSupabaseBrowserClient() {
  return createClient(
    firstDefined(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]),
    firstDefined(["NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY"]),
  );
}

export function createSupabaseServerClient() {
  return createClient(
    firstDefined(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]),
    firstDefined(["SUPABASE_SERVICE_ROLE_KEY"]),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

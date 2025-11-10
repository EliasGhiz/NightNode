import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let serverClient: SupabaseClient<Database> | null = null;

export function getServerClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Supabase env vars missing. Server actions will be NOOP.");
    }
    return null;
  }

  if (!serverClient) {
    serverClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return serverClient;
}

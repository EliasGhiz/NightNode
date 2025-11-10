import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./schema";

let browserClient: SupabaseClient<Database> | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getBrowserClient() {
  if (typeof window === "undefined") return null;
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Supabase URL/anon key missing. Falling back to mock data.");
    }
    return null;
  }

  if (!browserClient) {
    browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

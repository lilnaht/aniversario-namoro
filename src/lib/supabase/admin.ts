import "server-only";
import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

if (!config.supabaseServiceRoleKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is not set. Admin writes will fail.");
}

export const supabaseAdmin =
  config.supabaseUrl && config.supabaseServiceRoleKey
    ? createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
        auth: { persistSession: false },
      })
    : null;

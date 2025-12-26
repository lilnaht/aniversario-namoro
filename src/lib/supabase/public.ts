import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

export const supabasePublic =
  config.supabaseUrl && config.supabaseAnonKey
    ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceRoleKey,
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? "10"),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  mockData: process.env.MOCK_DATA === "true" || !supabaseUrl || !supabaseAnonKey,
};

export const maxUploadBytes = Math.max(1, config.maxUploadMb) * 1024 * 1024;

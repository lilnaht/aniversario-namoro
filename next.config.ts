import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost: string | undefined;

if (supabaseUrl) {
  try {
    supabaseHost = new URL(supabaseUrl).hostname;
  } catch {
    supabaseHost = undefined;
  }
}

const remotePatterns = [];

if (supabaseHost) {
  remotePatterns.push({
    protocol: "https",
    hostname: supabaseHost,
    pathname: "/storage/v1/object/public/**",
  });
} else if (process.env.NODE_ENV !== "production") {
  remotePatterns.push({
    protocol: "https",
    hostname: "**.supabase.co",
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;

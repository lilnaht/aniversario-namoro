import { config } from "@/lib/config";

export function getPublicImageUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }
  if (config.mockData) {
    return `/uploads/${path}`;
  }
  return `${config.supabaseUrl}/storage/v1/object/public/romantic/${path}`;
}

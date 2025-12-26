import { cache } from "react";
import { config } from "@/lib/config";
import { logError } from "@/lib/logger";
import { supabasePublic } from "@/lib/supabase/public";
import { mockDb } from "@/lib/data/mock";
import type { CarouselImage, Letter, Quote, Reason, Settings, TimelinePost } from "@/lib/types";

function ensureClient() {
  if (!supabasePublic) {
    throw new Error("Supabase client not configured.");
  }
  return supabasePublic;
}

export const getSettings = cache(async (): Promise<Settings | null> => {
  if (config.mockData) {
    return mockDb.getSettings();
  }
  try {
    const { data, error } = await ensureClient()
      .from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      throw error;
    }
    return data ?? null;
  } catch (error) {
    logError("Failed to load settings", error);
    return null;
  }
});

export const getCarouselImages = cache(async (): Promise<CarouselImage[]> => {
  if (config.mockData) {
    return mockDb.listCarousel();
  }
  try {
    const { data, error } = await ensureClient()
      .from("carousel_images")
      .select("*")
      .order("position", { ascending: true });
    if (error) {
      throw error;
    }
    return data ?? [];
  } catch (error) {
    logError("Failed to load carousel images", error);
    return [];
  }
});

export const getQuotes = cache(async (): Promise<Quote[]> => {
  if (config.mockData) {
    return mockDb.listQuotes();
  }
  try {
    const { data, error } = await ensureClient().from("quotes").select("*");
    if (error) {
      throw error;
    }
    return data ?? [];
  } catch (error) {
    logError("Failed to load quotes", error);
    return [];
  }
});

export const getTimelinePosts = cache(async (): Promise<TimelinePost[]> => {
  if (config.mockData) {
    return mockDb.listTimeline();
  }
  try {
    const { data, error } = await ensureClient()
      .from("timeline_posts")
      .select("*")
      .order("date", { ascending: true });
    if (error) {
      throw error;
    }
    return data ?? [];
  } catch (error) {
    logError("Failed to load timeline posts", error);
    return [];
  }
});

export const getLetters = cache(async (): Promise<Letter[]> => {
  if (config.mockData) {
    return mockDb.listLetters();
  }
  try {
    const { data, error } = await ensureClient()
      .from("letters")
      .select("*")
      .order("date", { ascending: true });
    if (error) {
      throw error;
    }
    return data ?? [];
  } catch (error) {
    logError("Failed to load letters", error);
    return [];
  }
});

export const getLetterBySlugOrId = cache(
  async (slugOrId: string): Promise<Letter | null> => {
    if (config.mockData) {
      return (
        mockDb.listLetters().find((letter) => letter.slug === slugOrId) ??
        mockDb.listLetters().find((letter) => letter.id === slugOrId) ??
        null
      );
    }
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          slugOrId,
        );
      const query = ensureClient().from("letters").select("*");
      const { data, error } = isUuid
        ? await query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`).maybeSingle()
        : await query.eq("slug", slugOrId).maybeSingle();
      if (error) {
        throw error;
      }
      return data ?? null;
    } catch (error) {
      logError("Failed to load letter", error);
      return null;
    }
  },
);

export const getReasons = cache(async (): Promise<Reason[]> => {
  if (config.mockData) {
    return mockDb.listReasons();
  }
  try {
    const { data, error } = await ensureClient()
      .from("reasons")
      .select("*")
      .order("position", { ascending: true });
    if (error) {
      throw error;
    }
    return data ?? [];
  } catch (error) {
    logError("Failed to load reasons", error);
    return [];
  }
});

import "server-only";

import { config } from "@/lib/config";
import { mockDb } from "@/lib/data/mock";
import { logError, logInfo } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CarouselImage, Letter, Quote, Reason, Settings, TimelinePost } from "@/lib/types";

function ensureAdmin() {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not configured.");
  }
  return supabaseAdmin;
}

export async function saveSettings(payload: Partial<Settings>): Promise<Settings> {
  if (config.mockData) {
    return mockDb.updateSettings(payload);
  }
  try {
    const { data, error } = await ensureAdmin()
      .from("settings")
      .upsert({ id: 1, ...payload }, { onConflict: "id" })
      .select("*")
      .single();
    if (error) {
      throw error;
    }
    logInfo("Settings updated");
    return data;
  } catch (error) {
    logError("Failed to update settings", error);
    throw error;
  }
}

export async function createCarouselImage(
  payload: Omit<CarouselImage, "id" | "created_at">,
): Promise<CarouselImage> {
  if (config.mockData) {
    return mockDb.createCarousel(payload);
  }
  const { data, error } = await ensureAdmin()
    .from("carousel_images")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    logError("Failed to create carousel image", error);
    throw error;
  }
  logInfo("Carousel image created", { id: data.id });
  return data;
}

export async function updateCarouselImage(
  id: string,
  payload: Partial<CarouselImage>,
): Promise<CarouselImage | null> {
  if (config.mockData) {
    return mockDb.updateCarousel(id, payload);
  }
  const { data, error } = await ensureAdmin()
    .from("carousel_images")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    logError("Failed to update carousel image", error);
    throw error;
  }
  logInfo("Carousel image updated", { id });
  return data;
}

export async function deleteCarouselImage(id: string): Promise<void> {
  if (config.mockData) {
    mockDb.deleteCarousel(id);
    return;
  }
  const { error } = await ensureAdmin().from("carousel_images").delete().eq("id", id);
  if (error) {
    logError("Failed to delete carousel image", error);
    throw error;
  }
  logInfo("Carousel image deleted", { id });
}

export async function createQuote(text: string): Promise<Quote> {
  if (config.mockData) {
    return mockDb.createQuote(text);
  }
  const { data, error } = await ensureAdmin()
    .from("quotes")
    .insert({ text })
    .select("*")
    .single();
  if (error) {
    logError("Failed to create quote", error);
    throw error;
  }
  logInfo("Quote created", { id: data.id });
  return data;
}

export async function updateQuote(id: string, text: string): Promise<Quote | null> {
  if (config.mockData) {
    return mockDb.updateQuote(id, text);
  }
  const { data, error } = await ensureAdmin()
    .from("quotes")
    .update({ text })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    logError("Failed to update quote", error);
    throw error;
  }
  logInfo("Quote updated", { id });
  return data;
}

export async function deleteQuote(id: string): Promise<void> {
  if (config.mockData) {
    mockDb.deleteQuote(id);
    return;
  }
  const { error } = await ensureAdmin().from("quotes").delete().eq("id", id);
  if (error) {
    logError("Failed to delete quote", error);
    throw error;
  }
  logInfo("Quote deleted", { id });
}

export async function createTimelinePost(
  payload: Omit<TimelinePost, "id" | "created_at">,
): Promise<TimelinePost> {
  if (config.mockData) {
    return mockDb.createTimeline(payload);
  }
  const { data, error } = await ensureAdmin()
    .from("timeline_posts")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    logError("Failed to create timeline post", error);
    throw error;
  }
  logInfo("Timeline post created", { id: data.id });
  return data;
}

export async function updateTimelinePost(
  id: string,
  payload: Partial<TimelinePost>,
): Promise<TimelinePost | null> {
  if (config.mockData) {
    return mockDb.updateTimeline(id, payload);
  }
  const { data, error } = await ensureAdmin()
    .from("timeline_posts")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    logError("Failed to update timeline post", error);
    throw error;
  }
  logInfo("Timeline post updated", { id });
  return data;
}

export async function deleteTimelinePost(id: string): Promise<void> {
  if (config.mockData) {
    mockDb.deleteTimeline(id);
    return;
  }
  const { error } = await ensureAdmin().from("timeline_posts").delete().eq("id", id);
  if (error) {
    logError("Failed to delete timeline post", error);
    throw error;
  }
  logInfo("Timeline post deleted", { id });
}

export async function createLetter(
  payload: Omit<Letter, "id" | "created_at">,
): Promise<Letter> {
  if (config.mockData) {
    return mockDb.createLetter(payload);
  }
  const { data, error } = await ensureAdmin()
    .from("letters")
    .insert(payload)
    .select("*")
    .single();
  if (error) {
    logError("Failed to create letter", error);
    throw error;
  }
  logInfo("Letter created", { id: data.id });
  return data;
}

export async function updateLetter(
  id: string,
  payload: Partial<Letter>,
): Promise<Letter | null> {
  if (config.mockData) {
    return mockDb.updateLetter(id, payload);
  }
  const { data, error } = await ensureAdmin()
    .from("letters")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    logError("Failed to update letter", error);
    throw error;
  }
  logInfo("Letter updated", { id });
  return data;
}

export async function deleteLetter(id: string): Promise<void> {
  if (config.mockData) {
    mockDb.deleteLetter(id);
    return;
  }
  const { error } = await ensureAdmin().from("letters").delete().eq("id", id);
  if (error) {
    logError("Failed to delete letter", error);
    throw error;
  }
  logInfo("Letter deleted", { id });
}

export async function createReason(text: string, position: number): Promise<Reason> {
  if (config.mockData) {
    return mockDb.createReason(text, position);
  }
  const { data, error } = await ensureAdmin()
    .from("reasons")
    .insert({ text, position })
    .select("*")
    .single();
  if (error) {
    logError("Failed to create reason", error);
    throw error;
  }
  logInfo("Reason created", { id: data.id });
  return data;
}

export async function updateReason(
  id: string,
  payload: Partial<Reason>,
): Promise<Reason | null> {
  if (config.mockData) {
    return mockDb.updateReason(id, payload);
  }
  const { data, error } = await ensureAdmin()
    .from("reasons")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    logError("Failed to update reason", error);
    throw error;
  }
  logInfo("Reason updated", { id });
  return data;
}

export async function deleteReason(id: string): Promise<void> {
  if (config.mockData) {
    mockDb.deleteReason(id);
    return;
  }
  const { error } = await ensureAdmin().from("reasons").delete().eq("id", id);
  if (error) {
    logError("Failed to delete reason", error);
    throw error;
  }
  logInfo("Reason deleted", { id });
}

"use server";

import { revalidatePath } from "next/cache";
import { logError } from "@/lib/logger";
import {
  createAdminSession,
  clearAdminSession,
  getAttemptState,
  getLoginDelayMs,
  isPasswordValid,
  registerFailedAttempt,
  requireAdminSession,
  resetAttempts,
} from "@/lib/auth";
import {
  createCarouselImage,
  createLetter,
  createQuote,
  createReason,
  createTimelinePost,
  deleteCarouselImage,
  deleteLetter,
  deleteQuote,
  deleteReason,
  deleteTimelinePost,
  saveSettings,
  updateCarouselImage,
  updateLetter,
  updateQuote,
  updateReason,
  updateTimelinePost,
} from "@/lib/data/admin";
import { uploadImage } from "@/lib/storage";
import {
  carouselSchema,
  idSchema,
  letterSchema,
  quoteSchema,
  reasonSchema,
  settingsSchema,
  timelineSchema,
  toSlug,
} from "@/lib/validation";
import type { CarouselImage, Letter, Reason, TimelinePost } from "@/lib/types";

export type ActionResult = {
  ok: boolean;
  message?: string;
};

export type UploadResult = ActionResult & {
  path?: string;
};

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/historia");
  revalidatePath("/cartas");
  revalidatePath("/admin");
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const attemptState = await getAttemptState();
  if (attemptState.lockedUntil && attemptState.lockedUntil > Date.now()) {
    const remainingMinutes = Math.ceil(
      (attemptState.lockedUntil - Date.now()) / 1000 / 60,
    );
    return {
      ok: false,
      message: `Muitas tentativas. Tente novamente em ${remainingMinutes} min.`,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!isPasswordValid(password)) {
    const nextState = await registerFailedAttempt();
    await delay(getLoginDelayMs(nextState.count));
    return { ok: false, message: "Senha incorreta." };
  }

  await resetAttempts();
  await createAdminSession();
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
}

export async function saveSettingsAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const payload = settingsSchema.parse({
      relationshipStartDate: formData.get("relationshipStartDate") || null,
      spotifyTrackUrl: formData.get("spotifyTrackUrl") || null,
    });
    await saveSettings({
      relationship_start_date: payload.relationshipStartDate || null,
      spotify_track_url: payload.spotifyTrackUrl || null,
    });
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to save settings", error);
    return { ok: false, message: "Erro ao salvar configuracoes." };
  }
}

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  await requireAdminSession();
  try {
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "misc");
    if (!(file instanceof File)) {
      return { ok: false, message: "Arquivo invalido." };
    }
    const path = await uploadImage(file, folder);
    return { ok: true, path };
  } catch (error) {
    logError("Failed to upload image", error);
    return { ok: false, message: "Erro ao enviar imagem." };
  }
}

export async function createCarouselAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const payload = carouselSchema.parse({
      imagePath: formData.get("imagePath"),
      caption: formData.get("caption") || null,
      position: Number(formData.get("position") || 0),
    });
    await createCarouselImage({
      image_path: payload.imagePath,
      caption: payload.caption ?? null,
      position: payload.position,
    });
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to create carousel image", error);
    return { ok: false, message: "Erro ao criar imagem." };
  }
}

export async function updateCarouselAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    const payload = carouselSchema.partial().parse({
      imagePath: formData.get("imagePath") || undefined,
      caption: formData.get("caption") || null,
      position: formData.get("position") ? Number(formData.get("position")) : undefined,
    });
    const updatePayload: Partial<CarouselImage> = {};
    if (payload.imagePath !== undefined) updatePayload.image_path = payload.imagePath;
    if (payload.caption !== undefined) updatePayload.caption = payload.caption ?? null;
    if (payload.position !== undefined) updatePayload.position = payload.position;
    await updateCarouselImage(id, updatePayload);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to update carousel image", error);
    return { ok: false, message: "Erro ao atualizar imagem." };
  }
}

export async function deleteCarouselAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    await deleteCarouselImage(id);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to delete carousel image", error);
    return { ok: false, message: "Erro ao excluir imagem." };
  }
}

export async function createQuoteAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const payload = quoteSchema.parse({
      text: formData.get("text"),
    });
    await createQuote(payload.text);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to create quote", error);
    return { ok: false, message: "Erro ao criar frase." };
  }
}

export async function updateQuoteAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    const payload = quoteSchema.parse({
      text: formData.get("text"),
    });
    await updateQuote(id, payload.text);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to update quote", error);
    return { ok: false, message: "Erro ao atualizar frase." };
  }
}

export async function deleteQuoteAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    await deleteQuote(id);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to delete quote", error);
    return { ok: false, message: "Erro ao excluir frase." };
  }
}

export async function createTimelineAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const payload = timelineSchema.parse({
      date: formData.get("date"),
      title: formData.get("title") || null,
      content: formData.get("content"),
      imagePath: formData.get("imagePath") || null,
    });
    await createTimelinePost({
      date: payload.date,
      title: payload.title ?? null,
      content: payload.content,
      image_path: payload.imagePath ?? null,
    });
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to create timeline post", error);
    return { ok: false, message: "Erro ao criar post." };
  }
}

export async function updateTimelineAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    const payload = timelineSchema.partial().parse({
      date: formData.get("date") || undefined,
      title: formData.get("title") || null,
      content: formData.get("content") || undefined,
      imagePath: formData.get("imagePath") || null,
    });
    const updatePayload: Partial<TimelinePost> = {};
    if (payload.date !== undefined) updatePayload.date = payload.date;
    if (payload.title !== undefined) updatePayload.title = payload.title ?? null;
    if (payload.content !== undefined) updatePayload.content = payload.content;
    if (payload.imagePath !== undefined) updatePayload.image_path = payload.imagePath ?? null;
    await updateTimelinePost(id, updatePayload);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to update timeline post", error);
    return { ok: false, message: "Erro ao atualizar post." };
  }
}

export async function deleteTimelineAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    await deleteTimelinePost(id);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to delete timeline post", error);
    return { ok: false, message: "Erro ao excluir post." };
  }
}

export async function createLetterAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const payload = letterSchema.parse({
      date: formData.get("date"),
      title: formData.get("title") || null,
      content: formData.get("content"),
      imagePath: formData.get("imagePath") || null,
      slug: formData.get("slug") || null,
    });
    await createLetter({
      date: payload.date,
      title: payload.title ?? null,
      content: payload.content,
      image_path: payload.imagePath ?? null,
      slug: payload.slug ? toSlug(payload.slug) : null,
    });
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to create letter", error);
    return { ok: false, message: "Erro ao criar carta." };
  }
}

export async function updateLetterAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    const payload = letterSchema.partial().parse({
      date: formData.get("date") || undefined,
      title: formData.get("title") || null,
      content: formData.get("content") || undefined,
      imagePath: formData.get("imagePath") || null,
      slug: formData.get("slug") || null,
    });
    const updatePayload: Partial<Letter> = {};
    if (payload.date !== undefined) updatePayload.date = payload.date;
    if (payload.title !== undefined) updatePayload.title = payload.title ?? null;
    if (payload.content !== undefined) updatePayload.content = payload.content;
    if (payload.imagePath !== undefined) updatePayload.image_path = payload.imagePath ?? null;
    if (payload.slug !== undefined) {
      updatePayload.slug = payload.slug ? toSlug(payload.slug) : null;
    }
    await updateLetter(id, updatePayload);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to update letter", error);
    return { ok: false, message: "Erro ao atualizar carta." };
  }
}

export async function deleteLetterAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    await deleteLetter(id);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to delete letter", error);
    return { ok: false, message: "Erro ao excluir carta." };
  }
}

export async function createReasonAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const payload = reasonSchema.parse({
      text: formData.get("text"),
      position: Number(formData.get("position") || 0),
    });
    await createReason(payload.text, payload.position);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to create reason", error);
    return { ok: false, message: "Erro ao criar motivo." };
  }
}

export async function updateReasonAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    const payload = reasonSchema.partial().parse({
      text: formData.get("text") || undefined,
      position: formData.get("position") ? Number(formData.get("position")) : undefined,
    });
    const updatePayload: Partial<Reason> = {};
    if (payload.text !== undefined) updatePayload.text = payload.text;
    if (payload.position !== undefined) updatePayload.position = payload.position;
    await updateReason(id, updatePayload);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to update reason", error);
    return { ok: false, message: "Erro ao atualizar motivo." };
  }
}

export async function deleteReasonAction(formData: FormData): Promise<ActionResult> {
  await requireAdminSession();
  try {
    const id = idSchema.parse(String(formData.get("id")));
    await deleteReason(id);
    revalidateSite();
    return { ok: true };
  } catch (error) {
    logError("Failed to delete reason", error);
    return { ok: false, message: "Erro ao excluir motivo." };
  }
}

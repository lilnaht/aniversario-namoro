import { z } from "zod";

export const quoteSchema = z.object({
  text: z.string().trim().min(1, "Texto obrigatorio.").max(200),
});

export const settingsSchema = z.object({
  relationshipStartDate: z.string().trim().optional().nullable(),
  weddingDate: z.string().trim().optional().nullable(),
  spotifyTrackUrl: z.string().trim().optional().nullable(),
});

export const carouselSchema = z.object({
  imagePath: z.string().trim().min(1),
  caption: z.string().trim().optional().nullable(),
  position: z.number().int().min(0),
});

export const timelineSchema = z.object({
  date: z.string().trim().min(1, "Data obrigatoria."),
  title: z.string().trim().optional().nullable(),
  content: z.string().trim().min(1, "Conteudo obrigatorio."),
  imagePath: z.string().trim().optional().nullable(),
});

export const letterSchema = z.object({
  date: z.string().trim().min(1, "Data obrigatoria."),
  title: z.string().trim().optional().nullable(),
  content: z.string().trim().min(1, "Conteudo obrigatorio.").max(8000),
  imagePath: z.string().trim().optional().nullable(),
  slug: z.string().trim().optional().nullable(),
});

export const reasonSchema = z.object({
  text: z.string().trim().min(1, "Texto obrigatorio.").max(200),
  position: z.number().int().min(0),
});

export const idSchema = z.string().uuid();

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

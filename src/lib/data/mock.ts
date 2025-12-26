import { randomUUID } from "crypto";
import type { CarouselImage, Letter, Quote, Reason, Settings, TimelinePost } from "@/lib/types";

const nowIso = () => new Date().toISOString();

const defaultSettings: Settings = {
  id: 1,
  relationship_start_date: "2024-01-01",
  wedding_date: "2026-06-15",
  spotify_track_url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
  updated_at: nowIso(),
};

let settings: Settings = { ...defaultSettings };
let carouselImages: CarouselImage[] = [];
let quotes: Quote[] = [
  { id: randomUUID(), text: "Voce e meu lugar favorito.", created_at: nowIso() },
  { id: randomUUID(), text: "Cada dia ao seu lado e especial.", created_at: nowIso() },
];
let timelinePosts: TimelinePost[] = [];
let letters: Letter[] = [];
let reasons: Reason[] = [
  { id: randomUUID(), text: "Seu sorriso ilumina meus dias.", position: 1, created_at: nowIso() },
  { id: randomUUID(), text: "Seu abraco me acalma.", position: 2, created_at: nowIso() },
  { id: randomUUID(), text: "Voce sempre me apoia.", position: 3, created_at: nowIso() },
];

export const mockDb = {
  getSettings: () => settings,
  updateSettings: (next: Partial<Settings>) => {
    settings = { ...settings, ...next, updated_at: nowIso() };
    return settings;
  },
  listCarousel: () => [...carouselImages].sort((a, b) => a.position - b.position),
  createCarousel: (payload: Omit<CarouselImage, "id" | "created_at">) => {
    const item: CarouselImage = {
      ...payload,
      id: randomUUID(),
      created_at: nowIso(),
    };
    carouselImages = [...carouselImages, item];
    return item;
  },
  updateCarousel: (id: string, payload: Partial<CarouselImage>) => {
    carouselImages = carouselImages.map((item) =>
      item.id === id ? { ...item, ...payload } : item,
    );
    return carouselImages.find((item) => item.id === id) ?? null;
  },
  deleteCarousel: (id: string) => {
    carouselImages = carouselImages.filter((item) => item.id !== id);
  },
  listQuotes: () => [...quotes],
  createQuote: (text: string) => {
    const item: Quote = { id: randomUUID(), text, created_at: nowIso() };
    quotes = [...quotes, item];
    return item;
  },
  updateQuote: (id: string, text: string) => {
    quotes = quotes.map((item) => (item.id === id ? { ...item, text } : item));
    return quotes.find((item) => item.id === id) ?? null;
  },
  deleteQuote: (id: string) => {
    quotes = quotes.filter((item) => item.id !== id);
  },
  listTimeline: () => [...timelinePosts].sort((a, b) => a.date.localeCompare(b.date)),
  createTimeline: (payload: Omit<TimelinePost, "id" | "created_at">) => {
    const item: TimelinePost = { ...payload, id: randomUUID(), created_at: nowIso() };
    timelinePosts = [...timelinePosts, item];
    return item;
  },
  updateTimeline: (id: string, payload: Partial<TimelinePost>) => {
    timelinePosts = timelinePosts.map((item) =>
      item.id === id ? { ...item, ...payload } : item,
    );
    return timelinePosts.find((item) => item.id === id) ?? null;
  },
  deleteTimeline: (id: string) => {
    timelinePosts = timelinePosts.filter((item) => item.id !== id);
  },
  listLetters: () => [...letters].sort((a, b) => a.date.localeCompare(b.date)),
  createLetter: (payload: Omit<Letter, "id" | "created_at">) => {
    const item: Letter = { ...payload, id: randomUUID(), created_at: nowIso() };
    letters = [...letters, item];
    return item;
  },
  updateLetter: (id: string, payload: Partial<Letter>) => {
    letters = letters.map((item) => (item.id === id ? { ...item, ...payload } : item));
    return letters.find((item) => item.id === id) ?? null;
  },
  deleteLetter: (id: string) => {
    letters = letters.filter((item) => item.id !== id);
  },
  listReasons: () => [...reasons].sort((a, b) => a.position - b.position),
  createReason: (text: string, position: number) => {
    const item: Reason = { id: randomUUID(), text, position, created_at: nowIso() };
    reasons = [...reasons, item];
    return item;
  },
  updateReason: (id: string, payload: Partial<Reason>) => {
    reasons = reasons.map((item) => (item.id === id ? { ...item, ...payload } : item));
    return reasons.find((item) => item.id === id) ?? null;
  },
  deleteReason: (id: string) => {
    reasons = reasons.filter((item) => item.id !== id);
  },
};

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createCarouselAction,
  createLetterAction,
  createQuoteAction,
  createReasonAction,
  createTimelineAction,
  deleteCarouselAction,
  deleteLetterAction,
  deleteQuoteAction,
  deleteReasonAction,
  deleteTimelineAction,
  logoutAction,
  saveSettingsAction,
  updateCarouselAction,
  updateLetterAction,
  updateQuoteAction,
  updateReasonAction,
  updateTimelineAction,
} from "@/app/admin/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import { getPublicImageUrl } from "@/lib/images";
import type { CarouselImage, Letter, Quote, Reason, Settings, TimelinePost } from "@/lib/types";

type AdminDashboardClientProps = {
  settings: Settings | null;
  carouselImages: CarouselImage[];
  quotes: Quote[];
  timelinePosts: TimelinePost[];
  letters: Letter[];
  reasons: Reason[];
};

export default function AdminDashboardClient({
  settings,
  carouselImages,
  quotes,
  timelinePosts,
  letters,
  reasons,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [newCarouselPath, setNewCarouselPath] = useState<string | null>(null);
  const [newTimelinePath, setNewTimelinePath] = useState<string | null>(null);
  const [newLetterPath, setNewLetterPath] = useState<string | null>(null);
  const [carouselPathOverrides, setCarouselPathOverrides] = useState<Record<string, string>>({});
  const [timelinePathOverrides, setTimelinePathOverrides] = useState<Record<string, string>>({});
  const [letterPathOverrides, setLetterPathOverrides] = useState<Record<string, string>>({});

  const runAction = async (
    action: (formData: FormData) => Promise<{ ok: boolean; message?: string }>,
    formData: FormData,
    successMessage: string,
  ) => {
    startTransition(async () => {
      const result = await action(formData);
      setMessage(result.ok ? successMessage : result.message ?? "Erro inesperado.");
      if (result.ok) {
        router.refresh();
      }
    });
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    action: (formData: FormData) => Promise<{ ok: boolean; message?: string }>,
    successMessage: string,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    runAction(action, formData, successMessage);
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-rose-700">Painel Admin</h2>
          <p className="text-sm text-rose-500/80">
            Gerencie o conteudo do site romantico.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            startTransition(async () => {
              await logoutAction();
              router.refresh();
            });
          }}
          className="rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm"
        >
          Sair
        </button>
      </div>

      {message ? (
        <div className="rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-sm text-rose-600">
          {message}
        </div>
      ) : null}

      <section className="grid gap-6 rounded-3xl border border-rose-100 bg-white/70 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-rose-700">Configuracoes</h3>
        <form onSubmit={(event) => handleSubmit(event, saveSettingsAction, "Configuracoes salvas.")}>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-rose-700">
              Data de inicio do namoro
              <input
                type="date"
                name="relationshipStartDate"
                defaultValue={settings?.relationship_start_date ?? ""}
                className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
              />
            </label>
            <label className="text-sm font-medium text-rose-700">
              Data do casamento
              <input
                type="date"
                name="weddingDate"
                defaultValue={settings?.wedding_date ?? ""}
                className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
              />
            </label>
            <label className="text-sm font-medium text-rose-700">
              Link do Spotify
              <input
                type="url"
                name="spotifyTrackUrl"
                defaultValue={settings?.spotify_track_url ?? ""}
                className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                placeholder="https://open.spotify.com/track/..."
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="mt-4 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-600 disabled:opacity-70"
          >
            Salvar
          </button>
        </form>
      </section>

      <section className="grid gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-rose-700">Carrossel</h3>
        </div>
        <form
          onSubmit={(event) => {
            if (newCarouselPath) {
              handleSubmit(event, createCarouselAction, "Imagem adicionada.");
              setNewCarouselPath(null);
            } else {
              event.preventDefault();
              setMessage("Envie uma imagem antes de salvar.");
            }
          }}
          className="grid gap-4 rounded-3xl border border-rose-100 bg-white/80 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUploader
              folder="carousel"
              label="Imagem do carrossel"
              onUploaded={setNewCarouselPath}
            />
            <div className="space-y-4">
              <label className="text-sm font-medium text-rose-700">
                Legenda
                <input
                  type="text"
                  name="caption"
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-rose-700">
                Posicao
                <input
                  type="number"
                  name="position"
                  defaultValue={carouselImages.length + 1}
                  min={0}
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              {newCarouselPath ? (
                <input type="hidden" name="imagePath" value={newCarouselPath} />
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Adicionar imagem
          </button>
        </form>

        <div className="grid gap-4">
          {carouselImages.map((item) => (
            <form
              key={item.id}
              onSubmit={(event) => handleSubmit(event, updateCarouselAction, "Imagem atualizada.")}
              className="grid gap-4 rounded-3xl border border-rose-100 bg-white/80 p-6"
            >
              <input type="hidden" name="id" value={item.id} />
              {carouselPathOverrides[item.id] ? (
                <input type="hidden" name="imagePath" value={carouselPathOverrides[item.id]} />
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <ImageUploader
                  folder="carousel"
                  label="Trocar imagem (opcional)"
                  onUploaded={(path) =>
                    setCarouselPathOverrides((prev) => ({ ...prev, [item.id]: path }))
                  }
                  previewUrl={getPublicImageUrl(item.image_path)}
                />
                <div className="space-y-4">
                  <label className="text-sm font-medium text-rose-700">
                    Legenda
                    <input
                      type="text"
                      name="caption"
                      defaultValue={item.caption ?? ""}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <label className="text-sm font-medium text-rose-700">
                    Posicao
                    <input
                      type="number"
                      name="position"
                      defaultValue={item.position}
                      min={0}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const formData = new FormData();
                      formData.append("id", item.id);
                      runAction(deleteCarouselAction, formData, "Imagem removida.");
                    }}
                    className="rounded-2xl border border-rose-200 px-4 py-2 text-sm text-rose-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-rose-100 bg-white/70 p-6">
        <h3 className="text-xl font-semibold text-rose-700">Frases romanticas</h3>
        <form onSubmit={(event) => handleSubmit(event, createQuoteAction, "Frase adicionada.")}>
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              name="text"
              required
              className="flex-1 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
              placeholder="Digite uma frase"
            />
            <button
              type="submit"
              className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </form>
        <div className="grid gap-3">
          {quotes.map((quote) => (
            <form
              key={quote.id}
              onSubmit={(event) => handleSubmit(event, updateQuoteAction, "Frase atualizada.")}
              className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-white/80 p-4 md:flex-row"
            >
              <input type="hidden" name="id" value={quote.id} />
              <input
                name="text"
                defaultValue={quote.text}
                className="flex-1 rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("id", quote.id);
                    runAction(deleteQuoteAction, formData, "Frase excluida.");
                  }}
                  className="rounded-2xl border border-rose-200 px-4 py-2 text-sm text-rose-700"
                >
                  Excluir
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <h3 className="text-xl font-semibold text-rose-700">Nossa historia</h3>
        <form
          onSubmit={(event) => {
            handleSubmit(event, createTimelineAction, "Post criado.");
            setNewTimelinePath(null);
          }}
          className="grid gap-4 rounded-3xl border border-rose-100 bg-white/80 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUploader
              folder="timeline"
              label="Imagem do post"
              aspect={4 / 3}
              onUploaded={setNewTimelinePath}
            />
            <div className="space-y-4">
              <label className="text-sm font-medium text-rose-700">
                Data
                <input
                  type="date"
                  name="date"
                  required
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-rose-700">
                Titulo
                <input
                  type="text"
                  name="title"
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-rose-700">
                Texto
                <textarea
                  name="content"
                  rows={4}
                  required
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              {newTimelinePath ? (
                <input type="hidden" name="imagePath" value={newTimelinePath} />
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Adicionar post
          </button>
        </form>
        <div className="grid gap-4">
          {timelinePosts.map((post) => (
            <form
              key={post.id}
              onSubmit={(event) => handleSubmit(event, updateTimelineAction, "Post atualizado.")}
              className="grid gap-4 rounded-3xl border border-rose-100 bg-white/80 p-6"
            >
              <input type="hidden" name="id" value={post.id} />
              {timelinePathOverrides[post.id] ? (
                <input type="hidden" name="imagePath" value={timelinePathOverrides[post.id]} />
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <ImageUploader
                  folder="timeline"
                  label="Trocar imagem (opcional)"
                  aspect={4 / 3}
                  onUploaded={(path) =>
                    setTimelinePathOverrides((prev) => ({ ...prev, [post.id]: path }))
                  }
                  previewUrl={getPublicImageUrl(post.image_path)}
                />
                <div className="space-y-4">
                  <label className="text-sm font-medium text-rose-700">
                    Data
                    <input
                      type="date"
                      name="date"
                      defaultValue={post.date}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <label className="text-sm font-medium text-rose-700">
                    Titulo
                    <input
                      type="text"
                      name="title"
                      defaultValue={post.title ?? ""}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <label className="text-sm font-medium text-rose-700">
                    Texto
                    <textarea
                      name="content"
                      rows={4}
                      defaultValue={post.content}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const formData = new FormData();
                        formData.append("id", post.id);
                        runAction(deleteTimelineAction, formData, "Post excluido.");
                      }}
                      className="rounded-2xl border border-rose-200 px-4 py-2 text-sm text-rose-700"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <h3 className="text-xl font-semibold text-rose-700">Cartas</h3>
        <form
          onSubmit={(event) => handleSubmit(event, createLetterAction, "Carta criada.")}
          className="grid gap-4 rounded-3xl border border-rose-100 bg-white/80 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUploader
              folder="letters"
              label="Imagem da carta"
              aspect={3 / 4}
              onUploaded={setNewLetterPath}
            />
            <div className="space-y-4">
              <label className="text-sm font-medium text-rose-700">
                Data
                <input
                  type="date"
                  name="date"
                  required
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-rose-700">
                Titulo
                <input
                  type="text"
                  name="title"
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              <label className="text-sm font-medium text-rose-700">
                Slug (opcional)
                <input
                  type="text"
                  name="slug"
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                  placeholder="minha-carta"
                />
              </label>
              <label className="text-sm font-medium text-rose-700">
                Conteudo
                <textarea
                  name="content"
                  rows={5}
                  required
                  className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                />
              </label>
              {newLetterPath ? (
                <input type="hidden" name="imagePath" value={newLetterPath} />
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Adicionar carta
          </button>
        </form>
        <div className="grid gap-4">
          {letters.map((letter) => (
            <form
              key={letter.id}
              onSubmit={(event) => handleSubmit(event, updateLetterAction, "Carta atualizada.")}
              className="grid gap-4 rounded-3xl border border-rose-100 bg-white/80 p-6"
            >
              <input type="hidden" name="id" value={letter.id} />
              {letterPathOverrides[letter.id] ? (
                <input type="hidden" name="imagePath" value={letterPathOverrides[letter.id]} />
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <ImageUploader
                  folder="letters"
                  label="Trocar imagem (opcional)"
                  aspect={3 / 4}
                  onUploaded={(path) =>
                    setLetterPathOverrides((prev) => ({ ...prev, [letter.id]: path }))
                  }
                  previewUrl={getPublicImageUrl(letter.image_path)}
                />
                <div className="space-y-4">
                  <label className="text-sm font-medium text-rose-700">
                    Data
                    <input
                      type="date"
                      name="date"
                      defaultValue={letter.date}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <label className="text-sm font-medium text-rose-700">
                    Titulo
                    <input
                      type="text"
                      name="title"
                      defaultValue={letter.title ?? ""}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <label className="text-sm font-medium text-rose-700">
                    Slug
                    <input
                      type="text"
                      name="slug"
                      defaultValue={letter.slug ?? ""}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <label className="text-sm font-medium text-rose-700">
                    Conteudo
                    <textarea
                      name="content"
                      rows={5}
                      defaultValue={letter.content}
                      className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const formData = new FormData();
                        formData.append("id", letter.id);
                        runAction(deleteLetterAction, formData, "Carta excluida.");
                      }}
                      className="rounded-2xl border border-rose-200 px-4 py-2 text-sm text-rose-700"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-rose-100 bg-white/70 p-6">
        <h3 className="text-xl font-semibold text-rose-700">Motivos</h3>
        <form onSubmit={(event) => handleSubmit(event, createReasonAction, "Motivo adicionado.")}>
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_auto]">
            <input
              name="text"
              required
              className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
              placeholder="Digite um motivo"
            />
            <input
              name="position"
              type="number"
              min={0}
              defaultValue={reasons.length + 1}
              className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm"
            />
            <button
              type="submit"
              className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Adicionar
            </button>
          </div>
        </form>
        <div className="grid gap-3">
          {reasons.map((reason) => (
            <form
              key={reason.id}
              onSubmit={(event) => handleSubmit(event, updateReasonAction, "Motivo atualizado.")}
              className="grid gap-3 rounded-2xl border border-rose-100 bg-white/80 p-4 md:grid-cols-[2fr_1fr_auto_auto]"
            >
              <input type="hidden" name="id" value={reason.id} />
              <input
                name="text"
                defaultValue={reason.text}
                className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm"
              />
              <input
                name="position"
                type="number"
                min={0}
                defaultValue={reason.position}
                className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => {
                  const formData = new FormData();
                  formData.append("id", reason.id);
                  runAction(deleteReasonAction, formData, "Motivo excluido.");
                }}
                className="rounded-2xl border border-rose-200 px-4 py-2 text-sm text-rose-700"
              >
                Excluir
              </button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}

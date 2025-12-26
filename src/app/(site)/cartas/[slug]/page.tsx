import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLetterBySlugOrId } from "@/lib/data/public";
import { getPublicImageUrl } from "@/lib/images";

type LetterPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CartaPage({ params }: LetterPageProps) {
  const { slug } = await params;
  const letter = await getLetterBySlugOrId(slug);

  if (!letter) {
    notFound();
  }

  const imageUrl = getPublicImageUrl(letter.image_path);

  return (
    <div className="space-y-10 pb-10">
      <Link
        href="/cartas"
        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm text-rose-700 shadow-sm"
      >
        Voltar para cartas
      </Link>
      <article className="card-shell p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500/70">
              {new Date(letter.date).toLocaleDateString("pt-BR")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-rose-700">
              {letter.title ?? "Carta do coracao"}
            </h1>
          </div>
          {imageUrl ? (
            <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-3xl border border-rose-100">
              <Image
                src={imageUrl}
                alt={letter.title ?? "Foto da carta"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 320px"
              />
            </div>
          ) : null}
        </div>
        <div className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-rose-700 md:text-base">
          {letter.content}
        </div>
      </article>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { getLetters } from "@/lib/data/public";
import { getPublicImageUrl } from "@/lib/images";

export default async function CartasPage() {
  const letters = await getLetters();

  return (
    <div className="space-y-10 pb-10">
      <section className="card-shell p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-rose-700">Cartas</h2>
        <p className="mt-2 text-sm text-rose-600/80">
          Palavras longas e sinceras para guardar no coracao.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {letters.length === 0 ? (
          <div className="rounded-3xl border border-rose-100 bg-white/80 p-6 text-sm text-rose-500">
            Nenhuma carta cadastrada ainda.
          </div>
        ) : (
          letters.map((letter) => {
            const imageUrl = getPublicImageUrl(letter.image_path);
            const href = `/cartas/${letter.slug ?? letter.id}`;
            return (
              <Link
                key={letter.id}
                href={href}
                className="card-shell group flex h-full flex-col gap-4 p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-rose-500/70">
                  <span>{new Date(letter.date).toLocaleDateString("pt-BR")}</span>
                  <span>Ler carta</span>
                </div>
                <h3 className="text-xl font-semibold text-rose-700">
                  {letter.title ?? "Carta especial"}
                </h3>
                {imageUrl ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-rose-100">
                    <Image
                      src={imageUrl}
                      alt={letter.title ?? "Foto da carta"}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 90vw, 400px"
                    />
                  </div>
                ) : null}
                <p className="text-sm text-rose-700">
                  {letter.content.length > 160
                    ? `${letter.content.slice(0, 160)}...`
                    : letter.content}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

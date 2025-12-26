import Image from "next/image";
import { getTimelinePosts } from "@/lib/data/public";
import { getPublicImageUrl } from "@/lib/images";

export default async function HistoriaPage() {
  const posts = await getTimelinePosts();

  return (
    <div className="space-y-10 pb-10">
      <section className="card-shell p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-rose-700">Nossa Historia</h2>
        <p className="mt-2 text-sm text-rose-600/80">
          Uma linha do tempo com os momentos mais especiais.
        </p>
      </section>

      <div className="mx-auto grid w-full max-w-4xl gap-6">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-rose-100 bg-white/80 p-6 text-sm text-rose-500">
            Nenhum post cadastrado ainda.
          </div>
        ) : (
          posts.map((post) => {
            const imageUrl = getPublicImageUrl(post.image_path);
            return (
              <article key={post.id} className="card-shell p-6 md:p-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="inline-flex rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-rose-500/80">
                      {new Date(post.date).toLocaleDateString("pt-BR")}
                    </p>
                    <h3 className="text-xl font-semibold text-rose-700">
                      {post.title ?? "Momento inesquecivel"}
                    </h3>
                  </div>
                  {imageUrl ? (
                    <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-rose-100">
                        <Image
                          src={imageUrl}
                          alt={post.title ?? "Foto do nosso momento"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 90vw, 260px"
                        />
                      </div>
                      <div className="text-sm leading-relaxed text-rose-700 whitespace-pre-wrap md:max-w-prose md:text-base">
                        {post.content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed text-rose-700 whitespace-pre-wrap md:max-w-prose md:text-base">
                      {post.content}
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

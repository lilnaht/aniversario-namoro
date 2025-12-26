import Carousel from "@/components/site/Carousel";
import QRCode from "@/components/site/QRCode";
import QuoteRotator from "@/components/site/QuoteRotator";
import ReasonsList from "@/components/site/ReasonsList";
import RelationshipCounter from "@/components/site/RelationshipCounter";
import { getCarouselImages, getQuotes, getReasons, getSettings } from "@/lib/data/public";
import { getPublicImageUrl } from "@/lib/images";
import { getSpotifyEmbedUrl } from "@/lib/spotify";

export default async function HomePage() {
  const [settings, carouselImages, quotes, reasons] = await Promise.all([
    getSettings(),
    getCarouselImages(),
    getQuotes(),
    getReasons(),
  ]);

  const carouselItems = carouselImages
    .map((item) => ({
      id: item.id,
      imageUrl: getPublicImageUrl(item.image_path),
      caption: item.caption,
    }))
    .filter((item) => Boolean(item.imageUrl));

  const spotifyTrackUrl = settings?.spotify_track_url ?? null;
  const spotifyEmbedUrl = getSpotifyEmbedUrl(spotifyTrackUrl);

  return (
    <div className="space-y-12 pb-12">
      <section className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="card-shell p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-rose-700">Nosso album de momentos</h2>
          <p className="mt-2 text-sm text-rose-600/80">
            Uma selecao das fotos que contam nossa historia.
          </p>
          <div className="mt-6">
            <Carousel
              items={carouselItems.map((item) => ({
                id: item.id,
                imageUrl: item.imageUrl as string,
                caption: item.caption,
              }))}
            />
          </div>
        </div>
        <div className="grid gap-6">
          <div className="card-shell p-6 md:p-8">
            <h2 className="text-xl font-semibold text-rose-700">Frases do coração</h2>
            <p className="mt-2 text-sm text-rose-600/80">
              Palavras que lembram o quanto você é especial.
            </p>
            <div className="mt-5">
              <QuoteRotator quotes={quotes.map((quote) => quote.text)} />
            </div>
          </div>
          <div className="card-shell p-6 md:p-8">
            <h2 className="text-xl font-semibold text-rose-700">Tempo juntos</h2>
            <p className="mt-2 text-sm text-rose-600/80">
              Cada dia ao seu lado vale por uma vida.
            </p>
            <div className="mt-5">
              <RelationshipCounter startDate={settings?.relationship_start_date ?? null} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="card-shell p-6 md:p-8">
          <h2 className="text-xl font-semibold text-rose-700">Nossa trilha sonora</h2>
          <p className="mt-2 text-sm text-rose-600/80">
            Escaneie o QR Code e ouca a musica que lembra nos dois.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            {spotifyTrackUrl ? <QRCode value={spotifyTrackUrl} /> : null}
            {spotifyEmbedUrl ? (
              <iframe
                title="Spotify"
                src={spotifyEmbedUrl}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-3xl border border-rose-100 bg-white/80"
              />
            ) : (
              <p className="text-sm text-rose-500/80">
                Dúvido adivinhar qual é 👀 kkk.
              </p>
            )}
          </div>
        </div>
        <div className="card-shell p-6 md:p-8">
          <h2 className="text-xl font-semibold text-rose-700">Motivos por que eu te amo</h2>
          <p className="mt-2 text-sm text-rose-600/80">
            Pequenos detalhes que fazem meu coracao sorrir.
          </p>
          <ReasonsList reasons={reasons} />
        </div>
      </section>
    </div>
  );
}

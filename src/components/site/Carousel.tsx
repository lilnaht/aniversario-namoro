"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePrefersReducedMotion } from "@/lib/hooks";

export type CarouselItem = {
  id: string;
  imageUrl: string;
  caption?: string | null;
};

type CarouselProps = {
  items: CarouselItem[];
};

export default function Carousel({ items }: CarouselProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || prefersReducedMotion) {
      return;
    }
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [emblaApi, prefersReducedMotion]);

  if (items.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-3xl border border-rose-100 bg-white/70 text-sm text-rose-500">
        Nenhuma foto no carrossel ainda.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="-ml-4 flex">
          {items.map((item, index) => (
            <div key={item.id} className="min-w-0 flex-[0_0_100%] pl-4">
              <div className="relative h-72 overflow-hidden rounded-3xl border border-rose-100 bg-rose-50/70 md:h-96">
                <Image
                  src={item.imageUrl}
                  alt={item.caption ?? "Foto do casal"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 600px"
                  priority={index === 0}
                />
                {item.caption ? (
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/80 px-4 py-1 text-xs font-medium text-rose-700 shadow">
                    {item.caption}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={scrollPrev}
          className="rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          aria-label="Foto anterior"
        >
          Voltar
        </button>
        <div className="flex gap-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                selectedIndex === index ? "bg-rose-500" : "bg-rose-200"
              }`}
              aria-label={`Ir para a foto ${index + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          className="rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          aria-label="Proxima foto"
        >
          Avancar
        </button>
      </div>
    </div>
  );
}

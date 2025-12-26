"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type QuoteRotatorProps = {
  quotes: string[];
};

export default function QuoteRotator({ quotes }: QuoteRotatorProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || quotes.length <= 1) {
      return;
    }
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, quotes.length]);

  if (quotes.length === 0) {
    return (
      <p className="text-sm text-rose-500/80">Adicione frases romanticas no admin.</p>
    );
  }

  const quote = quotes[index] ?? quotes[0];

  return (
    <div className="rounded-3xl border border-rose-100 bg-white/80 px-6 py-5 text-center shadow-sm">
      <p className="text-base text-rose-700 md:text-lg">
        &quot;{quote}&quot;
      </p>
    </div>
  );
}

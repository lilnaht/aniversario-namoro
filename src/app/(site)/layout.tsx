import type { ReactNode } from "react";
import Link from "next/link";
import FloatingHearts from "@/components/site/FloatingHearts";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell relative overflow-hidden">
      <FloatingHearts />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow"
      >
        Pular para o conteudo
      </a>
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 pb-4 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-rose-500/80">
              Nathan & Gabriela
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-rose-700 md:text-4xl">
              Nossa história
            </h1>
          </div>
          <nav className="flex gap-3 text-sm font-medium text-rose-700">
            <Link
              className="rounded-full border border-rose-200 bg-white/70 px-4 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-white"
              href="/"
            >
              Inicio
            </Link>
            <Link
              className="rounded-full border border-rose-200 bg-white/70 px-4 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-white"
              href="/historia"
            >
              Nossa Historia
            </Link>
            <Link
              className="rounded-full border border-rose-200 bg-white/70 px-4 py-2 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-white"
              href="/cartas"
            >
              Cartas
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" className="relative z-10 flex-1 px-6 pb-20">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
      <footer className="relative z-10 py-10 text-center text-sm text-rose-600/80">
        Feito com carinho para lembrar cada detalhe do nosso amor.
      </footer>
    </div>
  );
}

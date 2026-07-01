import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectBento } from "@/components/ProjectBento";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  absoluteTitle: "Matecito.dev — Studio digital desde Argentina",
  description:
    "Comunidades, videojuegos y productos digitales construidos en público desde Pergamino, Argentina.",
  path: "/",
});

const TICKER = [
  "build in public",
  "pergamino · argentina",
  "comunidades",
  "videojuegos",
  "productos digitales",
  "open dev",
];

export default function Home() {
  return (
    <>
      <section className="border-b border-line">
        <div className="page-wrap grid gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-end md:py-24">
          <div className="reveal">
            <p className="section-label mb-6">Studio · desde 2025</p>
            <h1 className="text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-ink">
              Construimos
              <br />
              <span className="text-accent">en público</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-muted">
              Un ecosistema de proyectos digitales: plataformas locales, comunidades
              gaming y juegos propios. Sin humo, con proceso visible.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/proyectos" className="btn-primary">
                Ver proyectos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/labs" className="btn-ghost">
                Explorar Labs
              </Link>
            </div>
          </div>

          <div className="reveal reveal-delay-1">
            <div className="rounded-[2rem] border-2 border-ink bg-surface p-8 shadow-[8px_8px_0_0_var(--ink)]">
              <p className="section-label mb-6">Ahora</p>
              <ul className="space-y-5">
                {[
                  { name: "Recién Llegué", pct: 70 },
                  { name: "ZeroLagARG", pct: 80 },
                  { name: "Etheria", pct: 30 },
                ].map((item) => (
                  <li key={item.name}>
                    <div className="mb-2 flex justify-between font-mono text-xs">
                      <span className="font-semibold text-ink">{item.name}</span>
                      <span className="text-ink-faint">{item.pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-paper-warm">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-8 font-mono text-xs leading-relaxed text-ink-faint">
                Pergamino, Buenos Aires
                <br />
                Argentina 🇦🇷
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-line bg-ink py-3 text-surface">
        <div className="ticker-track gap-10 font-mono text-xs font-bold uppercase tracking-[0.25em]">
          {[...TICKER, ...TICKER].map((word, i) => (
            <span key={`${word}-${i}`} className="flex items-center gap-10">
              {word}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </section>

      <ProjectBento />

      <section className="border-t border-line bg-surface py-20 md:py-28">
        <div className="page-wrap grid gap-12 md:grid-cols-2 md:items-center">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight text-ink">
            No vendemos promesas.
            <br />
            <span className="text-ink-muted">Mostramos el proceso.</span>
          </h2>
          <div className="space-y-6 text-base leading-relaxed text-ink-muted">
            <p>
              Cada proyecto nace con una necesidad real: una ciudad, una comunidad de
              jugadores, un mundo por conquistar. Documentamos decisiones, errores y avances.
            </p>
            <p>
              Labs es el taller donde probamos antes de escalar. Proyectos es donde lo que
              funciona se convierte en producto.
            </p>
            <Link href="/labs" className="btn-primary">
              Ir a Labs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

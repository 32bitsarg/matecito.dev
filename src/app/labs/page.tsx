import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LAB_NOTES } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Labs",
  description:
    "Bitácora de experimentos del studio Matecito: infraestructura, juegos, IA y procesos de desarrollo en público.",
  path: "/labs",
});

export default function LabsPage() {
  return (
    <>
      <section className="border-b border-line bg-ink text-surface">
        <div className="page-wrap py-16 md:py-24">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-ink-faint">
            Taller · bitácora
          </p>
          <h1 className="max-w-2xl text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[0.95] tracking-tight">
            Labs
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70">
            Un cuaderno abierto de lo que probamos antes de productizar: infra, juegos,
            IA y procesos del studio.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="page-wrap max-w-3xl">
          <p className="section-label mb-10">Entradas recientes</p>
          <ol className="relative border-l-2 border-ink pl-8">
            {LAB_NOTES.map((note, i) => (
              <li key={note.title} className={`relative pb-12 ${i === LAB_NOTES.length - 1 ? "pb-0" : ""}`}>
                <span className="absolute -left-[1.6rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-paper">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-ink-faint">
                  {note.date}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-ink md:text-2xl">{note.title}</h2>
                  <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    {note.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{note.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-paper-warm py-16">
        <div className="page-wrap">
          <div className="rounded-[2rem] border-2 border-dashed border-line-strong bg-surface p-10 text-center md:p-14">
            <p className="section-label mb-4">Próximamente</p>
            <h2 className="text-2xl font-bold text-ink md:text-3xl">Devlogs semanales</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
              Publicaremos avances cortos: qué se rompió, qué se aprendió y qué sigue.
              Mientras tanto, el detalle de cada producto vive en Proyectos.
            </p>
            <Link href="/proyectos" className="btn-primary mt-8">
              Ver proyectos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

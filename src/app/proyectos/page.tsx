import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Proyectos",
  description:
    "Portfolio del ecosistema Matecito: Recién Llegué, ZeroLagARG, Conquest of Etheria y Labs. Studio digital desde Argentina.",
  path: "/proyectos",
});

export default function ProyectosPage() {
  return (
    <>
      <section className="border-b-2 border-ink bg-surface">
        <div className="page-wrap py-16 md:py-20">
          <p className="section-label mb-4">Portfolio</p>
          <h1 className="max-w-3xl text-[clamp(2.5rem,7vw,4rem)] font-bold leading-[0.95] tracking-tight text-ink">
            Cuatro frentes,
            <span className="text-accent"> un studio</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-ink-muted">
            Cada línea resuelve un problema distinto. Algunos ya están en producción, otros
            siguen tomando forma en abierto.
          </p>
        </div>
      </section>

      <div>
        {PROJECTS.map((project, index) => {
          const reversed = index % 2 === 1;
          const content = (
            <section
              key={project.id}
              className="border-b border-line"
              style={{ backgroundColor: index % 2 === 0 ? "var(--paper)" : "var(--surface)" }}
            >
              <div
                className={`page-wrap grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24 ${
                  reversed ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-ink-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {project.status === "live" ? (
                      <span className="badge-live">Live</span>
                    ) : (
                      <span className="badge-wip">En desarrollo</span>
                    )}
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
                    {project.title}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-ink-muted">{project.description}</p>
                  <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                    {project.tag} · {project.year}
                  </p>
                  {project.href && (
                    <Link
                      href={project.href}
                      target={project.external ? "_blank" : undefined}
                      rel={project.external ? "noopener noreferrer" : undefined}
                      className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-paper-warm"
                    >
                      Visitar
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                <div
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] border-2 border-ink"
                  style={{ backgroundColor: project.tint }}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  ) : (
                    <span className="select-none text-[clamp(4rem,12vw,7rem)] leading-none">
                      {project.emoji}
                    </span>
                  )}
                </div>
              </div>
            </section>
          );
          return content;
        })}
      </div>
    </>
  );
}

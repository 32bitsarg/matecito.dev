"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/content";

function StatusBadge({ status }: { status: Project["status"] }) {
  return status === "live" ? (
    <span className="badge-live">Live</span>
  ) : (
    <span className="badge-wip">WIP</span>
  );
}

function BentoCard({
  project,
  className = "",
  large = false,
}: {
  project: Project;
  className?: string;
  large?: boolean;
}) {
  const inner = (
    <div
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border-2 border-ink p-6 transition-transform hover:-translate-y-1 md:p-8 ${className}`}
      style={{ backgroundColor: project.tint }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-4xl md:text-5xl">{project.emoji}</span>
        <StatusBadge status={project.status} />
      </div>
      <div className="mt-auto pt-8">
        <p className="section-label mb-2">{project.tag}</p>
        <h3 className={`font-bold tracking-tight text-ink ${large ? "text-3xl md:text-4xl" : "text-2xl"}`}>
          {project.title}
        </h3>
        <p className={`mt-3 text-ink-muted ${large ? "max-w-md text-base" : "text-sm"}`}>
          {project.description}
        </p>
        {project.href && (
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-accent">
            Explorar
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        )}
      </div>
      {project.image && large && (
        <Image
          src={project.image}
          alt=""
          width={120}
          height={120}
          className="pointer-events-none absolute bottom-6 right-6 opacity-90 md:bottom-8 md:right-8"
        />
      )}
    </div>
  );

  if (project.href) {
    return (
      <Link
        href={project.href}
        {...(project.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="block h-full"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}

export function ProjectBento() {
  const [a, b, c, d] = PROJECTS;

  return (
    <section className="py-20 md:py-28">
      <div className="page-wrap">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label mb-3">Ecosistema</p>
            <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Lo que hacemos
            </h2>
          </div>
          <Link href="/proyectos" className="btn-ghost text-sm">
            Ver detalle
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-7 md:row-span-2">
            <BentoCard project={a} large />
          </div>
          <div className="md:col-span-5">
            <BentoCard project={b} />
          </div>
          <div className="md:col-span-5">
            <BentoCard project={c} />
          </div>
          <div className="md:col-span-12">
            <BentoCard project={d} large className="md:min-h-[200px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

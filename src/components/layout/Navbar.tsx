"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/content";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/labs", label: "Labs" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="page-wrap flex h-[4.25rem] items-center justify-between">
        <Link href="/" className="flex items-baseline gap-0">
          <span className="text-lg font-bold tracking-tight text-ink">matecito</span>
          <span className="text-lg font-bold tracking-tight text-accent">.dev</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-semibold transition-colors",
                active(link.href) ? "text-ink" : "text-ink-muted hover:text-ink"
              )}
            >
              {link.label}
              {active(link.href) && (
                <span className="absolute -bottom-[1.35rem] left-0 right-0 h-0.5 bg-accent" />
              )}
            </Link>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !px-4 !py-2 text-xs"
          >
            Contacto
          </a>
        </nav>

        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={cn("h-0.5 w-6 bg-ink transition-transform", open && "translate-y-2 rotate-45")} />
          <span className={cn("h-0.5 w-6 bg-ink transition-opacity", open && "opacity-0")} />
          <span className={cn("h-0.5 w-6 bg-ink transition-transform", open && "-translate-y-2 -rotate-45")} />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-6 py-4 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block border-b border-line py-3 text-lg font-semibold last:border-0",
                active(link.href) ? "text-accent" : "text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn-whatsapp mt-4 w-full justify-center"
          >
            Contacto por WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}

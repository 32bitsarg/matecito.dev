import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-ink bg-surface">
      <div className="page-wrap py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-3xl font-bold tracking-tight text-ink">
              matecito<span className="text-accent">.dev</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              Studio digital desde Pergamino, Argentina. Comunidades, juegos y productos
              construidos en público.
            </p>
          </div>

          <div>
            <p className="section-label mb-4">Navegar</p>
            <ul className="space-y-2 text-sm font-semibold text-ink-muted">
              <li><Link href="/proyectos" className="hover:text-accent">Proyectos</Link></li>
              <li><Link href="/labs" className="hover:text-accent">Labs</Link></li>
              <li><Link href="/privacidad" className="hover:text-accent">Privacidad</Link></li>
            </ul>
          </div>

          <div>
            <p className="section-label mb-4">Ecosistema</p>
            <ul className="space-y-2 text-sm font-semibold text-ink-muted">
              <li>
                <a href="https://recienllegue.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  Recién Llegué
                </a>
              </li>
              <li className="text-ink-faint">ZeroLagARG</li>
              <li className="text-ink-faint">Conquest of Etheria</li>
            </ul>
          </div>

          <div>
            <p className="section-label mb-4">Contacto</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-ink-muted hover:text-accent"
            >
              WhatsApp
              <br />
              <span className="font-mono text-xs font-normal text-ink-faint">+54 2477 699586</span>
            </a>
          </div>
        </div>

        <hr className="rule my-8" />

        <div className="flex flex-col gap-2 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} matecito.dev</span>
          <span className="font-mono">Hecho con mate 🧉 · build in public</span>
        </div>
      </div>
    </footer>
  );
}

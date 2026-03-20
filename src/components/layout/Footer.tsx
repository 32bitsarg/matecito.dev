import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-background py-16 text-[10px] text-muted font-mono uppercase tracking-[0.2em] border-t border-border/40 font-bold">
            <div className="container mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex flex-col gap-4">
                    <p className="font-sans text-xl font-bold text-white tracking-tighter capitalize mb-0">
                        matecito<span className="text-accent">.dev</span>
                    </p>
                    <p className="max-w-xs normal-case font-light text-xs tracking-normal leading-relaxed text-muted opacity-80">
                        Especialistas en Landing Pages de alta conversión y SEO para <strong>Pergamino</strong>, <strong>Buenos Aires</strong> y toda Argentina. Ingeniería de software con infraestructura local en Sudamérica.
                    </p>
                    <p className="mt-4">© {new Date().getFullYear()} Soluciones Digitales.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-16">
                    <div className="flex flex-col gap-4">
                        <span className="text-white opacity-20 mb-2">Servicios</span>
                        <Link href="/#servicios" className="hover:text-[var(--accent)] transition-colors">Landings SEO</Link>
                        <Link href="/#servicios" className="hover:text-[var(--accent)] transition-colors">Arquitectura</Link>
                        <Link href="/insights" className="hover:text-[var(--accent)] transition-colors">Insights</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-white opacity-20 mb-2">Legal</span>
                        <Link href="#" className="hover:text-[var(--accent)] transition-colors">Términos</Link>
                        <Link href="#" className="hover:text-[var(--accent)] transition-colors">Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

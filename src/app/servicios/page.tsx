import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Search, Layout, Megaphone, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

export default function ServiciosPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)] relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--accent)_0.5px,transparent_0.5px),linear-gradient(to_bottom,var(--accent)_0.5px,transparent_0.5px)] opacity-[0.03] bg-[size:24px_24px]"></div>

            <section className="relative z-10 container mx-auto px-6 pt-4 pb-24 max-w-7xl">
                <div className="mb-2">
                    <Breadcrumbs items={[{ label: "Servicios", href: "/servicios" }]} />
                </div>
                <div className="flex flex-col gap-6 max-w-3xl mb-24">
                    <h1 className="text-5xl font-bold tracking-tighter text-[var(--accent)] sm:text-8xl uppercase">
                        Servicios <br /><span className="text-[var(--foreground)] opacity-40">Estratégicos</span>
                    </h1>
                    <p className="font-mono text-sm md:text-base text-[var(--foreground)] opacity-60 leading-relaxed uppercase tracking-[0.3em] font-medium">
                        Soluciones de ingeniería a medida para desafíos complejos.
                    </p>
                </div>

                {/* SPECIALIZED VERTICALS (EMBUDO) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <Link href="/seo" className="group p-10 border border-[var(--accent)]/5 bg-[var(--accent)]/[0.02] hover:bg-[var(--accent)]/5 transition-all flex flex-col gap-10 rounded-[2.5rem] shadow-sm">
                        <Search className="w-10 h-10 text-[var(--accent)] opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-[var(--accent)] uppercase tracking-tight">SEO & Performance</h3>
                            <p className="text-[var(--foreground)] opacity-60 text-sm leading-relaxed font-medium">Auditorías técnicas y optimización de infraestructura para buscadores.</p>
                        </div>
                        <span className="mt-auto text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform font-bold">
                            Saber más <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                    <Link href="/landings" className="group p-10 border border-[var(--accent)]/5 bg-[var(--accent)]/[0.02] hover:bg-[var(--accent)]/5 transition-all flex flex-col gap-10 rounded-[2.5rem] shadow-sm">
                        <Layout className="w-10 h-10 text-[var(--accent)] opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-[var(--accent)] uppercase tracking-tight">Landings de Élite</h3>
                            <p className="text-[var(--foreground)] opacity-60 text-sm leading-relaxed font-medium">Diseño y desarrollo de alta conversión con carga instantánea.</p>
                        </div>
                        <span className="mt-auto text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform font-bold">
                            Saber más <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                    <Link href="/marketing" className="group p-10 border border-[var(--accent)]/5 bg-[var(--accent)]/[0.02] hover:bg-[var(--accent)]/5 transition-all flex flex-col gap-10 rounded-[2.5rem] shadow-sm">
                        <Megaphone className="w-10 h-10 text-[var(--accent)] opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold text-[var(--accent)] uppercase tracking-tight">Ingeniería de Ventas</h3>
                            <p className="text-[var(--foreground)] opacity-60 text-sm leading-relaxed font-medium">Embudos automatizados y analítica avanzada para tu negocio.</p>
                        </div>
                        <span className="mt-auto text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform font-bold">
                            Saber más <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 border-t border-[var(--accent)]/10 pt-24">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold text-[var(--accent)] uppercase tracking-tight">Desarrollo Full-Stack</h2>
                        <p className="text-[var(--foreground)] opacity-60 font-medium leading-relaxed text-sm">
                            Construimos aplicaciones web desde la arquitectura de base de datos hasta la interfaz de usuario.
                            Especialistas en Next.js, React y Node.js.
                        </p>
                    </div>
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold text-[var(--accent)] uppercase tracking-tight">Consultoría Técnica</h2>
                        <p className="text-[var(--foreground)] opacity-60 font-medium leading-relaxed text-sm">
                            Auditorías de código, optimización de performance y guía estratégica para equipos de desarrollo.
                        </p>
                    </div>
                </div>

                {/* INSIGHTS CTA */}
                <Link href="/insights" className="mt-32 group block p-12 border border-[var(--accent)]/5 bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 transition-all rounded-[3rem] shadow-sm overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="h-20 w-20 flex items-center justify-center bg-[var(--background)] rounded-full border border-[var(--accent)]/10 text-[var(--accent)]">
                                <BookOpen className="w-10 h-10" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-3xl font-bold text-[var(--accent)] uppercase tracking-tighter">Nuestros Insights</h3>
                                <p className="text-[var(--foreground)] opacity-40 text-[10px] uppercase font-mono tracking-[0.3em] mt-1">Ingeniería, cultura y tecnología aplicada.</p>
                            </div>
                        </div>
                        <span className="text-[var(--accent)] opacity-40 group-hover:opacity-100 group-hover:translate-x-4 transition-all text-4xl">→</span>
                    </div>
                </Link>

                <div className="mt-40 bg-[var(--accent)] rounded-[3rem] p-20 text-center flex flex-col items-center gap-10 shadow-2xl shadow-[var(--accent)]/20">
                    <h2 className="text-4xl md:text-6xl font-bold text-[var(--background)] uppercase tracking-tighter leading-none">¿Listo para escalar tu infraestructura?</h2>
                    <a
                        href="https://wa.me/541124025239?text=Hola!%20Vengo%20de%20la%20sección%20de%20Servicios%20y%20quiero%20hablar%20con%20un%20experto."
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="lg" className="bg-[var(--background)] text-[var(--accent)] hover:opacity-90 rounded-full h-20 px-16 uppercase font-mono text-xs tracking-[0.3em] font-bold shadow-xl">
                            Hablar con un experto
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}

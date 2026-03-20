import { Button } from "@/components/ui/Button";

export default function ConsultoriaPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)] relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--accent)_0.5px,transparent_0.5px),linear-gradient(to_bottom,var(--accent)_0.5px,transparent_0.5px)] opacity-[0.03] bg-[size:24px_24px]"></div>
            <section className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-7xl">
                <div className="flex flex-col gap-6 max-w-3xl">
                    <h1 className="text-5xl font-bold tracking-tighter text-[var(--accent)] sm:text-8xl uppercase">
                        Consultoría <br /><span className="text-[var(--foreground)] opacity-40">de Alto Impacto</span>
                    </h1>
                    <p className="font-mono text-sm md:text-base text-[var(--foreground)] opacity-60 leading-relaxed uppercase tracking-[0.3em] font-medium">
                        Optimización de procesos y estrategia tecnológica para negocios en crecimiento.
                    </p>
                </div>

                <div className="mt-24 flex flex-col gap-32 border-t border-[var(--accent)]/10 pt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <h2 className="text-4xl font-bold text-[var(--accent)] uppercase tracking-tighter leading-none">Análisis de <br />Infraestructura</h2>
                        <div className="flex flex-col gap-8">
                            <p className="text-[var(--foreground)] opacity-60 font-medium text-lg leading-relaxed">
                                Evaluamos tu stack tecnológico actual para identificar cuellos de botella y oportunidades de mejora.
                                No solo detectamos problemas, diseñamos la solución.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <li className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-bold">
                                    <span className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full"></span> Auditoría de Código
                                </li>
                                <li className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-bold">
                                    <span className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full"></span> Optimización SEO
                                </li>
                                <li className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-bold">
                                    <span className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full"></span> Seguridad & Datos
                                </li>
                                <li className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-bold">
                                    <span className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full"></span> Escalabilidad Cloud
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <h2 className="text-4xl font-bold text-[var(--accent)] uppercase tracking-tighter leading-none">Estrategia de <br />Producto</h2>
                        <div className="flex flex-col gap-8">
                            <p className="text-[var(--foreground)] opacity-60 font-medium text-lg leading-relaxed">
                                Te ayudamos a definir el Roadmap técnico de tu producto. Alineamos los objetivos de negocio
                                con las capacidades tecnológicas para maximizar el ROI.
                            </p>
                            <div className="mt-10">
                                <a
                                    href="https://wa.me/541124025239?text=Hola%20Matecito!%20Me%20interesa%20conocer%20tu%20metodología%20de%20Trabajo."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" className="border-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] rounded-full uppercase font-mono text-xs tracking-widest px-10 h-16 shadow-lg shadow-[var(--accent)]/5">
                                        Ver metodología
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

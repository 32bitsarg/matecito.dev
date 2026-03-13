import { Button } from "@/components/ui/Button";

export default function ConsultoriaPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <section className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-7xl">
                <div className="flex flex-col gap-6 max-w-3xl">
                    <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl">
                        Consultoría <span className="text-zinc-500">de Alto Impacto</span>
                    </h1>
                    <p className="font-mono text-lg text-zinc-400 leading-relaxed uppercase tracking-wider">
                        Optimización de procesos y estrategia tecnológica para negocios en crecimiento.
                    </p>
                </div>

                <div className="mt-20 flex flex-col gap-24 border-t border-white/10 pt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Análisis de Infraestructura</h2>
                        <div className="flex flex-col gap-4">
                            <p className="text-zinc-400 font-light leading-relaxed">
                                Evaluamos tu stack tecnológico actual para identificar cuellos de botella y oportunidades de mejora.
                                No solo detectamos problemas, diseñamos la solución.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <li className="flex items-center gap-3 text-sm text-zinc-300">
                                    <span className="h-1.5 w-1.5 bg-white"></span> Auditoría de Código
                                </li>
                                <li className="flex items-center gap-3 text-sm text-zinc-300">
                                    <span className="h-1.5 w-1.5 bg-white"></span> Optimización SEO
                                </li>
                                <li className="flex items-center gap-3 text-sm text-zinc-300">
                                    <span className="h-1.5 w-1.5 bg-white"></span> Seguridad & Datos
                                </li>
                                <li className="flex items-center gap-3 text-sm text-zinc-300">
                                    <span className="h-1.5 w-1.5 bg-white"></span> Escalabilidad Cloud
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Estrategia de Producto</h2>
                        <div className="flex flex-col gap-4">
                            <p className="text-zinc-400 font-light leading-relaxed">
                                Te ayudamos a definir el Roadmap técnico de tu producto. Alineamos los objetivos de negocio
                                con las capacidades tecnológicas para maximizar el ROI.
                            </p>
                            <div className="mt-6">
                                <a
                                    href="https://wa.me/541124025239?text=Hola%20Matecito!%20Me%20interesa%20conocer%20tu%20metodología%20de%20Trabajo."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none uppercase font-mono text-xs tracking-widest px-8">
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

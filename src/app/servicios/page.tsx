import { Button } from "@/components/ui/Button";

export default function ServiciosPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <section className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-7xl">
                <div className="flex flex-col gap-6 max-w-3xl">
                    <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl">
                        Servicios <span className="text-zinc-500">Estratégicos</span>
                    </h1>
                    <p className="font-mono text-lg text-zinc-400 leading-relaxed uppercase tracking-wider">
                        Soluciones de ingeniería a medida para desafíos complejos.
                    </p>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-white/10 pt-16">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-white uppercase">Desarrollo Full-Stack</h2>
                        <p className="text-zinc-400 font-light leading-relaxed">
                            Construimos aplicaciones web desde la arquitectura de base de datos hasta la interfaz de usuario.
                            Especialistas en Next.js, React y Node.js para garantizar velocidad y escalabilidad.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-white uppercase">Arquitectura Cloud</h2>
                        <p className="text-zinc-400 font-light leading-relaxed">
                            Diseño de infraestructura en la nube que crece con tu negocio. Optimizamos costos y garantizamos
                            disponibilidad total de tus servicios.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-white uppercase">Consultoría Técnica</h2>
                        <p className="text-zinc-400 font-light leading-relaxed">
                            Auditorías de código, optimización de performance y guía estratégica para equipos de desarrollo
                            que buscan excelencia técnica.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-white uppercase">Diseño de Producto</h2>
                        <p className="text-zinc-400 font-light leading-relaxed">
                            Interfaces minimalistas enfocadas en la conversión y la experiencia de usuario.
                            Menos ruido, más impacto visual.
                        </p>
                    </div>
                </div>

                <div className="mt-24 bg-zinc-950 border border-white/10 p-12 text-center flex flex-col items-center gap-8">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">¿Listo para escalar tu infraestructura?</h2>
                    <a
                        href="https://wa.me/541124025239?text=Hola!%20Vengo%20de%20la%20sección%20de%20Servicios%20y%20quiero%20hablar%20con%20un%20experto."
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-none h-14 px-12 uppercase font-mono text-xs tracking-widest">
                            Hablar con un experto
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}

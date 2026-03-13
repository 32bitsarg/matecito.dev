import { Button } from "@/components/ui/Button";

export default function LandingsPage() {
    return (
        <div className="flex flex-col bg-black">
            {/* HERO / ATENCIÓN */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8">
                        CREAMOS LANDINGS <br />
                        <span className="text-zinc-500">QUE CONVIERTEN.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-mono text-zinc-400 max-w-2xl mx-auto mb-12 uppercase tracking-tight">
                        Diseño vendedora, carga instantánea y resultados medibles. Tu negocio merece una presencia de élite.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://wa.me/541124025239?text=Hola!%20Me%20interesa%20una%20landing%20page%20de%20alta%20conversión.%20(Ref:%20LD)" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="rounded-none h-16 px-12 bg-white text-black hover:bg-zinc-200 font-mono text-xs uppercase tracking-widest w-full">
                                Empezar mi proyecto
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* PAIN POINTS / INTERÉS */}
            <section className="py-24 border-y border-white/10 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="flex flex-col gap-6 p-8 border border-white/5 bg-black">
                        <span className="text-zinc-700 font-mono text-xs">EL PROBLEMA</span>
                        <h3 className="text-2xl font-bold text-white uppercase">¿Pagas publicidad y no vendes?</h3>
                        <p className="text-zinc-500 font-light leading-relaxed">
                            Muchas webs son lindas pero lentas o confusas. Si tu cliente tarda en cargar o no entiende qué hacer, se va a la competencia en 3 segundos.
                        </p>
                    </div>
                    <div className="flex flex-col gap-6 p-8 border border-white/5 bg-black">
                        <span className="text-zinc-700 font-mono text-xs">EL IMPACTO</span>
                        <h3 className="text-2xl font-bold text-white uppercase">Milisegundos que cuestan dinero.</h3>
                        <p className="text-zinc-500 font-light leading-relaxed">
                            Una web lenta baja tu ranking en Google y aumenta tu costo por click. Estás quemando presupuesto en una herramienta ineficiente.
                        </p>
                    </div>
                    <div className="flex flex-col gap-6 p-8 border border-white/5 bg-black">
                        <span className="text-zinc-700 font-mono text-xs">LA SOLUCIÓN</span>
                        <h3 className="text-2xl font-bold text-white uppercase">Ingeniería aplicada a la venta.</h3>
                        <p className="text-zinc-500 font-light leading-relaxed">
                            Construimos landings con Next.js para carga ultra-rápida y estructuras claras que guían al usuario hacia el botón de compra.
                        </p>
                    </div>
                </div>
            </section>

            {/* BENEFICIOS / DESEO */}
            <section className="py-32 bg-black px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white uppercase mb-12">No es solo una web. <br /> Es tu mejor vendedor.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="flex items-start gap-4">
                            <div className="h-2 w-2 bg-white mt-2 shrink-0"></div>
                            <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Optimización de conversión (CRO) integrada.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="h-2 w-2 bg-white mt-2 shrink-0"></div>
                            <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Mobile-first para el tráfico de redes sociales.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="h-2 w-2 bg-white mt-2 shrink-0"></div>
                            <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Setup de analítica (GTM) incluido.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="h-2 w-2 bg-white mt-2 shrink-0"></div>
                            <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Diseño premium que transmite autoridad.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACCIÓN / FINAL CTA */}
            <section className="py-32 px-6 text-center border-t border-white/10">
                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase mb-8">¿Listo para escalar tus conversiones?</h2>
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-12">Hablemos y diseñemos tu próximo motor de ventas.</p>
                <a href="https://wa.me/541124025239?text=Hola!%20Vi%20tus%20servicios%20en%20Matecito.%20(Ref:%20LD)" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="rounded-none h-16 px-12 border-white/20 text-white hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest">
                        Contactar ahora
                    </Button>
                </a>
            </section>
        </div>
    );
}

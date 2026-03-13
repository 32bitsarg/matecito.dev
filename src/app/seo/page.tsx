import { Button } from "@/components/ui/Button";

export default function SEOPage() {
    return (
        <div className="flex flex-col bg-black">
            {/* HERO / ATENCIÓN */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 uppercase">
                        DOMINÁ GOOGLE <br />
                        <span className="text-zinc-500">CON INGENIERÍA.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-mono text-zinc-400 max-w-2xl mx-auto mb-12 uppercase">
                        No es magia, es performance. Optimizamos tu arquitectura para que tu web sea la favorita de los buscadores.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://wa.me/541124025239?text=Hola!%20Necesito%20mejorar%20el%20SEO%20y%20la%20performance%20de%20mi%20web.%20(Ref:%20SO)" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="rounded-none h-16 px-12 bg-white text-black hover:bg-zinc-200 font-mono text-xs uppercase tracking-widest w-full">
                                Auditar mi SEO hoy
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* PAIN POINTS / INTERÉS */}
            <section className="py-24 border-y border-white/10 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-white uppercase mb-8 leading-tight">Si Google no te ve, <br /> no existís.</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="h-px w-8 bg-zinc-700 mt-3 shrink-0"></div>
                                <p className="text-zinc-400 font-light">
                                    Webs lentas que matan la experiencia del usuario y son penalizadas por los algoritmos.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-px w-8 bg-zinc-700 mt-3 shrink-0"></div>
                                <p className="text-zinc-400 font-light">
                                    Falta de estructura semántica que impide que los bots entiendan tu contenido correctamente.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-px w-8 bg-zinc-700 mt-3 shrink-0"></div>
                                <p className="text-zinc-400 font-light">
                                    Core Web Vitals en rojo que destruyen tu autoridad y aumentan el rebote.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-12 text-center">
                        <h4 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">Meta: Lighthouse 100</h4>
                        <div className="text-8xl font-bold text-white mb-6 animate-pulse">100</div>
                        <p className="text-zinc-500 text-sm font-mono uppercase">Performance / SEO / Best Practices</p>
                    </div>
                </div>
            </section>

            {/* SOLUCIÓN / DESEO */}
            <section className="py-24 bg-black px-6">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold text-white uppercase mb-16 text-center">Nuestro Abordaje Técnico</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 border border-white/5 bg-zinc-950">
                            <h4 className="text-white font-bold uppercase mb-4">Arquitectura Semántica</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Optimizamos el HTML para que sea 100% legible para Google, estableciendo jerarquías claras.</p>
                        </div>
                        <div className="p-8 border border-white/5 bg-zinc-950">
                            <h4 className="text-white font-bold uppercase mb-4">Aceleración de Carga</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Reducimos el peso de imágenes y scripts al mínimo, logrando experiencias instantáneas.</p>
                        </div>
                        <div className="p-8 border border-white/5 bg-zinc-950">
                            <h4 className="text-white font-bold uppercase mb-4">SEO On-Page Dinámico</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Setup de metadatos automáticos y descriptivos para cada rincón de tu aplicación.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACCIÓN / FINAL CTA */}
            <section className="py-32 px-6 text-center border-t border-white/10">
                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase mb-8">Ponele turbo a tu visibilidad.</h2>
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-12">Analizamos tu estado actual y trazamos un plan de ingeniería SEO.</p>
                <a href="https://wa.me/541124025239?text=Hola!%20Quisiera%20una%20auditoría%20SEO.%20(Ref:%20SO)" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="rounded-none h-16 px-12 border-white/20 text-white hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest">
                        Auditar mi Sitio
                    </Button>
                </a>
            </section>
        </div>
    );
}

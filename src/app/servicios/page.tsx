import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Search, Layout, Megaphone, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";

export default function ServiciosPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <section className="relative z-10 container mx-auto px-6 pt-4 pb-24 max-w-7xl">
                <div className="mb-2">
                    <Breadcrumbs items={[{ label: "Servicios", href: "/servicios" }]} />
                </div>
                <div className="flex flex-col gap-6 max-w-3xl mb-20">
                    <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl">
                        Servicios <span className="text-zinc-500">Estratégicos</span>
                    </h1>
                    <p className="font-mono text-lg text-zinc-400 leading-relaxed uppercase tracking-wider">
                        Soluciones de ingeniería a medida para desafíos complejos.
                    </p>
                </div>

                {/* SPECIALIZED VERTICALS (EMBUDO) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <Link href="/seo" className="group p-8 border border-white/10 bg-zinc-950 hover:bg-zinc-900 transition-all flex flex-col gap-6">
                        <Search className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors" />
                        <h3 className="text-xl font-bold text-white uppercase">SEO & Performance</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Auditorías técnicas y optimización de infraestructura para buscadores.</p>
                        <span className="mt-auto text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            Saber más <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                    <Link href="/landings" className="group p-8 border border-white/10 bg-zinc-950 hover:bg-zinc-900 transition-all flex flex-col gap-6">
                        <Layout className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors" />
                        <h3 className="text-xl font-bold text-white uppercase">Landings de Élite</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Diseño y desarrollo de alta conversión con carga instantánea.</p>
                        <span className="mt-auto text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            Saber más <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                    <Link href="/marketing" className="group p-8 border border-white/10 bg-zinc-950 hover:bg-zinc-900 transition-all flex flex-col gap-6">
                        <Megaphone className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors" />
                        <h3 className="text-xl font-bold text-white uppercase">Ingeniería de Ventas</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Embudos automatizados y analítica avanzada para tu negocio.</p>
                        <span className="mt-auto text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            Saber más <ArrowRight className="w-3 h-3" />
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-white/10 pt-16">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-white uppercase">Desarrollo Full-Stack</h2>
                        <p className="text-zinc-400 font-light leading-relaxed">
                            Construimos aplicaciones web desde la arquitectura de base de datos hasta la interfaz de usuario.
                            Especialistas en Next.js, React y Node.js.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-white uppercase">Consultoría Técnica</h2>
                        <p className="text-zinc-400 font-light leading-relaxed">
                            Auditorías de código, optimización de performance y guía estratégica para equipos de desarrollo.
                        </p>
                    </div>
                </div>

                {/* INSIGHTS CTA */}
                <Link href="/insights" className="mt-24 group block p-12 border border-white/5 bg-zinc-950 hover:border-white/20 transition-all">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <BookOpen className="w-10 h-10 text-zinc-500 group-hover:text-white transition-colors" />
                            <div className="text-left">
                                <h3 className="text-2xl font-bold text-white uppercase">Nuestros Insights</h3>
                                <p className="text-zinc-500 text-sm uppercase font-mono tracking-widest mt-1">Ingeniería, cultura y tecnología aplicada.</p>
                            </div>
                        </div>
                        <span className="text-white group-hover:translate-x-2 transition-transform text-2xl">→</span>
                    </div>
                </Link>

                <div className="mt-24 bg-white p-12 text-center flex flex-col items-center gap-8">
                    <h2 className="text-3xl font-bold text-black uppercase tracking-tighter">¿Listo para escalar tu infraestructura?</h2>
                    <a
                        href="https://wa.me/541124025239?text=Hola!%20Vengo%20de%20la%20sección%20de%20Servicios%20y%20quiero%20hablar%20con%20un%20experto."
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="lg" className="bg-black text-white hover:bg-zinc-800 rounded-none h-14 px-12 uppercase font-mono text-xs tracking-widest">
                            Hablar con un experto
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}

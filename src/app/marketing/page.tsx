import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
    title: "Embudos de Venta Automatizados & Analítica GA4 | Matecito.dev",
    description: "Ingeniería de ventas aplicada. Creamos sistemas de captación lógicos y medibles para escalar tu negocio.",
};

export default function MarketingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Ingeniería de Ventas & Marketing",
        "serviceType": "Marketing Automation",
        "description": "Embudos de venta automatizados, analítica avanzada y optimización de leads.",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Matecito.dev",
            "url": "https://matecito.dev/marketing"
        }
    };

    return (
        <div className="flex flex-col bg-black">
            <JsonLd data={jsonLd} />
            {/* HERO / ATENCIÓN */}
            <section className="relative pt-4 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto mb-2">
                    <Breadcrumbs items={[{ label: "Servicios", href: "/servicios" }, { label: "Marketing", href: "/marketing" }]} />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px]"></div>
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 uppercase">
                        INGENIERÍA <br />
                        <span className="text-zinc-500">DE VENTAS.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-mono text-zinc-400 max-w-2xl mx-auto mb-12 uppercase tracking-tight">
                        No hacemos ruido, hacemos negocios. Embudos de venta automatizados y analítica de alta precisión.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://wa.me/541124025239?text=Hola!%20Me%20interesa%20escalar%20mi%20marketing%20y%20ventas.%20(Ref:%20MK)" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="rounded-none h-16 px-12 bg-white text-black hover:bg-zinc-200 font-mono text-xs uppercase tracking-widest w-full">
                                Empezar a Escalar
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* PAIN POINTS / INTERÉS */}
            <section className="py-24 border-y border-white/10 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-4xl font-bold text-white uppercase mb-8">¿Tus campañas <br /> se sienten vacías?</h2>
                            <p className="text-zinc-400 font-light text-lg leading-relaxed mb-8">
                                Muchas empresas lanzan anuncios sin un sistema que capture y procese esa atención. El tráfico sin funnel es dinero tirado a la basura.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 grid grid-cols-1 gap-4">
                            <div className="p-6 bg-black border border-white/5">
                                <h4 className="text-white font-bold text-sm uppercase mb-2">Pérdida de Leads</h4>
                                <p className="text-zinc-500 text-xs font-mono uppercase">Muchos clicks, pocas consultas reales.</p>
                            </div>
                            <div className="p-6 bg-black border border-white/5">
                                <h4 className="text-white font-bold text-sm uppercase mb-2">Analítica Ciega</h4>
                                <p className="text-zinc-500 text-xs font-mono uppercase">No saber de dónde vienen las ventas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLUCIÓN / DESEO */}
            <section className="py-24 bg-black px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col gap-6">
                        <div className="h-12 w-12 bg-white/5 border border-white/10 flex items-center justify-center font-mono text-white">01</div>
                        <h3 className="text-xl font-bold text-white uppercase">Automated Funnels</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Creamos flujos lógicos que guían al cliente desde el anuncio hasta el cierre, sin intervención manual.</p>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="h-12 w-12 bg-white/5 border border-white/10 flex items-center justify-center font-mono text-white">02</div>
                        <h3 className="text-xl font-bold text-white uppercase">Advanced GA4/GTM</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Medimos cada interacción. Sabrás qué canal es rentable y dónde está tu Retorno de Inversión.</p>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="h-12 w-12 bg-white/5 border border-white/10 flex items-center justify-center font-mono text-white">03</div>
                        <h3 className="text-xl font-bold text-white uppercase">Conversion Leads</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Optimizamos la captación para que los leads lleguen calificados y listos para comprar.</p>
                    </div>
                </div>
            </section>

            {/* CROSS-LINKING / EXPLORAR MÁS */}
            <section className="py-12 bg-zinc-950 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-8">Complementá tu estrategia</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link href="/seo" className="group p-8 border border-white/5 hover:bg-white/[0.02] transition-all">
                            <h4 className="text-white font-bold uppercase mb-2 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                Ingeniería SEO <span>→</span>
                            </h4>
                            <p className="text-zinc-500 text-xs">Dominá los buscadores con una arquitectura optimizada.</p>
                        </Link>
                        <Link href="/landings" className="group p-8 border border-white/5 hover:bg-white/[0.02] transition-all">
                            <h4 className="text-white font-bold uppercase mb-2 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                Landings de Élite <span>→</span>
                            </h4>
                            <p className="text-zinc-500 text-xs">Convertí el tráfico de tus embudos en ventas reales.</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ACCIÓN / FINAL CTA */}
            <section className="py-32 px-6 text-center border-t border-white/10">
                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase mb-8">¿Llenamos tu embudo?</h2>
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-12">Sin vueltas. Diseñemos una máquina de ventas para tu negocio.</p>
                <a href="https://wa.me/541124025239?text=Hola!%20Me%20interesa%20automatizar%20mis%20ventas.%20(Ref:%20MK)" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="rounded-none h-16 px-12 border-white/20 text-white hover:bg-white hover:text-black font-mono text-xs uppercase tracking-widest">
                        Hablar de Estrategia
                    </Button>
                </a>
            </section>
        </div>
    );
}

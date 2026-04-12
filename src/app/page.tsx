import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Database, Globe, Layers } from "lucide-react"
import { TerminalAnimation } from "@/components/ascii/TerminalAnimation"

export const metadata: Metadata = {
    title: "matecito.dev — desarrollo de software desde Argentina",
    description: "Construimos software desde Pergamino, Argentina: matecitodb (BaaS para developers), apps web, juegos y páginas web para pymes y emprendimientos.",
    keywords: [
        "desarrollo software Argentina", "BaaS Argentina", "matecitodb",
        "apps web Argentina", "páginas web pymes Pergamino",
        "landing page Argentina", "software Pergamino Buenos Aires",
    ],
    openGraph: {
        title: "matecito.dev — desarrollo de software desde Argentina",
        description: "BaaS para developers, apps web, juegos y páginas web para pymes. Desde Pergamino, Argentina.",
        url: "https://matecito.dev",
        siteName: "matecito.dev",
        locale: "es_AR",
        type: "website",
        images: [{ url: "https://matecito.dev/og/home.png", width: 1200, height: 630, alt: "matecito.dev — software desde Argentina" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "matecito.dev — software desde Argentina",
        description: "BaaS, apps, juegos y webs. Desde Pergamino, Argentina.",
    },
    alternates: { canonical: "https://matecito.dev" },
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "matecito.dev",
    url: "https://matecito.dev",
    logo: "https://matecito.dev/logos/matecitologo.png",
    description: "Estudio de desarrollo de software en Pergamino, Argentina. Creamos BaaS, apps web, juegos y páginas web para pymes.",
    address: { "@type": "PostalAddress", addressLocality: "Pergamino", addressRegion: "Buenos Aires", addressCountry: "AR" },
    sameAs: [],
    hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Productos y servicios",
        itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "SoftwareApplication", name: "matecitodb", url: "https://matecito.dev/matecitodb" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Páginas web para pymes", url: "https://matecito.dev/web" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Apps y proyectos web", url: "https://matecito.dev/apps" } },
        ],
    },
}

const PRODUCTS = [
    {
        href: "/matecitodb",
        icon: Database,
        tag: "beta",
        eyebrow: "Para developers",
        title: "matecitodb",
        desc: "Backend-as-a-Service argentino. Auth, base de datos, storage y API REST listos en minutos. Sin configurar servidores.",
        cta: "Ver matecitodb",
        external: false,
    },
    {
        href: "/apps",
        icon: Layers,
        tag: null,
        eyebrow: "Proyectos",
        title: "Apps & Juegos",
        desc: "Apps web, juegos y herramientas que construimos. Desde reproductores de música hasta experimentos con IA y más.",
        cta: "Ver proyectos",
        external: false,
    },
    {
        href: "/web",
        icon: Globe,
        tag: null,
        eyebrow: "Servicios",
        title: "Webs & Landings",
        desc: "Diseñamos y desarrollamos sitios web y landing pages para emprendimientos y pymes. Rápido, SEO, a medida.",
        cta: "Ver servicios",
        external: false,
    },
]

export default function Home() {
    return (
        <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main className="min-h-screen bg-black text-white">

            {/* Hero */}
            <section className="relative px-6 pt-28 pb-24 overflow-hidden">
                {/* subtle dot grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                {/* crimson glow top-center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-[100px] opacity-20"
                    style={{ backgroundColor: '#6d001a' }} />

                <div className="relative max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    {/* left — copy */}
                    <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-10 border"
                        style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(240,240,240,0.45)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#6d001a' }} />
                        Pergamino, Buenos Aires · Argentina
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.0] mb-6">
                        Software<br />
                        <span style={{ color: '#6d001a' }}>desde Argentina</span>
                    </h1>

                    <p className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-12"
                        style={{ color: 'rgba(240,240,240,0.50)' }}>
                        Construimos herramientas para developers, apps para usuarios
                        y webs para negocios.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/apps"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-85"
                            style={{ backgroundColor: '#6d001a' }}>
                            Ver proyectos
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/matecitodb"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors border hover:bg-white/5"
                            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,240,240,0.70)' }}>
                            Conocer matecitodb
                        </Link>
                    </div>
                    </div>

                    {/* right — terminal */}
                    <div className="shrink-0 w-full lg:w-auto">
                        <TerminalAnimation />
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="px-6 pb-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs font-mono pt-16 pb-10 uppercase tracking-[0.2em]"
                        style={{ color: 'rgba(240,240,240,0.30)' }}>
                        Lo que hacemos
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {PRODUCTS.map(p => {
                            const Icon = p.icon
                            return (
                                <Link key={p.href} href={p.href}
                                    className="group flex flex-col gap-5 p-6 rounded-2xl border transition-all hover:border-[rgba(255,255,255,0.20)] hover:-translate-y-px"
                                    style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.09)' }}>

                                    {/* Icon row */}
                                    <div className="flex items-start justify-between">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                                            style={{ backgroundColor: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
                                            <Icon className="w-5 h-5" style={{ color: 'rgba(240,240,240,0.60)' }} />
                                        </div>
                                        {p.tag ? (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                                style={{ backgroundColor: 'rgba(109,0,26,0.25)', color: '#e0a0a0', border: '1px solid rgba(109,0,26,0.45)' }}>
                                                {p.tag}
                                            </span>
                                        ) : (
                                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity"
                                                style={{ color: '#f0f0f0' }} />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1">
                                        <p className="text-[11px] font-mono mb-1.5 uppercase tracking-wider"
                                            style={{ color: 'rgba(240,240,240,0.30)' }}>
                                            {p.eyebrow}
                                        </p>
                                        <h2 className="text-base font-bold mb-2" style={{ color: '#f0f0f0' }}>
                                            {p.title}
                                        </h2>
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,240,0.45)' }}>
                                            {p.desc}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center gap-1.5 text-xs font-semibold transition-all opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0"
                                        style={{ color: 'rgba(240,240,240,0.70)' }}>
                                        {p.cta}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Strip — matecitodb highlight */}
            <section className="px-6 py-16 border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', backgroundColor: '#0a0a0a' }}>
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'rgba(109,0,26,0.9)' }}>
                            En construcción
                        </p>
                        <h3 className="text-xl font-bold mb-1" style={{ color: '#f0f0f0' }}>
                            matecitodb — BaaS para developers argentinos
                        </h3>
                        <p className="text-sm" style={{ color: 'rgba(240,240,240,0.45)' }}>
                            Auth, base de datos, storage, realtime y funciones serverless. Un SDK. Listo para producción.
                        </p>
                    </div>
                    <Link href="/matecitodb"
                        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5 whitespace-nowrap"
                        style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,240,240,0.70)' }}>
                        Saber más
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

        </main>
        </>
    )
}

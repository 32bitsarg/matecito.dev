import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
    title: "Matecito.dev — Construyendo comunidades, videojuegos y productos digitales",
    description: "Matecito.dev es un ecosistema de proyectos digitales: Recién Llegué, ZeroLagARG, Conquest of Etheria y Labs. Construimos en público desde Argentina.",
    keywords: [
        "ecosistema digital Argentina", "videojuegos Argentina", "comunidad gaming Argentina",
        "Recién Llegué", "ZeroLagARG", "Conquest of Etheria", "Labs matecito",
        "build in public Argentina", "software Pergamino Buenos Aires",
    ],
    openGraph: {
        title: "Matecito.dev — Construyendo comunidades, videojuegos y productos digitales",
        description: "Ecosistema de proyectos digitales construidos en público desde Argentina.",
        url: "https://matecito.dev",
        siteName: "matecito.dev",
        locale: "es_AR",
        type: "website",
        images: [{ url: "https://matecito.dev/og/home.png", width: 1200, height: 630, alt: "matecito.dev" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Matecito.dev — Ecosistema digital desde Argentina",
        description: "Comunidades, videojuegos y productos digitales. Construimos en público.",
    },
    alternates: { canonical: "https://matecito.dev" },
}

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "matecito.dev",
    url: "https://matecito.dev",
    logo: "https://matecito.dev/logos/matecitologo.png",
    description: "Ecosistema de comunidades, videojuegos y productos digitales construidos en público desde Pergamino, Argentina.",
    address: { "@type": "PostalAddress", addressLocality: "Pergamino", addressRegion: "Buenos Aires", addressCountry: "AR" },
    sameAs: [],
    hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Proyectos del ecosistema",
        itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "WebApplication", name: "Recién Llegué", url: "https://recienllegue.com.ar" } },
            { "@type": "Offer", itemOffered: { "@type": "VideoGame", name: "Conquest of Etheria" } },
            { "@type": "Offer", itemOffered: { "@type": "WebApplication", name: "Labs", url: "https://matecito.dev/labs" } },
        ],
    },
}

const ECOSYSTEM = [
    {
        emoji: "🌎",
        title: "Recién Llegué",
        desc: "Ayudando a las personas a adaptarse a nuevas ciudades.",
        href: "https://recienllegue.com.ar",
        external: true,
        status: "live" as const,
    },
    {
        emoji: "🎮",
        title: "ZeroLagARG",
        desc: "Comunidad gaming y servidores.",
        href: null as string | null,
        external: false,
        status: "wip" as const,
    },
    {
        emoji: "⚔️",
        title: "Conquest of Etheria",
        desc: "Juego de estrategia en desarrollo.",
        href: null as string | null,
        external: false,
        status: "wip" as const,
    },
    {
        emoji: "🧪",
        title: "Labs",
        desc: "Experimentos y herramientas.",
        href: "/labs",
        external: false,
        status: "wip" as const,
    },
]

const PROGRESS = [
    { label: "Recién Llegué", pct: 70 },
    { label: "ZeroLagARG", pct: 80 },
    { label: "Conquest of Etheria", pct: 30 },
]

export default function Home() {
    return (
        <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main className="min-h-screen bg-black text-white">

            {/* Hero */}
            <section className="relative px-6 pt-28 pb-24 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-[100px] opacity-20"
                    style={{ backgroundColor: '#6d001a' }} />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-10 border"
                        style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(240,240,240,0.45)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#6d001a' }} />
                        Pergamino, Buenos Aires · Argentina
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
                        Matecito<span style={{ color: '#6d001a' }}>.dev</span>
                    </h1>

                    <p className="text-lg sm:text-2xl max-w-2xl mx-auto leading-relaxed mb-12"
                        style={{ color: 'rgba(240,240,240,0.50)' }}>
                        Construyendo comunidades, videojuegos y productos digitales.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/estudio"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-85"
                            style={{ backgroundColor: '#6d001a' }}>
                            Ver proyectos
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/labs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors border hover:bg-white/5"
                            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,240,240,0.70)' }}>
                            Seguir el desarrollo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ecosistema */}
            <section className="px-6 pb-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs font-mono pt-16 pb-10 uppercase tracking-[0.2em]"
                        style={{ color: 'rgba(240,240,240,0.30)' }}>
                        El ecosistema
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ECOSYSTEM.map(p => {
                            const isLink = !!p.href
                            const linkProps = isLink
                                ? { href: p.href!, ...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
                                : {}

                            const cardClasses = `group flex flex-col gap-5 p-6 rounded-2xl border transition-all ${isLink ? 'hover:border-[rgba(255,255,255,0.20)] hover:-translate-y-px cursor-pointer' : 'cursor-default'}`
                            const cardStyle = { backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.09)' }

                            const inner = (
                                <>
                                    <span className="text-3xl leading-none">{p.emoji}</span>
                                    <div className="flex-1">
                                        <h2 className="text-base font-bold mb-2" style={{ color: '#f0f0f0' }}>{p.title}</h2>
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,240,0.45)' }}>{p.desc}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {p.status === 'wip' ? (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.30)' }}>
                                                En desarrollo
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: 'rgba(5,150,105,0.15)', color: '#34d399', border: '1px solid rgba(5,150,105,0.35)' }}>
                                                Live
                                            </span>
                                        )}
                                        {isLink && (
                                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity"
                                                style={{ color: '#f0f0f0' }} />
                                        )}
                                    </div>
                                </>
                            )

                            return isLink ? (
                                <Link key={p.title} {...(linkProps as any)} className={cardClasses} style={cardStyle}>
                                    {inner}
                                </Link>
                            ) : (
                                <div key={p.title} className={cardClasses} style={cardStyle}>
                                    {inner}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Ahora mismo */}
            <section className="px-6 py-16 border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', backgroundColor: '#0a0a0a' }}>
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] mb-10"
                        style={{ color: 'rgba(240,240,240,0.30)' }}>
                        Ahora mismo
                    </p>
                    <div className="flex flex-col gap-7">
                        {PROGRESS.map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between items-center mb-2.5">
                                    <span className="text-sm font-semibold" style={{ color: '#f0f0f0' }}>{item.label}</span>
                                    <span className="text-xs font-mono" style={{ color: 'rgba(240,240,240,0.35)' }}>{item.pct}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: '#6d001a' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Build in Public */}
            <section className="px-6 py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-widest mb-2"
                            style={{ color: 'rgba(109,0,26,0.9)' }}>
                            Build in Public
                        </p>
                        <h3 className="text-xl font-bold mb-1" style={{ color: '#f0f0f0' }}>
                            Construimos en público
                        </h3>
                        <p className="text-sm max-w-md" style={{ color: 'rgba(240,240,240,0.45)' }}>
                            Devlogs, decisiones, aprendizajes y el proceso detrás de cada proyecto. Próximamente.
                        </p>
                    </div>
                    <Link href="/labs"
                        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5 whitespace-nowrap"
                        style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,240,240,0.70)' }}>
                        Ver devlogs
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

        </main>
        </>
    )
}

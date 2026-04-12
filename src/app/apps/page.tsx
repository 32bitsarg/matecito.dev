import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Globe, Gamepad2, Database } from "lucide-react"
import { IloveMP3Card } from "@/components/apps/IloveMP3Card"

export const metadata: Metadata = {
    title: "Apps & Proyectos — matecito.dev",
    description: "Apps web, juegos, herramientas y sitios que construimos. Proyectos propios y para clientes.",
    openGraph: {
        title: "Apps & Proyectos — matecito.dev",
        description: "Apps, juegos y herramientas construidas por matecito.dev",
        url: "https://matecito.dev/apps",
        siteName: "matecito.dev",
        locale: "es_AR",
        type: "website",
    },
}

type ProjectStatus = "live" | "beta" | "wip"

interface Project {
    title: string
    desc: string
    icon: React.ElementType
    tags: string[]
    status: ProjectStatus
    href?: string
    internal?: boolean
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
    live: "Live",
    beta: "Beta",
    wip: "En desarrollo",
}

const STATUS_STYLE: Record<ProjectStatus, { bg: string; color: string; border: string }> = {
    live:  { bg: 'rgba(5,150,105,0.15)',  color: '#34d399', border: 'rgba(5,150,105,0.35)' },
    beta:  { bg: 'rgba(109,0,26,0.20)',   color: '#f0f0f0', border: 'rgba(109,0,26,0.50)' },
    wip:   { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.30)' },
}

const PROJECTS: Project[] = [
    {
        title: "matecitodb",
        desc: "Backend-as-a-Service para developers argentinos. Auth, base de datos, storage, realtime y API REST. Self-hosted o cloud.",
        icon: Database,
        tags: ["BaaS", "SDK", "PostgreSQL", "Auth"],
        status: "beta",
        href: "/matecitodb",
        internal: true,
    },
    {
        title: "Webs para pymes",
        desc: "Sitios web y landing pages para emprendimientos y negocios. Diseño a medida, SEO y alta performance.",
        icon: Globe,
        tags: ["Next.js", "SEO", "Landing", "Diseño"],
        status: "live",
        href: "/web",
        internal: true,
    },
    {
        title: "Juego — próximamente",
        desc: "Algo estamos cocinando. Un juego web para el navegador. Pronto.",
        icon: Gamepad2,
        tags: ["Canvas", "TypeScript"],
        status: "wip",
    },
]

export default function AppsPage() {
    return (
        <div className="min-h-screen bg-black text-white">

            {/* Header */}
            <section className="px-6 pt-20 pb-16 max-w-4xl mx-auto">
                <p className="text-xs font-mono mb-4" style={{ color: 'rgba(240,240,240,0.35)' }}>
                    matecito.dev / apps
                </p>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                    Apps & Proyectos
                </h1>
                <p className="text-lg max-w-xl leading-relaxed" style={{ color: 'rgba(240,240,240,0.55)' }}>
                    Lo que construimos: desde herramientas para developers hasta apps y juegos.
                    Proyectos propios y trabajos para clientes.
                </p>
            </section>

            {/* Grid */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <IloveMP3Card />
                    {PROJECTS.map(p => {
                        const Icon = p.icon
                        const st = STATUS_STYLE[p.status]
                        const Wrapper = p.href ? Link : 'div'
                        const wrapperProps = p.href
                            ? { href: p.href, ...(p.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' }) }
                            : {}

                        return (
                            <Wrapper
                                key={p.title}
                                {...(wrapperProps as any)}
                                className={`group flex flex-col gap-5 p-6 rounded-2xl border transition-all ${p.href ? 'hover:border-[rgba(255,255,255,0.22)] cursor-pointer' : 'cursor-default'}`}
                                style={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.10)' }}
                            >
                                {/* Top row */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: '#1c1c1c' }}>
                                        <Icon className="w-5 h-5" style={{ color: 'rgba(240,240,240,0.65)' }} />
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
                                        style={{ backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                        {STATUS_LABEL[p.status]}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h2 className="text-base font-bold mb-2" style={{ color: '#f0f0f0' }}>{p.title}</h2>
                                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,240,0.50)' }}>{p.desc}</p>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    {p.tags.map(tag => (
                                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md font-mono"
                                            style={{ backgroundColor: '#1c1c1c', color: 'rgba(240,240,240,0.40)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* CTA */}
                                {p.href && (
                                    <div className="flex items-center gap-1 text-xs font-semibold transition-opacity opacity-40 group-hover:opacity-100"
                                        style={{ color: '#f0f0f0' }}>
                                        {p.internal ? 'Ver más' : 'Abrir'}
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </div>
                                )}
                            </Wrapper>
                        )
                    })}
                </div>
            </section>

        </div>
    )
}

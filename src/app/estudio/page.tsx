import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Proyectos — matecito.dev",
    description: "El ecosistema de proyectos de Matecito.dev: Recién Llegué, ZeroLagARG, Conquest of Etheria y Labs. Construimos en público desde Argentina.",
}

type ProjectStatus = "live" | "wip"

interface Project {
    title: string
    description: string
    link: string | null
    tag: string
    year: string
    image: string | null
    emoji: string | null
    status: ProjectStatus
}

const projects: Project[] = [
    {
        title: "Recién Llegué",
        description: "Plataforma que ayuda a las personas a adaptarse a nuevas ciudades. Comunidad, recursos y orientación local.",
        link: "https://recienllegue.com.ar",
        tag: "Plataforma Digital",
        year: "2025",
        image: "/projects/recienllegue.png",
        emoji: null,
        status: "live",
    },
    {
        title: "ZeroLagARG",
        description: "Comunidad gaming argentina. Servidores de Minecraft, MU Online, foros y eventos.",
        link: null,
        tag: "Comunidad Gaming",
        year: "2026",
        image: null,
        emoji: "🎮",
        status: "wip",
    },
    {
        title: "Conquest of Etheria",
        description: "Juego de estrategia por turnos en desarrollo. Lore, mecánicas y arte construidos en público.",
        link: null,
        tag: "Videojuego",
        year: "2026",
        image: null,
        emoji: "⚔️",
        status: "wip",
    },
    {
        title: "Labs",
        description: "Experimentos, herramientas, automatizaciones y proyectos de IA en desarrollo continuo.",
        link: "/labs",
        tag: "Laboratorio",
        year: "2026",
        image: null,
        emoji: "🧪",
        status: "wip",
    },
]

const STATUS_LABEL: Record<ProjectStatus, string> = {
    live: "Live",
    wip: "En desarrollo",
}

export default function EstudioPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)] relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--accent)_0.5px,transparent_0.5px),linear-gradient(to_bottom,var(--accent)_0.5px,transparent_0.5px)] opacity-[0.03] bg-[size:24px_24px]"></div>
            <section className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-7xl">
                <div className="flex flex-col gap-6 max-w-3xl mb-24">
                    <h1 className="text-5xl font-bold tracking-tighter text-[var(--accent)] sm:text-8xl uppercase">
                        El <br /><span className="text-[var(--foreground)] opacity-40">Ecosistema</span>
                    </h1>
                    <p className="font-mono text-sm md:text-base text-[var(--foreground)] opacity-60 leading-relaxed uppercase tracking-[0.3em] font-medium">
                        Un ecosistema de proyectos digitales nacidos y evolucionados íntegramente bajo el sello de Matecito.Dev.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
                    {projects.map((project, index) => (
                        <div key={index} className="group flex flex-col gap-10">
                            {/* Visual Container */}
                            <div className="aspect-[16/10] bg-[var(--accent)]/[0.02] border border-[var(--accent)]/5 relative overflow-hidden flex items-center justify-center grayscale filter hover:grayscale-0 transition-all duration-700 rounded-[2.5rem] shadow-sm">
                                {project.image ? (
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        width={400}
                                        height={400}
                                        className="w-48 h-48 object-contain group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-100"
                                    />
                                ) : (
                                    <span className="text-7xl opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 select-none">
                                        {project.emoji}
                                    </span>
                                )}

                                {project.link && (
                                    <Link
                                        href={project.link}
                                        target={project.link.startsWith('http') ? '_blank' : '_self'}
                                        rel={project.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[var(--accent)]/10 backdrop-blur-md"
                                    >
                                        <span className="font-mono text-[10px] text-[var(--accent)] bg-[var(--background)] uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-2xl font-bold transition-all border border-[var(--accent)]/10">
                                            Explorar Proyecto ↗
                                        </span>
                                    </Link>
                                )}
                            </div>

                            {/* Content Block */}
                            <div className="flex flex-col gap-6 px-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-2">
                                        <span className="font-mono text-[10px] text-[var(--foreground)] opacity-40 uppercase tracking-[0.3em] font-bold">{project.tag}</span>
                                        <h2 className="text-4xl font-bold text-[var(--accent)] uppercase tracking-tighter">
                                            {project.title}
                                        </h2>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-mono text-[10px] text-[var(--accent)] opacity-40 border border-[var(--accent)]/10 rounded-full px-4 py-1 font-bold">{project.year}</span>
                                        <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold"
                                            style={project.status === 'live'
                                                ? { backgroundColor: 'rgba(5,150,105,0.15)', color: '#34d399', border: '1px solid rgba(5,150,105,0.35)' }
                                                : { backgroundColor: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.30)' }
                                            }>
                                            {STATUS_LABEL[project.status]}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[var(--foreground)] opacity-60 font-medium leading-relaxed text-sm max-w-md">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

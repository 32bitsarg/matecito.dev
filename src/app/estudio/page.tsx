import Link from "next/link";
import Image from "next/image";

const projects = [
    {
        title: "Stockcito",
        description: "Sistema de gestión de inventario inteligente para negocios modernos.",
        link: "https://stockcito.com",
        tag: "Software as a Service",
        year: "2025",
        image: "/projects/stockcito.png"
    },
    {
        title: "Recienllegue",
        description: "Plataforma de servicios y logística optimizada para el mercado local.",
        link: "https://recienllegue.com",
        tag: "Plataforma Digital",
        year: "2026",
        image: "/projects/recienllegue.png"
    }
];

export default function EstudioPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)] relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--accent)_0.5px,transparent_0.5px),linear-gradient(to_bottom,var(--accent)_0.5px,transparent_0.5px)] opacity-[0.03] bg-[size:24px_24px]"></div>
            <section className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-7xl">
                <div className="flex flex-col gap-6 max-w-3xl mb-24">
                    <h1 className="text-5xl font-bold tracking-tighter text-[var(--accent)] sm:text-8xl uppercase">
                        Proyectos <br /><span className="text-[var(--foreground)] opacity-40">Propios</span>
                    </h1>
                    <p className="font-mono text-sm md:text-base text-[var(--foreground)] opacity-60 leading-relaxed uppercase tracking-[0.3em] font-medium">
                        Un ecosistema de productos digitales nacidos y evolucionados íntegramente bajo el sello de Matecito.Dev.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
                    {projects.map((project, index) => (
                        <div key={index} className="group flex flex-col gap-10">
                            {/* Visual Container */}
                            <div className="aspect-[16/10] bg-[var(--accent)]/[0.02] border border-[var(--accent)]/5 relative overflow-hidden flex items-center justify-center grayscale filter hover:grayscale-0 transition-all duration-700 rounded-[2.5rem] shadow-sm">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    width={400}
                                    height={400}
                                    className="w-48 h-48 object-contain group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-100"
                                />

                                {/* Hover overlay with link */}
                                <Link
                                    href={project.link}
                                    target="_blank"
                                    className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[var(--accent)]/10 backdrop-blur-md"
                                >
                                    <span className="font-mono text-[10px] text-[var(--accent)] bg-[var(--background)] uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-2xl font-bold transition-all border border-[var(--accent)]/10">
                                        Explorar Proyecto ↗
                                    </span>
                                </Link>
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
                                    <span className="font-mono text-[10px] text-[var(--accent)] opacity-40 border border-[var(--accent)]/10 rounded-full px-4 py-1 font-bold">{project.year}</span>
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
    );
}

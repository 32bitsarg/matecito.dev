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
        <div className="flex flex-col min-h-screen bg-black relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <section className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-7xl">
                <div className="flex flex-col gap-6 max-w-3xl mb-24">
                    <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl">
                        Proyectos <span className="text-zinc-500">Propios</span>
                    </h1>
                    <p className="font-mono text-lg text-zinc-400 leading-relaxed uppercase tracking-wider">
                        Un ecosistema de productos digitales nacidos y evolucionados íntegramente bajo el sello de Matecito.Dev.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                    {projects.map((project, index) => (
                        <div key={index} className="group flex flex-col gap-8">
                            {/* Visual Container */}
                            <div className="aspect-[16/10] bg-zinc-950 border border-white/5 relative overflow-hidden flex items-center justify-center grayscale filter hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    width={400}
                                    height={400}
                                    className="w-48 h-48 object-contain group-hover:scale-110 transition-transform duration-700 opacity-50 group-hover:opacity-100"
                                />

                                {/* Hover overlay with link */}
                                <Link
                                    href={project.link}
                                    target="_blank"
                                    className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/60 backdrop-blur-sm"
                                >
                                    <span className="font-mono text-xs text-white uppercase tracking-widest border border-white px-6 py-3 hover:bg-white hover:text-black transition-all">
                                        Explorar Proyecto ↗
                                    </span>
                                </Link>
                            </div>

                            {/* Content Block */}
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{project.tag}</span>
                                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                                            {project.title}
                                        </h2>
                                    </div>
                                    <span className="font-mono text-xs text-zinc-600 border border-white/10 px-2 py-1">{project.year}</span>
                                </div>

                                <p className="text-zinc-400 font-light leading-relaxed text-sm max-w-md">
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

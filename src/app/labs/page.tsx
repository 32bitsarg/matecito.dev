import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, Container, Wrench, FlaskConical } from "lucide-react"

export const metadata: Metadata = {
    title: "Labs — matecito.dev",
    description: "Experimentos, herramientas, automatizaciones y proyectos de IA de Matecito.dev. Construimos en público.",
    openGraph: {
        title: "Matecito Labs — experimentos y herramientas",
        description: "Experimentos, herramientas y automatizaciones construidos en público desde Argentina.",
        url: "https://matecito.dev/labs",
        siteName: "matecito.dev",
        locale: "es_AR",
        type: "website",
    },
}

const LAB_ITEMS = [
    {
        icon: Bot,
        title: "IA & Agentes",
        desc: "Experimentos con modelos de lenguaje, agentes autónomos y automatizaciones inteligentes.",
    },
    {
        icon: Container,
        title: "Docker & DevOps",
        desc: "Herramientas y configuraciones para infraestructura reproducible.",
    },
    {
        icon: Wrench,
        title: "Herramientas",
        desc: "Scripts, utilidades y pequeñas herramientas construidas en público.",
    },
    {
        icon: FlaskConical,
        title: "Experimentos",
        desc: "Ideas en etapa exploratoria. Algunas crecen, otras no.",
    },
]

export default function LabsPage() {
    return (
        <main className="min-h-screen bg-black text-white">

            {/* Hero */}
            <section className="relative px-6 pt-28 pb-16 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[160px] rounded-full blur-[100px] opacity-15"
                    style={{ backgroundColor: '#6d001a' }} />

                <div className="relative max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono mb-10 border"
                        style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(240,240,240,0.45)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#6d001a' }} />
                        En construcción permanente
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
                        🧪 Labs
                    </h1>

                    <p className="text-xl max-w-2xl leading-relaxed mb-4" style={{ color: 'rgba(240,240,240,0.50)' }}>
                        Experimentos, herramientas y automatizaciones construidos en público.
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(240,240,240,0.30)' }}>
                        Algunas ideas crecen y se convierten en proyectos. Otras son simplemente exploración.
                    </p>
                </div>
            </section>

            {/* Lab items */}
            <section className="px-6 pb-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs font-mono pt-16 pb-10 uppercase tracking-[0.2em]"
                        style={{ color: 'rgba(240,240,240,0.30)' }}>
                        Áreas de exploración
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {LAB_ITEMS.map(item => {
                            const Icon = item.icon
                            return (
                                <div key={item.title}
                                    className="flex flex-col gap-4 p-6 rounded-2xl border"
                                    style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.09)' }}>
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                                        style={{ backgroundColor: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}>
                                        <Icon className="w-5 h-5" style={{ color: 'rgba(240,240,240,0.60)' }} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold mb-2" style={{ color: '#f0f0f0' }}>{item.title}</h2>
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,240,0.45)' }}>{item.desc}</p>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full self-start"
                                        style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.30)' }}>
                                        En construcción
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Build in public CTA */}
            <section className="px-6 pb-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)', backgroundColor: '#0a0a0a' }}>
                <div className="max-w-4xl mx-auto py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-widest mb-2"
                            style={{ color: 'rgba(109,0,26,0.9)' }}>
                            Build in Public
                        </p>
                        <h3 className="text-xl font-bold mb-1" style={{ color: '#f0f0f0' }}>
                            Todo construido en público
                        </h3>
                        <p className="text-sm" style={{ color: 'rgba(240,240,240,0.45)' }}>
                            Seguí el proceso, los errores y los aprendizajes en tiempo real.
                        </p>
                    </div>
                    <Link href="/estudio"
                        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5 whitespace-nowrap"
                        style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,240,240,0.70)' }}>
                        Ver proyectos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

        </main>
    )
}

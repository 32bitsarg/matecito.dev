import type { Metadata } from "next"
import NewsletterForm from "@/components/newsletter-form"
import Link from "next/link"
import { ArrowRight, Globe, Smartphone, Search, Zap, BarChart3, Sparkles, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
    title: "Matecito.Dev — Páginas Web y Landings para Emprendimientos y Pymes en Argentina",
    description: "Creamos páginas web y landings de alta conversión para emprendimientos y pymes. Diseño profesional, SEO optimizado y resultados medibles. Pergamino y todo el país.",
    keywords: [
        "páginas web para pymes Argentina",
        "landing page emprendimiento",
        "diseño web Pergamino",
        "desarrollo web pymes",
        "landing page conversión Argentina",
        "páginas web Buenos Aires",
    ],
    openGraph: {
        title: "Matecito.Dev — Páginas Web para Emprendimientos y Pymes",
        description: "Potenciá tu emprendimiento o pyme con una página web profesional de alta conversión. Diseño + SEO + resultados.",
        url: "https://matecito.dev",
        siteName: "Matecito.Dev",
        locale: "es_AR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Matecito.Dev — Páginas Web para Emprendimientos y Pymes",
        description: "Potenciá tu emprendimiento o pyme con una página web profesional de alta conversión.",
    },
}

export default function Home() {
    return (
        <div className="flex flex-col bg-white">

            {/* ── HERO ──────────────────────────────────────── */}
            <section className="relative overflow-hidden py-28 px-6">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed08_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed08_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-violet-100 rounded-full blur-[120px] opacity-50" />

                <div className="relative max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-full text-violet-700 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                        Pergamino · Buenos Aires · Todo el país
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
                        Tu emprendimiento<br />
                        <span className="text-violet-600">merece una web que venda</span>
                    </h1>

                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Creamos páginas web y landings profesionales para emprendimientos y pymes.
                        Diseño moderno, SEO optimizado y enfocado en convertir visitantes en clientes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <Link href="/#contacto"
                            className="flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-bold text-sm rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">
                            Empezar mi proyecto
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/#servicios"
                            className="flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                            Ver servicios
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── SERVICIOS ─────────────────────────────────── */}
            <section id="servicios" className="py-24 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Lo que hacemos</p>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Soluciones web para hacer crecer tu negocio
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Cada proyecto es único. Trabajamos con vos para entender tu negocio y crear algo que realmente funcione.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Globe,
                                color: "bg-violet-50 text-violet-600",
                                title: "Landing Pages",
                                desc: "Una página enfocada en convertir. Perfecta para lanzar un producto, servicio o campaña publicitaria.",
                                items: ["Diseño a medida", "Carga ultrarrápida", "Formulario de contacto", "Integración con WhatsApp"],
                            },
                            {
                                icon: Smartphone,
                                color: "bg-blue-50 text-blue-600",
                                title: "Sitios Web Completos",
                                desc: "Presencia digital profesional para tu pyme o emprendimiento. Varias páginas, catálogo, historia y más.",
                                items: ["Diseño responsivo", "Panel de administración", "Blog / novedades", "Multi-idioma opcional"],
                            },
                            {
                                icon: Search,
                                color: "bg-emerald-50 text-emerald-600",
                                title: "SEO & Posicionamiento",
                                desc: "Que te encuentren en Google cuando te buscan. Optimizamos tu presencia orgánica de forma sostenible.",
                                items: ["SEO técnico", "Contenido optimizado", "SEO local (Google Maps)", "Reportes mensuales"],
                            },
                            {
                                icon: Zap,
                                color: "bg-amber-50 text-amber-600",
                                title: "Optimización de Performance",
                                desc: "¿Tu web es lenta? La optimizamos para que cargue en menos de 2 segundos y no pierdas visitas.",
                                items: ["Core Web Vitals", "Imágenes optimizadas", "Caché avanzado", "CDN configurado"],
                            },
                            {
                                icon: BarChart3,
                                color: "bg-rose-50 text-rose-600",
                                title: "Analytics & Métricas",
                                desc: "Entendé qué hace tu público en tu sitio. Configuramos herramientas para medir y mejorar continuamente.",
                                items: ["Google Analytics 4", "Mapa de calor", "Embudos de conversión", "Dashboard personalizado"],
                            },
                            {
                                icon: Globe,
                                color: "bg-teal-50 text-teal-600",
                                title: "Mantenimiento Web",
                                desc: "Tu web actualizada, segura y funcionando siempre. Nosotros nos encargamos, vos te enfocás en tu negocio.",
                                items: ["Actualizaciones mensuales", "Backup automático", "Soporte por WhatsApp", "Uptime monitoring"],
                            },
                        ].map(s => (
                            <div key={s.title}
                                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-violet-300 hover:shadow-md transition-all group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                                </div>
                                <ul className="space-y-1.5">
                                    {s.items.map(item => (
                                        <li key={item} className="flex items-center gap-2 text-xs text-slate-500">
                                            <CheckCircle className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── POR QUÉ NOSOTROS ──────────────────────────── */}
            <section id="proyectos" className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Por qué elegirnos</p>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Trabajamos como si fuera nuestro propio negocio
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                n: "01",
                                title: "Resultados medibles",
                                desc: "No hacemos páginas web lindas que no venden. Cada decisión de diseño está orientada a la conversión.",
                            },
                            {
                                n: "02",
                                title: "Comunicación directa",
                                desc: "Vas a hablar con quien hace el trabajo. Sin intermediarios, sin demoras, sin sorpresas en el presupuesto.",
                            },
                            {
                                n: "03",
                                title: "Tecnología de punta",
                                desc: "Usamos las mismas herramientas que usan las startups más exitosas. Rápido, seguro y escalable.",
                            },
                        ].map(s => (
                            <div key={s.n} className="relative pl-12 space-y-3">
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-violet-600 text-white text-xs font-black flex items-center justify-center shadow-md">
                                    {s.n}
                                </div>
                                <h3 className="font-bold text-slate-900">{s.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MATECITODB COMING SOON ────────────────────── */}
            <section className="py-20 px-6 bg-gradient-to-br from-violet-600 to-violet-700">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white text-xs font-semibold">
                        <Sparkles className="w-3 h-3" />
                        Próximamente
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        También estamos construyendo<br />
                        <span className="text-violet-200">matecitodb</span>
                    </h2>
                    <p className="text-violet-200 text-lg max-w-xl mx-auto leading-relaxed">
                        Un backend-as-a-service hecho en Argentina: base de datos, autenticación,
                        storage y API REST listos en minutos. Para desarrolladores que quieren
                        moverse rápido sin perder control.
                    </p>
                    <Link href="/#newsletter"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-violet-700 font-bold text-sm rounded-xl hover:bg-violet-50 transition-all shadow-lg">
                        Anotarme para la beta
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* ── CONTACTO ──────────────────────────────────── */}
            <section id="contacto" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Hablemos</p>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        ¿Tenés un proyecto en mente?
                    </h2>
                    <p className="text-slate-500 text-lg">
                        Contanos tu idea y te respondemos en menos de 24 horas con una propuesta a medida.
                    </p>
                    <a href="https://wa.me/541124025239?text=Hola%2C%20quiero%20consultarles%20sobre%20una%20p%C3%A1gina%20web"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-bold text-sm rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">
                        Escribinos por WhatsApp
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>

            {/* ── NEWSLETTER ────────────────────────────────── */}
            <section id="newsletter" className="py-20 px-6 border-t border-slate-200">
                <div className="max-w-xl mx-auto text-center space-y-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Mantenete al día</p>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Dejá tu email y te avisamos
                    </h2>
                    <p className="text-slate-500 leading-relaxed">
                        Estamos desarrollando <span className="font-semibold text-slate-700">matecitodb</span> —
                        nuestro backend-as-a-service para developers argentinos.
                        Dejá tu email y te notificamos cuando abramos el acceso,
                        además de tips de web y negocios digitales. Sin spam.
                    </p>
                    <NewsletterForm />
                </div>
            </section>

        </div>
    )
}

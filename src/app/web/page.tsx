import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Globe, Smartphone, Search, Zap, BarChart3, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
    title: "Páginas Web y Landings para Pymes en Argentina — matecito.dev",
    description: "Diseñamos y desarrollamos páginas web y landing pages de alta conversión para pymes y emprendimientos. SEO optimizado, diseño profesional, entrega rápida. Pergamino y todo el país.",
    keywords: [
        "páginas web pymes Argentina", "landing page emprendimiento Argentina",
        "diseño web Pergamino", "desarrollo web pymes Buenos Aires",
        "landing page conversión", "agencia web Argentina", "sitio web empresa",
        "página web profesional Argentina", "SEO pymes Argentina",
    ],
    openGraph: {
        title: "Páginas Web y Landings para Pymes — matecito.dev",
        description: "Diseño web profesional para pymes y emprendimientos. SEO, alta conversión, entrega rápida. Pergamino y todo el país.",
        url: "https://matecito.dev/web",
        siteName: "matecito.dev",
        locale: "es_AR",
        type: "website",
        images: [{ url: "https://matecito.dev/og/web.png", width: 1200, height: 630, alt: "Páginas web para pymes — matecito.dev" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Páginas Web y Landings para Pymes — matecito.dev",
        description: "Diseño web profesional para pymes. SEO + alta conversión. Pergamino y todo el país.",
    },
    alternates: { canonical: "https://matecito.dev/web" },
}

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            name: "matecito.dev",
            url: "https://matecito.dev/web",
            description: "Agencia de desarrollo web para pymes y emprendimientos en Argentina. Diseño, SEO y landing pages de alta conversión.",
            address: { "@type": "PostalAddress", addressLocality: "Pergamino", addressRegion: "Buenos Aires", addressCountry: "AR" },
            areaServed: { "@type": "Country", name: "Argentina" },
            telephone: "+541124025239",
            priceRange: "$$",
            hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicios web",
                itemListElement: [
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landing Pages" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sitios Web Completos" } },
                    { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO y Posicionamiento" } },
                ],
            },
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: "https://matecito.dev" },
                { "@type": "ListItem", position: 2, name: "Webs & Landings", item: "https://matecito.dev/web" },
            ],
        },
    ],
}

const SERVICES = [
    {
        icon: Globe,
        title: "Landing Pages",
        desc: "Una página enfocada en convertir. Perfecta para lanzar un producto, servicio o campaña.",
        items: ["Diseño a medida", "Carga ultrarrápida", "Formulario de contacto", "Integración WhatsApp"],
    },
    {
        icon: Smartphone,
        title: "Sitios Web Completos",
        desc: "Presencia digital profesional para tu pyme. Varias páginas, catálogo, historia y más.",
        items: ["Diseño responsivo", "Panel de administración", "Blog / novedades", "Multi-idioma opcional"],
    },
    {
        icon: Search,
        title: "SEO & Posicionamiento",
        desc: "Que te encuentren en Google. Optimizamos tu presencia orgánica de forma sostenible.",
        items: ["SEO técnico", "Contenido optimizado", "SEO local (Google Maps)", "Reportes mensuales"],
    },
    {
        icon: Zap,
        title: "Performance",
        desc: "¿Tu web es lenta? La optimizamos para que cargue en menos de 2 segundos.",
        items: ["Core Web Vitals", "Imágenes optimizadas", "Caché avanzado", "CDN configurado"],
    },
    {
        icon: BarChart3,
        title: "Analytics & Métricas",
        desc: "Entendé qué hace tu público. Herramientas para medir y mejorar continuamente.",
        items: ["Google Analytics 4", "Mapa de calor", "Embudos de conversión", "Dashboard personalizado"],
    },
    {
        icon: Globe,
        title: "Mantenimiento",
        desc: "Tu web actualizada, segura y funcionando siempre. Vos te enfocás en tu negocio.",
        items: ["Actualizaciones mensuales", "Backup automático", "Soporte por WhatsApp", "Uptime monitoring"],
    },
]

export default function WebPage() {
    return (
        <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main className="min-h-screen bg-black text-white">

            {/* Hero */}
            <section className="px-6 pt-20 pb-20 max-w-4xl mx-auto text-center">
                <p className="text-xs font-mono mb-6" style={{ color: 'rgba(240,240,240,0.35)' }}>
                    matecito.dev / web
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-mono mb-8"
                    style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(240,240,240,0.50)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6d001a]" />
                    Pergamino · Buenos Aires · Todo el país
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
                    Tu negocio merece<br />
                    <span style={{ color: '#6d001a' }}>una web que venda</span>
                </h1>
                <p className="text-lg max-w-xl mx-auto leading-relaxed mb-10"
                    style={{ color: 'rgba(240,240,240,0.55)' }}>
                    Diseñamos y desarrollamos páginas web y landings profesionales para emprendimientos y pymes.
                    Moderno, rápido, SEO, y enfocado en convertir visitantes en clientes.
                </p>
                <a
                    href="https://wa.me/541124025239?text=Hola%2C%20quiero%20consultarles%20sobre%20una%20p%C3%A1gina%20web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#6d001a' }}>
                    Empezar mi proyecto
                    <ArrowRight className="w-4 h-4" />
                </a>
            </section>

            {/* Services */}
            <section className="px-6 pb-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="max-w-4xl mx-auto pt-20">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                        style={{ color: '#6d001a' }}>Lo que hacemos</p>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-12" style={{ color: '#f0f0f0' }}>
                        Soluciones web para hacer crecer tu negocio
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SERVICES.map(s => {
                            const Icon = s.icon
                            return (
                                <div key={s.title}
                                    className="flex flex-col gap-4 p-6 rounded-2xl border"
                                    style={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.10)' }}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: '#1c1c1c' }}>
                                        <Icon className="w-5 h-5" style={{ color: 'rgba(240,240,240,0.65)' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1.5" style={{ color: '#f0f0f0' }}>{s.title}</h3>
                                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,240,0.50)' }}>{s.desc}</p>
                                    </div>
                                    <ul className="space-y-1.5 mt-auto">
                                        {s.items.map(item => (
                                            <li key={item} className="flex items-center gap-2 text-xs"
                                                style={{ color: 'rgba(240,240,240,0.45)' }}>
                                                <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#6d001a' }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Why us */}
            <section className="px-6 pb-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="max-w-4xl mx-auto pt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { n: "01", title: "Resultados medibles", desc: "No hacemos páginas web lindas que no venden. Cada decisión de diseño está orientada a la conversión." },
                        { n: "02", title: "Comunicación directa", desc: "Vas a hablar con quien hace el trabajo. Sin intermediarios, sin demoras, sin sorpresas en el presupuesto." },
                        { n: "03", title: "Tecnología de punta", desc: "Usamos las mismas herramientas que usan las startups más exitosas. Rápido, seguro y escalable." },
                    ].map(s => (
                        <div key={s.n} className="relative pl-11">
                            <div className="absolute left-0 top-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                                style={{ backgroundColor: '#6d001a' }}>
                                {s.n}
                            </div>
                            <h3 className="font-bold mb-2" style={{ color: '#f0f0f0' }}>{s.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,240,0.50)' }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="max-w-2xl mx-auto pt-20 text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ color: '#f0f0f0' }}>
                        ¿Tenés un proyecto en mente?
                    </h2>
                    <p className="text-lg mb-8" style={{ color: 'rgba(240,240,240,0.55)' }}>
                        Contanos tu idea y te respondemos en menos de 24 horas con una propuesta a medida.
                    </p>
                    <a
                        href="https://wa.me/541124025239?text=Hola%2C%20quiero%20consultarles%20sobre%20una%20p%C3%A1gina%20web"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#6d001a' }}>
                        Escribinos por WhatsApp
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>

        </main>
        </>
    )
}

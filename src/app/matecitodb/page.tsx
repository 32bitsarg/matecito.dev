import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Database, Lock, HardDrive, Zap, Shield, Terminal, MapPin, Package } from 'lucide-react'
import { NewsletterInline } from '@/components/newsletter/NewsletterInline'
import { DatabaseTerminal } from '@/components/ascii/DatabaseTerminal'
import { QuickstartTabs } from '@/components/matecitodb/QuickstartTabs'

function getSdkVersion(): string {
    try {
        const pkgPath = path.resolve(process.cwd(), '..', 'matecitosdk', 'matecitodb', 'package.json')
        return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version
    } catch {
        return process.env.SDK_VERSION ?? '2.0.0'
    }
}

export const metadata: Metadata = {
    title: 'matecitodb — Backend as a Service para developers argentinos',
    description: 'matecitodb es un BaaS open-source hecho en Argentina. Auth, base de datos PostgreSQL, storage, realtime y API REST en un SDK. npm install matecitodb y listo.',
    keywords: [
        'BaaS Argentina', 'backend as a service Argentina', 'SDK JavaScript backend',
        'matecitodb', 'base de datos tiempo real', 'auth SDK JavaScript',
        'alternativa Supabase Argentina', 'backend developer Argentina',
        'API REST SDK', 'storage archivos JavaScript',
    ],
    openGraph: {
        title: 'matecitodb — BaaS para developers argentinos',
        description: 'Auth, base de datos, storage y realtime. Un SDK. Sin configurar servidores. Hecho en Argentina.',
        url: 'https://matecito.dev/matecitodb',
        siteName: 'matecito.dev',
        locale: 'es_AR',
        type: 'website',
        images: [{ url: 'https://matecito.dev/og/matecitodb.png', width: 1200, height: 630, alt: 'matecitodb — BaaS para developers argentinos' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'matecitodb — BaaS para developers argentinos',
        description: 'Auth, base de datos, storage y realtime. Un SDK. Hecho en Argentina.',
        images: ['https://matecito.dev/og/matecitodb.png'],
    },
    alternates: { canonical: 'https://matecito.dev/matecitodb' },
}

const FEATURES = [
    {
        icon: Lock,
        title: 'Autenticación completa',
        desc: 'Login, registro, JWT, reset de contraseña. Todo listo sin configurar nada extra.',
        items: ['Registro y login', 'Tokens JWT', 'Reset de contraseña', 'Sesiones persistentes'],
    },
    {
        icon: Database,
        title: 'Base de datos en tiempo real',
        desc: 'Filtrá, paginá y ordená tus datos con una API limpia y predecible sobre PostgreSQL.',
        items: ['Filtros avanzados', 'Paginación', 'Ordenamiento', 'Selección de campos'],
    },
    {
        icon: HardDrive,
        title: 'Storage de archivos',
        desc: 'Subí archivos e imágenes y generá URLs firmadas para acceso controlado.',
        items: ['Subida de archivos', 'Imágenes optimizadas', 'URLs firmadas', 'Control de acceso'],
    },
    {
        icon: Zap,
        title: 'Operaciones en lote',
        desc: 'Ejecutá hasta 50 operaciones en un solo request. Eficiente y rápido.',
        items: ['Hasta 50 ops/request', 'Transaccional', 'Rollback automático', 'Menor latencia'],
    },
    {
        icon: Shield,
        title: 'Permisos granulares',
        desc: 'Controlá el acceso con roles: auth, public, service y nobody.',
        items: ['Rol auth', 'Rol public', 'Rol service', 'Rol nobody'],
    },
    {
        icon: Terminal,
        title: 'Dashboard incluido',
        desc: 'Gestioná colecciones, usuarios, storage y logs desde una consola web.',
        items: ['Editor SQL', 'Gestión de usuarios', 'Visor de logs', 'API Explorer'],
    },
]

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'SoftwareApplication',
            name: 'matecitodb',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            url: 'https://matecito.dev/matecitodb',
            description: 'Backend as a Service para developers argentinos. Auth, base de datos PostgreSQL, storage, realtime y API REST en un SDK JavaScript.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS', availability: 'https://schema.org/InStock' },
            author: { '@type': 'Organization', name: 'matecito.dev', url: 'https://matecito.dev' },
            softwareVersion: '2.0.0',
            keywords: 'BaaS, backend as a service, auth, storage, realtime, PostgreSQL, Argentina',
        },
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://matecito.dev' },
                { '@type': 'ListItem', position: 2, name: 'matecitodb', item: 'https://matecito.dev/matecitodb' },
            ],
        },
        {
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: '¿Qué es matecitodb?',
                    acceptedAnswer: { '@type': 'Answer', text: 'matecitodb es un Backend as a Service (BaaS) hecho en Argentina. Provee autenticación, base de datos PostgreSQL, storage de archivos y API REST en un solo SDK JavaScript.' },
                },
                {
                    '@type': 'Question',
                    name: '¿Cómo instalo matecitodb?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Instalá el SDK con npm: npm install matecitodb. Luego inicializá el cliente con tu URL y API key.' },
                },
                {
                    '@type': 'Question',
                    name: '¿Es gratuito matecitodb?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Actualmente matecitodb está en beta. Podés anotarte para acceso anticipado gratuitamente.' },
                },
            ],
        },
    ],
}

export default function MatecitoDB() {
    const sdkVersion = getSdkVersion()

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="min-h-screen bg-black text-white">

                {/* Hero */}
                <section className="relative px-6 pt-28 pb-24 overflow-hidden" aria-label="Presentación de matecitodb">
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
                        aria-hidden="true" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-[100px] opacity-20"
                        style={{ backgroundColor: '#6d001a' }}
                        aria-hidden="true" />

                    <div className="relative max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    {/* left — copy */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm border"
                                style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.10)', color: '#e2e8f0' }}>
                                <Package className="w-3.5 h-3.5" style={{ color: 'rgba(240,240,240,0.40)' }} aria-hidden="true" />
                                <code>npm install matecitodb</code>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border"
                                style={{ backgroundColor: 'rgba(109,0,26,0.20)', borderColor: 'rgba(109,0,26,0.45)', color: '#e0a0a0' }}>
                                v{sdkVersion} · beta
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
                            El BaaS que querías.<br />
                            <span style={{ color: '#6d001a' }}>Sin sorpresas.</span>
                        </h1>

                        <p className="text-xl max-w-2xl mx-auto leading-relaxed mb-12"
                            style={{ color: 'rgba(240,240,240,0.50)' }}>
                            Autenticación, base de datos PostgreSQL, storage y realtime.
                            Todo en un SDK argentino, listo para producción.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                            <a href="#newsletter"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-85"
                                style={{ backgroundColor: '#6d001a' }}>
                                Anotarme al lanzamiento
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </a>
                            <Link href="/docs"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold border transition-colors hover:bg-white/5"
                                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,240,240,0.65)' }}>
                                Ver documentación
                            </Link>
                        </div>
                    </div>

                    {/* right — terminal */}
                    <div className="shrink-0 hidden lg:block">
                        <DatabaseTerminal />
                    </div>

                    </div>
                </section>

                {/* Trust bar */}
                <aside className="px-6 py-5 border-y" style={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.07)' }}
                    aria-label="Proyectos que usan matecitodb">
                    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                            <span style={{ color: 'rgba(240,240,240,0.60)' }}>
                                Usado en producción en{' '}
                                <a href="https://recienllegue.com.ar" target="_blank" rel="noopener noreferrer"
                                    className="underline underline-offset-2 hover:text-white transition-colors">
                                    recienllegue.com.ar
                                </a>
                            </span>
                        </div>
                        <div className="hidden sm:block w-px h-4" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} aria-hidden="true" />
                        <div className="flex items-center gap-1.5" style={{ color: 'rgba(240,240,240,0.40)' }}>
                            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Hecho en Pergamino, Buenos Aires, Argentina</span>
                        </div>
                    </div>
                </aside>

                {/* Features */}
                <section id="features" className="px-6 py-24 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                    aria-label="Características de matecitodb">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(240,240,240,0.30)' }}>
                            Qué incluye
                        </p>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{ color: '#f0f0f0' }}>
                            Todo lo que necesitás, nada más
                        </h2>
                        <p className="text-base mb-12 max-w-xl" style={{ color: 'rgba(240,240,240,0.45)' }}>
                            Un SDK que cubre el 90% de lo que necesita una app moderna. Sin configurar múltiples servicios separados.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {FEATURES.map(f => {
                                const Icon = f.icon
                                return (
                                    <article key={f.title}
                                        className="flex flex-col gap-4 p-6 rounded-2xl border transition-colors hover:border-[rgba(255,255,255,0.18)]"
                                        style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.09)' }}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
                                            style={{ backgroundColor: '#161616', borderColor: 'rgba(255,255,255,0.08)' }}
                                            aria-hidden="true">
                                            <Icon className="w-5 h-5" style={{ color: 'rgba(240,240,240,0.55)' }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1.5" style={{ color: '#f0f0f0' }}>{f.title}</h3>
                                            <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,240,0.45)' }}>{f.desc}</p>
                                        </div>
                                        <ul className="space-y-1.5 mt-auto" aria-label={`Características de ${f.title}`}>
                                            {f.items.map(item => (
                                                <li key={item} className="flex items-center gap-2 text-xs"
                                                    style={{ color: 'rgba(240,240,240,0.40)' }}>
                                                    <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#6d001a' }} aria-hidden="true" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Code snippet */}
                <section id="quickstart" className="px-6 py-24 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                    aria-label="Ejemplo de código de matecitodb">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(240,240,240,0.30)' }}>
                            Así de simple
                        </p>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-12" style={{ color: '#f0f0f0' }}>
                            De <code className="font-mono">npm install</code> a producción en minutos
                        </h2>

                        <QuickstartTabs />
                    </div>
                </section>

                {/* Newsletter */}
                <section id="newsletter" className="px-6 py-24 border-t"
                    style={{ borderColor: 'rgba(255,255,255,0.07)', backgroundColor: '#0a0a0a' }}
                    aria-label="Suscribirse al lanzamiento de matecitodb">
                    <div className="max-w-2xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border"
                            style={{ backgroundColor: 'rgba(109,0,26,0.20)', borderColor: 'rgba(109,0,26,0.50)', color: '#e0a0a0' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6d001a] animate-pulse" aria-hidden="true" />
                            Acceso anticipado
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#f0f0f0' }}>
                            Sé el primero<br />en usarlo
                        </h2>
                        <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(240,240,240,0.50)' }}>
                            Dejá tu email y te avisamos cuando abramos el acceso público a matecitodb.
                            Sin spam, solo lo importante.
                        </p>
                        <NewsletterInline />
                    </div>
                </section>

            </main>
        </>
    )
}
